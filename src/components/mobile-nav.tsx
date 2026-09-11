"use client";

import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#faq", label: "Dúvidas" },
  { href: "/recibo", label: "Recibo" },
  { href: "/calculadora-ipva", label: "IPVA" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="grid h-11 w-11 place-items-center rounded-full border border-zinc-200 text-zinc-800"
        aria-expanded={open}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "×" : "☰"}
      </button>
      {open && (
        <div className="fixed inset-x-0 bottom-0 top-14 z-50 overflow-y-auto border-t border-zinc-200 bg-white p-4">
          <nav className="grid gap-1 text-base">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex min-h-12 items-center rounded-xl px-3 hover:bg-zinc-50"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {!loading && user && (
              <>
                <Link
                  href="/conta"
                  className="flex min-h-12 items-center rounded-xl px-3 hover:bg-zinc-50"
                  onClick={() => setOpen(false)}
                >
                  Minha conta
                </Link>
                <button
                  type="button"
                  className="flex min-h-12 items-center rounded-xl px-3 text-left text-zinc-600"
                  onClick={() => {
                    setOpen(false);
                    void signOut();
                  }}
                >
                  Sair
                </button>
              </>
            )}
            {!loading && !user && (
              <Link
                href="/entrar"
                className="flex min-h-12 items-center rounded-xl px-3 hover:bg-zinc-50"
                onClick={() => setOpen(false)}
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
