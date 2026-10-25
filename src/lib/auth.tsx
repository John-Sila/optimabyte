import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { firebaseConfigured } from "./firebase";
import type { AdminUser } from "./auth-impl";

interface AuthContextValue {
  /** The signed-in admin, or null for regular visitors. */
  admin: AdminUser | null;
  /** False only while we are restoring a saved admin session. */
  ready: boolean;
  loginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Admin is signed out after this long without any activity. */
export const IDLE_LIMIT_MS = 60 * 60 * 1000;
const WARN_BEFORE_MS = 5 * 60 * 1000;
const ACTIVE_KEY = "ob_admin_last_active";

const readActive = (): number => {
  try {
    return Number(sessionStorage.getItem(ACTIVE_KEY)) || 0;
  } catch {
    return 0;
  }
};
const writeActive = (t: number) => {
  try {
    sessionStorage.setItem(ACTIVE_KEY, String(t));
  } catch {
    /* ignore */
  }
};
const clearActive = () => {
  try {
    sessionStorage.removeItem(ACTIVE_KEY);
  } catch {
    /* ignore */
  }
};

function hasStoredAuthKey(): boolean {
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      if (sessionStorage.key(i)?.startsWith("firebase:authUser:")) return true;
    }
  } catch {
    /* storage unavailable */
  }
  return false;
}

/** True when Firebase Auth has a saved session in this tab that is still within the idle limit. */
function hasSavedSession(): boolean {
  try {
    // Sessions saved by older versions used localStorage and never expired: drop them.
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k?.startsWith("firebase:authUser:")) localStorage.removeItem(k);
    }
    for (let i = 0; i < sessionStorage.length; i++) {
      if (sessionStorage.key(i)?.startsWith("firebase:authUser:")) {
        const last = readActive();
        return last > 0 && Date.now() - last < IDLE_LIMIT_MS;
      }
    }
  } catch {
    /* storage unavailable */
  }
  return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(() => !firebaseConfigured || !hasSavedSession());
  const [loginOpen, setLoginOpen] = useState(false);
  const watching = useRef<Promise<void> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location.pathname);
  locationRef.current = location.pathname;

  // The auth SDK is only downloaded for visitors who actually have (or start) an
  // admin session, so everyone else gets a lighter, faster site.
  const startWatching = useCallback(() => {
    if (!watching.current) {
      watching.current = import("./auth-impl").then((m) => {
        m.watchAuth((user) => {
          setAdmin(user);
          setReady(true);
        });
      });
    }
    return watching.current;
  }, []);

  useEffect(() => {
    if (firebaseConfigured && hasSavedSession()) void startWatching();
    else if (firebaseConfigured && hasStoredAuthKey()) {
      // A saved session that has gone idle for too long: sign it out properly.
      clearActive();
      void import("./auth-impl").then((m) => m.signOutAdmin()).catch(() => undefined);
    }
  }, [startWatching]);

  const login = useCallback(
    async (password: string) => {
      const impl = await import("./auth-impl");
      const user = await impl.signInAdmin(password);
      writeActive(Date.now());
      setAdmin(user);
      setReady(true);
      void startWatching();
      // Log device, time and location of this sign-in (runs in the background).
      void import("./admin-data").then((m) => m.recordAdminLogin());
    },
    [startWatching],
  );

  const endSession = useCallback(
    async (message?: string) => {
      clearActive();
      try {
        const impl = await import("./auth-impl");
        await impl.signOutAdmin();
      } catch {
        /* already signed out */
      }
      setAdmin(null);
      // Replace, so the admin page is not one Back press away.
      if (locationRef.current.startsWith("/admin")) navigate("/", { replace: true });
      if (message) toast(message);
    },
    [navigate],
  );

  const logout = useCallback(async () => {
    await endSession("Signed out");
  }, [endSession]);

  // Idle timeout: any click, key, scroll, touch or mouse move counts as activity.
  useEffect(() => {
    if (!admin) return;
    let warned = false;
    let lastWrite = 0;
    const bump = () => {
      const now = Date.now();
      if (now - lastWrite < 5000) return; // throttle storage writes
      lastWrite = now;
      warned = false;
      writeActive(now);
    };
    bump();
    const events = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart", "visibilitychange"] as const;
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    const timer = window.setInterval(() => {
      const idle = Date.now() - (readActive() || Date.now());
      if (idle >= IDLE_LIMIT_MS) {
        void endSession("You were signed out after an hour of inactivity.");
      } else if (!warned && idle >= IDLE_LIMIT_MS - WARN_BEFORE_MS) {
        warned = true;
        toast.warning("You will be signed out in about 5 minutes due to inactivity. Move or tap to stay signed in.");
      }
    }, 15000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      window.clearInterval(timer);
    };
  }, [admin, endSession]);

  // Back/forward cache: a page restored from history must re-check the session.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      admin,
      ready,
      loginOpen,
      openLogin: () => setLoginOpen(true),
      closeLogin: () => setLoginOpen(false),
      login,
      logout,
    }),
    [admin, ready, loginOpen, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
