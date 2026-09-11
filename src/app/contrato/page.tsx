import { Wizard } from "@/components/wizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerar contrato de compra e venda de carro",
  description:
    "Preencha vendedor, comprador, veículo e valor. Depois pague, complete os dados, assine e baixe o contrato de compra e venda de veículo.",
  alternates: { canonical: "/contrato" },
};

export default function ContratoPage() {
  return <Wizard />;
}
