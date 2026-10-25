import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { ADMIN_EMAIL, firebaseConfigured } from "@/lib/firebase";

function friendlyError(err: unknown): string {
  const code = (err as { code?: string } | null)?.code ?? "";
  if (!firebaseConfigured) return "Admin sign-in is not set up on this site yet.";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "That password is not correct.";
  if (code.includes("too-many-requests")) return "Too many attempts. Please wait a few minutes and try again.";
  if (code.includes("network")) return "Network problem. Check your connection and try again.";
  if (code.includes("user-disabled")) return "This account has been disabled.";
  return "Could not sign in. Please try again.";
}

export default function AdminLoginDialog() {
  const { loginOpen, closeLogin, login, locating, cancelLocating } = useAuth();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loginOpen) {
      setPassword("");
      setShow(false);
      setError("");
      setBusy(false);
    }
  }, [loginOpen]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError("");
    try {
      await login(password);
      toast.success("Signed in as Admin");
      closeLogin();
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  };

  return (
    <>
    <Dialog open={locating} onOpenChange={(open) => !open && cancelLocating()}>
      <DialogContent className="sm:max-w-sm" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="items-center text-center sm:text-center">
          <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Loader2 className="h-7 w-7 animate-spin text-gold-text" aria-hidden="true" />
          </div>
          <DialogTitle className="text-xl">Authenticating session</DialogTitle>
          <DialogDescription role="status" aria-live="polite">
            Checking your device location before sign-in. If your browser asks for permission, choose Allow.
          </DialogDescription>
        </DialogHeader>
        <Button type="button" variant="ghost" className="w-full" onClick={cancelLocating}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>

    <Dialog open={loginOpen} onOpenChange={(open) => !open && closeLogin()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="items-center text-center sm:text-center">
          <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 animate-pop">
            <ShieldCheck className="h-7 w-7 text-gold-text" />
          </div>
          <DialogTitle className="text-xl">Admin sign-in</DialogTitle>
          <DialogDescription>Enter the admin password to manage the site.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium">
              Admin email
            </label>
            <input
              id="admin-email"
              type="email"
              value={ADMIN_EMAIL}
              readOnly
              tabIndex={-1}
              autoComplete="username"
              aria-readonly="true"
              className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground outline-none"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                autoFocus
                autoComplete="current-password"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="animate-fade-up text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={!password || busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
