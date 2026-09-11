"use client";

import { useAuth } from "@/components/auth-provider";
import { formatBRL } from "@/lib/money";
import { PRICE_BRL } from "@/lib/types";
import { useState } from "react";

export function PayClient({
  name,
  email,
  status,
}: {
  name: string;
  email: string;
  status: string | null;
}) {
  const { idToken } = useAuth();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  async function pay() {
    setPaying(true);
    setError("");
    try {
      const token = await idToken();
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = (await res.json()) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !json.url) {
        setError(json.error || "Não deu para abrir o pagamento.");
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("Falha de conexão. Tente de novo.");
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
        PIX ou cartão de crédito, pelo Mercado Pago. O valor cai na conta
        vinculada à aplicação.
      </p>
      <p className="mt-8 text-5xl font-semibold">{formatBRL(PRICE_BRL)}</p>
      <p className="mt-1 text-sm text-zinc-500">Pagamento único</p>
      {status === "falhou" && (
        <p className="mt-4 text-sm text-amber-700">
          O pagamento não foi concluído. Você pode tentar de novo.
        </p>
      )}
      {status === "pendente" && (
        <p className="mt-4 text-sm text-amber-700">
          Pagamento ainda pendente. Se pagou por PIX, aguarde a confirmação e
          volte a esta página pelo link do Mercado Pago.
        </p>
      )}
      <button
        onClick={pay}
        disabled={paying}
        className="mt-8 w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
      >
        {paying ? "Abrindo o Mercado Pago..." : "Pagar com PIX ou cartão"}
      </button>
      {error && <p className="mt-4 text-sm text-amber-700">{error}</p>}
    </div>
  );
}
