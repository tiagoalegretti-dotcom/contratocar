"use client";

import { CompleteDetails } from "@/components/complete-details";
import { PaidDocument } from "@/components/document-editor";
import { emptyContract, type ContractData } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PaidInner() {
  const params = useSearchParams();
  const paymentId = params.get("payment_id") || params.get("collection_id");
  const [data, setData] = useState<ContractData>(emptyContract);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<"dados" | "doc">("dados");
  const [pay, setPay] = useState<"loading" | "ok" | "wait" | "fail">("loading");

  useEffect(() => {
    const raw = sessionStorage.getItem("contratocar-contract");
    if (raw) {
      try {
        setData({ ...emptyContract(), ...(JSON.parse(raw) as ContractData) });
      } catch {
        /* ignore */
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!paymentId) {
      setPay("fail");
      return;
    }
    let alive = true;
    fetch(`/api/payment?payment_id=${encodeURIComponent(paymentId)}`)
      .then((r) => r.json())
      .then((json: { approved?: boolean; status?: string }) => {
        if (!alive) return;
        if (json.approved) setPay("ok");
        else if (json.status === "pending" || json.status === "in_process") setPay("wait");
        else setPay("fail");
      })
      .catch(() => {
        if (alive) setPay("fail");
      });
    return () => {
      alive = false;
    };
  }, [paymentId]);

  function goToDoc(next: ContractData) {
    setData(next);
    sessionStorage.setItem("contratocar-contract", JSON.stringify(next));
    sessionStorage.removeItem("contratocar-edited");
    setPhase("doc");
  }

  if (pay === "loading") {
    return <p className="p-8 text-center text-sm text-zinc-600">Confirmando o pagamento...</p>;
  }

  if (pay === "wait") {
    return (
      <p className="p-8 text-center text-sm text-zinc-600">
        Pagamento ainda em análise. Se foi PIX, aguarde alguns segundos e atualize a página.
      </p>
    );
  }

  if (pay !== "ok") {
    return (
      <p className="p-8 text-center text-sm text-zinc-600">
        Pagamento não encontrado. Volte ao checkout e finalize de novo.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold print:hidden">Pagamento confirmado</h1>
      {phase === "dados" ? (
        <div className="mt-6">
          {ready && <CompleteDetails data={data} onContinue={goToDoc} />}
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm text-zinc-600 print:hidden">
            Edite o texto, assine pelo site e baixe o contrato.
          </p>
          <p className="mt-2 print:hidden">
            <button
              type="button"
              className="text-sm text-violet-700"
              onClick={() => setPhase("dados")}
            >
              Voltar aos dados
            </button>
          </p>
          <div className="mt-6">
            {ready && <PaidDocument key={JSON.stringify(data)} data={data} />}
          </div>
        </>
      )}
    </div>
  );
}

export default function PagoPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-sm">Carregando...</p>}>
      <PaidInner />
    </Suspense>
  );
}
