"use client";

import { formatBRL, parseBRL } from "@/lib/money";
import { useMemo, useState } from "react";

const input =
  "min-h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 text-base outline-none focus:border-violet-500";

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function IpvaTool() {
  const [annual, setAnnual] = useState("");
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [fines, setFines] = useState("");

  const result = useMemo(() => {
    const yearValue = parseBRL(annual);
    const m = Number(month) || 1;
    const remaining = Math.max(0, 12 - m);
    const monthly = yearValue / 12;
    const proportional = monthly * remaining;
    const fineValue = parseBRL(fines);
    return {
      remaining,
      monthly,
      proportional,
      fineValue,
      total: proportional + fineValue,
    };
  }, [annual, month, fines]);

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <p className="text-sm font-medium text-violet-700">Grátis</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        Calculadora de IPVA proporcional
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        Estime quanto do IPVA do ano ainda resta na data da venda, e some
        multas se quiser. Confira o valor oficial no DETRAN do seu estado.
      </p>

      <div className="mt-6 grid gap-3">
        <label className="text-sm">
          <span className="mb-1 block font-medium">IPVA do ano (R$)</span>
          <input
            className={input}
            inputMode="decimal"
            placeholder="2500,00"
            value={annual}
            onChange={(e) => setAnnual(e.target.value)}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Mês da venda</span>
          <select
            className={input}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {MONTHS.map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Multas em aberto (R$), opcional</span>
          <input
            className={input}
            inputMode="decimal"
            value={fines}
            onChange={(e) => setFines(e.target.value)}
          />
        </label>
      </div>

      <dl className="mt-8 space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-600">IPVA por mês</dt>
          <dd className="font-medium">{formatBRL(result.monthly)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-600">Meses restantes no ano</dt>
          <dd className="font-medium">{result.remaining}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-600">IPVA proporcional</dt>
          <dd className="font-medium">{formatBRL(result.proportional)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-600">Multas</dt>
          <dd className="font-medium">{formatBRL(result.fineValue)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-zinc-200 pt-3 text-base">
          <dt className="font-semibold">Total a acertar na venda</dt>
          <dd className="font-semibold text-violet-700">{formatBRL(result.total)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-zinc-500">
        Conta: IPVA anual dividido por 12, vezes os meses depois do mês da venda.
        Quem paga o quê deve ficar escrito no contrato.
      </p>
    </div>
  );
}
