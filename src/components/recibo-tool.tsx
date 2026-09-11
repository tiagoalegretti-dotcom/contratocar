"use client";

import { formatBRL, moneyExtenso, parseBRL } from "@/lib/money";
import { useMemo, useState } from "react";

const input =
  "min-h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 text-base outline-none focus:border-violet-500";

export function ReciboTool() {
  const [seller, setSeller] = useState("");
  const [buyer, setBuyer] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [plate, setPlate] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const value = parseBRL(price);
  const dateLabel = useMemo(() => {
    if (!date) return "";
    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y}`;
  }, [date]);

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-2 lg:px-6">
      <div className="print:hidden">
        <p className="text-sm font-medium text-violet-700">Grátis</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Recibo de venda de veículo
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Preencha e imprima. Sem cadastro. Para um contrato com cláusulas e
          assinatura no site, use o gerador completo.
        </p>
        <div className="mt-6 grid gap-3">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Vendedor</span>
            <input className={input} value={seller} onChange={(e) => setSeller(e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Comprador</span>
            <input className={input} value={buyer} onChange={(e) => setBuyer(e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Veículo (marca e modelo)</span>
            <input className={input} value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Placa</span>
            <input
              className={input}
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Valor (R$)</span>
            <input className={input} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Cidade</span>
            <input className={input} value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Data</span>
            <input className={input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="mt-5 min-h-12 w-full rounded-full bg-violet-600 px-5 text-base font-medium text-white hover:bg-violet-700 sm:w-auto"
        >
          Imprimir recibo
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-[#faf8f4] p-8 font-serif text-sm leading-relaxed shadow-sm print:border-0 print:shadow-none">
        <h2 className="text-center text-lg font-bold">RECIBO DE VENDA DE VEÍCULO</h2>
        <p className="mt-6">
          Eu, {seller || "________________"}, declaro que recebi de{" "}
          {buyer || "________________"} a quantia de {formatBRL(value)} (
          {value ? moneyExtenso(value) : "________________"}), referente à venda
          do veículo {vehicle || "________________"}, placa {plate || "________________"}.
        </p>
        <p className="mt-4">
          O pagamento quita o valor combinado nesta data. A transferência de
          propriedade fica a cargo do comprador, no prazo legal, pelo app do
          governo.
        </p>
        <p className="mt-8">
          {city || "________________"}, {dateLabel || "__/__/____"}.
        </p>
        <div className="mt-16 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <div className="mb-8 border-b border-zinc-400" />
            Vendedor
            <div className="mt-1">{seller}</div>
          </div>
          <div>
            <div className="mb-8 border-b border-zinc-400" />
            Comprador
            <div className="mt-1">{buyer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
