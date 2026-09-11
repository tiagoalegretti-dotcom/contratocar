"use client";

import { firebaseReady, getFirebaseAuth, googleProvider } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

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
  const ready = firebaseReady();

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      loading,
      ready,
      async signInGoogle() {
        const auth = getFirebaseAuth();
        if (!auth) throw new Error("Firebase não configurado");
        await signInWithPopup(auth, googleProvider);
      },
      async signOut() {
        const auth = getFirebaseAuth();
        if (auth) await fbSignOut(auth);
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
