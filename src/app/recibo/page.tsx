import { ReciboTool } from "@/components/recibo-tool";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recibo de venda de veículo grátis",
  description:
    "Gere um recibo de compra e venda de carro na hora. Grátis, sem cadastro. Não substitui o contrato nem a transferência no app do governo.",
  alternates: { canonical: "/recibo" },
};

export default function ReciboPage() {
  return (
    <div>
      <ReciboTool />
      <p className="mx-auto max-w-5xl px-4 pb-12 text-center text-sm text-zinc-600 print:hidden">
        Recibo não substitui contrato.{" "}
        <Link href="/contrato" className="font-medium text-violet-700">
          Gerar contrato completo
        </Link>
      </p>
    </div>
  );
}
