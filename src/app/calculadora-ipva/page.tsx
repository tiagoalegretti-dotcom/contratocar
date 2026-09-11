import { IpvaTool } from "@/components/ipva-tool";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Calculadora de IPVA proporcional na venda do carro",
  description:
    "Calcule o IPVA proporcional no mês da venda do veículo e some multas. Grátis, sem cadastro. Use o valor no contrato.",
  alternates: { canonical: "/calculadora-ipva" },
};

export default function IpvaPage() {
  return (
    <div>
      <IpvaTool />
      <p className="mx-auto max-w-xl px-4 pb-12 text-center text-sm text-zinc-600">
        Coloque o acerto no contrato.{" "}
        <Link href="/contrato" className="font-medium text-violet-700">
          Gerar contrato completo
        </Link>
      </p>
    </div>
  );
}
