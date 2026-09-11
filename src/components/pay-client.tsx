"use client";

import { useAuth } from "@/components/auth-provider";
import { EsignChoiceCards } from "@/components/esign-choice";
import { formatBRL } from "@/lib/money";
import { emptyContract, PRICE_BRL, type ContractData, type EsignChoice } from "@/lib/types";
import { useEffect, useState } from "react";

function readDraft(): ContractData {
  try {
    const raw = sessionStorage.getItem("contratocar-contract");
    if (!raw) return emptyContract();
    return { ...emptyContract(), ...(JSON.parse(raw) as ContractData) };
  } catch {
    return emptyContract();
  }
}

function writeDraft(next: ContractData) {
  sessionStorage.setItem("contratocar-contract", JSON.stringify(next));
}

export function PayClient({
  name,
  email,
  status,
}: {
  name: string;
  email: string;
  status: string | null;
}) {
  const { user, idToken } = useAuth();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [wantEsign, setWantEsign] = useState<EsignChoice>("");
  const [tried, setTried] = useState(false);

  useEffect(() => {
    setWantEsign(readDraft().wantEsign);
  }, []);

  function choose(next: EsignChoice) {
    setWantEsign(next);
    writeDraft({ ...readDraft(), wantEsign: next });
  }

  async function pay() {
    if (wantEsign !== "yes" && wantEsign !== "no") {
      setTried(true);
      return;
    }
    setPaying(true);
    setError("");
    try {
      let token = await idToken();
      if (!token && user) token = await user.getIdToken(true);
      if (!token) {
        const { getFirebaseAuth } = await import("@/lib/firebase");
        const current = getFirebaseAuth()?.currentUser;
        token = current ? await current.getIdToken(true) : null;
      }
      if (!token) {
        setError("Sua sessão não foi reconhecida. Saia e entre de novo.");
        return;
      }
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="text-center text-sm text-zinc-500">
        Olá, {name.split(" ")[0]}
        {email ? ` (${email})` : ""}
      </p>
      <h1 className="mt-2 text-center text-2xl font-semibold tracking-tight">
        Pague para baixar
      </h1>
      <p className="mt-2 text-center text-sm text-zinc-600">
        PIX ou cartão de crédito, pelo Mercado Pago.
      </p>
      <p className="mt-8 text-center text-5xl font-semibold">{formatBRL(PRICE_BRL)}</p>
      <p className="mt-1 text-center text-sm text-zinc-500">Pagamento único</p>

      <div className="mt-8">
        <EsignChoiceCards value={wantEsign} onChange={choose} />
      </div>

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
      {tried && wantEsign !== "yes" && wantEsign !== "no" && (
        <p className="mt-3 text-center text-sm text-amber-700">
          Escolha se vai assinar pelo site, antes de pagar.
        </p>
      )}
      {error && <p className="mt-4 text-center text-sm text-amber-700">{error}</p>}
    </div>
  );
}
