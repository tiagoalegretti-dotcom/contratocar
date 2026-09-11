"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "firebase/auth";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  ready: boolean;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  idToken: () => Promise<string | null>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const { firebaseReady, getFirebaseAuth, googleProvider } = await import(
        "@/lib/firebase"
      );
      if (cancelled) return;
      setReady(firebaseReady());
      const auth = getFirebaseAuth();
      if (!auth) {
        setLoading(false);
        return;
      }
      try {
        const { getRedirectResult } = await import("firebase/auth");
        await getRedirectResult(auth);
      } catch {
        /* popup ou redirect cancelado */
      }
      if (cancelled) return;
      unsub = auth.onAuthStateChanged((next) => {
        setUser(next);
        setLoading(false);
      });
    })();
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      loading,
      ready,
      async signInGoogle() {
        const { getFirebaseAuth, googleProvider } = await import("@/lib/firebase");
        const auth = getFirebaseAuth();
        if (!auth) throw new Error("Firebase não configurado");
        const { signInWithPopup, signInWithRedirect } = await import("firebase/auth");
        try {
          await signInWithPopup(auth, googleProvider);
        } catch {
          await signInWithRedirect(auth, googleProvider);
        }
      },
      async signOut() {
        const { getFirebaseAuth } = await import("@/lib/firebase");
        const auth = getFirebaseAuth();
        if (!auth) return;
        const { signOut } = await import("firebase/auth");
        await signOut(auth);
      },
      async idToken() {
        if (!user) return null;
        return user.getIdToken();
      },
    }),
    [user, loading, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth precisa do AuthProvider");
  return ctx;
}

export function afterLoginPath() {
  try {
    if (sessionStorage.getItem("contratocar-checkout")) return "/pagar";
  } catch {
    /* ignore */
  }
  return "/conta";
}
