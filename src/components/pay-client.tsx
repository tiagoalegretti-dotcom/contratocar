"use client";

import { ContractPreview } from "@/components/contract-preview";
import { useAuth } from "@/components/auth-provider";
import { MpCheckout } from "@/components/mp-checkout";
import { formatBRL } from "@/lib/money";
import { emptyContract, PRICE_BRL, type ContractData } from "@/lib/types";
import { useEffect, useState } from "react";

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
  const first = name.split(" ")[0];
  const [data, setData] = useState<ContractData>(emptyContract);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("contratocar-contract");
      if (raw) setData({ ...emptyContract(), ...(JSON.parse(raw) as ContractData) });
    } catch {
      /* ignore */
    }
  }, []);

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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <div className="mb-6 max-w-2xl">
        <p className="text-sm text-zinc-500">Olá, {first}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Seu contrato está pronto
        </h1>
        <p className="mt-2 text-sm text-zinc-600 sm:text-base">
          Você está a um passo de deixar a compra e venda combinada por escrito.
          Faça como milhares de pessoas que já usaram o ContratoCar.
        </p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0">
          <ContractPreview data={data} locked veil />
        </div>
        <div className="min-w-0 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-24">
          <p className="text-sm font-medium text-zinc-500">Contrato de compra e venda</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span>Total</span>
            <span className="text-lg font-semibold">{formatBRL(PRICE_BRL)}</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">Pagamento único · PIX ou cartão</p>
          {status === "falhou" && (
            <p className="mt-3 text-sm text-amber-700">
              O pagamento não foi concluído. Você pode tentar de novo.
            </p>
          )}
          <div className="mt-5">
            <MpCheckout
              amount={PRICE_BRL}
              email={email}
              authHeader={authHeader}
              blocked={false}
              onBlocked={() => undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
