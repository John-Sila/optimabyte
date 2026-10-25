// Loaded lazily (dynamic import) the first time admin sign-in is needed.
import {
  browserSessionPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { ADMIN_EMAIL, getFirebaseApp } from "./firebase";

export interface AdminUser {
  email: string;
  name: string;
}

function toAdmin(user: User | null): AdminUser | null {
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) return null;
  return { email: user.email, name: user.displayName || "Admin" };
}

export function watchAuth(cb: (user: AdminUser | null) => void): () => void {
  const auth = getAuth(getFirebaseApp());
  return onAuthStateChanged(auth, (user) => {
    if (user && !toAdmin(user)) {
      // Anyone who is not the admin account is signed straight back out.
      void signOut(auth);
      cb(null);
      return;
    }
    cb(toAdmin(user));
  });
}

export async function signInAdmin(password: string): Promise<AdminUser> {
  const auth = getAuth(getFirebaseApp());
  // Session-only: closing the tab or browser ends the admin session.
  await setPersistence(auth, browserSessionPersistence);
  const cred = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
  const admin = toAdmin(cred.user);
  if (!admin) {
    await signOut(auth);
    throw new Error("not-admin");
  }
  return admin;
}

export async function signOutAdmin(): Promise<void> {
  await signOut(getAuth(getFirebaseApp()));
}
