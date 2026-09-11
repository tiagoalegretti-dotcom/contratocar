import { BrandLockup } from "@/components/logo";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link href="/" className="inline-flex min-h-11 items-center">
          <BrandLockup />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
          <Link href="/#como-funciona">Como funciona</Link>
          <Link href="/#ferramentas">Ferramentas grátis</Link>
          <Link href="/#beneficios">Assinatura</Link>
          <Link href="/recibo">Recibo</Link>
        </nav>
        <Link
          href="/contrato"
          className="inline-flex min-h-11 items-center rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Gerar contrato
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} ContratoCar. Modelo para uso entre particulares.</p>
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/recibo" className="min-h-11 inline-flex items-center hover:text-zinc-800">
            Recibo grátis
          </Link>
          <Link href="/calculadora-ipva" className="min-h-11 inline-flex items-center hover:text-zinc-800">
            Calculadora de IPVA
          </Link>
        </p>
        <p>Não substitui um advogado.</p>
      </div>
    </footer>
  );
}
