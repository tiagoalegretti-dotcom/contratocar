"use client";

import { BrandLockup } from "@/components/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const path = usePathname();
  const compact =
    path.startsWith("/contrato") ||
    path.startsWith("/pago") ||
    path.startsWith("/entrar") ||
    path.startsWith("/pagar");

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" className="inline-flex">
          <BrandLockup />
        </Link>
        {!compact && (
          <nav className="hidden items-center gap-6 text-sm text-zinc-600 sm:flex">
            <a href="#como-funciona">Como funciona</a>
            <a href="#beneficios">Assinatura</a>
            <a href="#faq">Dúvidas</a>
          </nav>
        )}
        {!compact && (
          <Link
            href="/contrato"
            className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            Gerar contrato
          </Link>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} ContratoCar. Modelo para uso entre particulares.</p>
        <p>Não substitui um advogado.</p>
      </div>
    </footer>
  );
}
