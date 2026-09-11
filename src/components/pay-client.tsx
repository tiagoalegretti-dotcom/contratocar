"use client";

import { formatBRL } from "@/lib/money";
import { PRICE_BRL } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PayClient({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [paying, setPaying] = useState(false);

  async function pay() {
    setPaying(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const json = await res.json();
      router.push(`/pago?token=${json.token}`);
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="text-sm text-zinc-500">
        Olá, {name.split(" ")[0]}
        {email ? ` (${email})` : ""}
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Pague para baixar
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        Depois do pagamento você pode editar o texto e baixar o arquivo.
      </p>
      <p className="mt-8 text-5xl font-semibold">{formatBRL(PRICE_BRL)}</p>
      <p className="mt-1 text-sm text-zinc-500">Pagamento único</p>
      <button
        onClick={pay}
        disabled={paying}
        className="mt-8 w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
      >
        {paying ? "Aguarde..." : "Pagar"}
      </button>
    </div>
  );
}
