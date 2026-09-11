"use client";

import { useAuth } from "@/components/auth-provider";
import { MpCheckout } from "@/components/mp-checkout";
import { formatBRL } from "@/lib/money";
import { PRICE_BRL } from "@/lib/types";

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
      <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:items-start">
        <div>
          <p className="text-sm text-zinc-500">Olá, {first}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Seu contrato está pronto
          </h1>
          <p className="mt-3 max-w-lg text-base text-zinc-600">
            Você está a um passo de deixar a compra e venda do veículo
            combinada por escrito, com as regras claras para os dois lados.
          </p>
          <p className="mt-4 max-w-lg text-sm text-zinc-600">
            Faça como milhares de pessoas que já usaram o ContratoCar e
            fecharam o negócio com mais tranquilidade.
          </p>
          <ul className="mt-8 grid gap-3 text-sm text-zinc-700">
            <li className="flex gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs text-emerald-700">
                ✓
              </span>
              Rascunho preenchido e prévia do contrato pronta.
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs text-emerald-700">
                ✓
              </span>
              Depois do pagamento você completa chassi, RENAVAM e endereço,
              se ainda faltar.
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-100 text-xs font-medium text-violet-800">
                3
              </span>
              PIX ou cartão nesta página. Sem custo extra pela assinatura
              eletrônica, se você já escolheu usá-la.
            </li>
          </ul>
          {status === "falhou" && (
            <p className="mt-4 text-sm text-amber-700">
              O pagamento não foi concluído. Você pode tentar de novo.
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
              blocked={false}
              onBlocked={() => undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
