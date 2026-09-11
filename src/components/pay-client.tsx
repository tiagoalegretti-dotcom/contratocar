"use client";

import { useAuth } from "@/components/auth-provider";
import { EsignChoiceCards } from "@/components/esign-choice";
import { MpCheckout } from "@/components/mp-checkout";
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
  const [wantEsign, setWantEsign] = useState<EsignChoice>("");
  const [tried, setTried] = useState(false);

  useEffect(() => {
    setWantEsign(readDraft().wantEsign);
  }, []);

  function choose(next: EsignChoice) {
    setWantEsign(next);
    writeDraft({ ...readDraft(), wantEsign: next });
  }

  async function authHeader() {
    let token = await idToken();
    if (!token && user) token = await user.getIdToken(true);
    if (!token) {
      const { getFirebaseAuth } = await import("@/lib/firebase");
      const current = getFirebaseAuth()?.currentUser;
      token = current ? await current.getIdToken(true) : null;
    }
    return token;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
        <div>
          <p className="text-sm text-zinc-500">
            Olá, {name.split(" ")[0]}
            {email ? ` (${email})` : ""}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Pague para emitir o contrato
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            PIX ou cartão, sem sair desta página.
          </p>
          <div className="mt-8">
            <EsignChoiceCards value={wantEsign} onChange={choose} />
          </div>
          {status === "falhou" && (
            <p className="mt-4 text-sm text-amber-700">
              O pagamento não foi concluído. Você pode tentar de novo.
            </p>
          )}
          {tried && wantEsign !== "yes" && wantEsign !== "no" && (
            <p className="mt-4 text-sm text-amber-700">
              Escolha se vai assinar pelo site, antes de pagar.
            </p>
          )}
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Contrato de compra e venda</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span>Total</span>
            <span className="text-lg font-semibold">{formatBRL(PRICE_BRL)}</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">Pagamento único</p>
          <div className="mt-6">
            <MpCheckout
              amount={PRICE_BRL}
              email={email}
              authHeader={authHeader}
              blocked={wantEsign !== "yes" && wantEsign !== "no"}
              onBlocked={() => setTried(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
