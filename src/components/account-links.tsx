"use client";

import { useAuth } from "@/components/auth-provider";
import Link from "next/link";

export function AccountLinks() {
  const { user, loading, signOut } = useAuth();
  if (loading) return null;
  if (!user) {
    return (
      <Link
        href="/entrar"
        className="hidden text-sm text-zinc-600 hover:text-zinc-900 md:inline"
      >
        Entrar
      </Link>
    );
  }
  return (
    <span className="hidden items-center gap-3 text-sm md:flex">
      <Link href="/conta" className="text-zinc-600 hover:text-zinc-900">
        Minha conta
      </Link>
      <button type="button" className="text-zinc-500" onClick={() => void signOut()}>
        Sair
      </button>
    </span>
  );
}
