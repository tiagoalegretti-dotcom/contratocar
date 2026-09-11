"use client";

import { PaidDocument } from "@/components/document-editor";
import { emptyContract, type ContractData } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PaidInner() {
  const params = useSearchParams();
  const token = params.get("token");
  const [data, setData] = useState<ContractData>(emptyContract);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("contratocar-contract");
    if (raw) {
      try {
        setData(JSON.parse(raw) as ContractData);
      } catch {
        /* ignore */
      }
    }
    setReady(true);
  }, []);

  if (!token) {
    return (
      <p className="p-8 text-center text-sm text-zinc-600">
        Pagamento não encontrado. Volte ao formulário e finalize de novo.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold print:hidden">Pagamento confirmado</h1>
      <p className="mt-2 text-sm text-zinc-600 print:hidden">
        Edite o texto, assine pelo site e baixe o contrato.
      </p>
      <div className="mt-6">{ready && <PaidDocument data={data} />}</div>
    </div>
  );
}

export default function PagoPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-sm">Carregando…</p>}>
      <PaidInner />
    </Suspense>
  );
}
