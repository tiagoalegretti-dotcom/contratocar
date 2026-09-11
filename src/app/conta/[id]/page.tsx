"use client";

import { CompleteDetails } from "@/components/complete-details";
import { PaidDocument } from "@/components/document-editor";
import { useAuth } from "@/components/auth-provider";
import { getContract, saveContract } from "@/lib/contracts";
import { emptyContract, type ContractData } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ContratoSalvoPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [data, setData] = useState<ContractData>(emptyContract);
  const [paid, setPaid] = useState(false);
  const [phase, setPhase] = useState<"dados" | "doc">("doc");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/entrar");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || !id) return;
    getContract(user.uid, id).then((row) => {
      if (!row) {
        router.replace("/conta");
        return;
      }
      const next = { ...emptyContract(), ...row.data };
      setData(next);
      setPaid(row.paid);
      sessionStorage.setItem("contratocar-contract", JSON.stringify(next));
      sessionStorage.setItem("contratocar-contract-id", row.id);
      if (!row.paid) {
        sessionStorage.setItem("contratocar-checkout", "1");
        router.replace("/pagar");
        return;
      }
      setPhase("doc");
      setReady(true);
    });
  }, [user, id, router]);

  function goToDoc(next: ContractData) {
    setData(next);
    sessionStorage.setItem("contratocar-contract", JSON.stringify(next));
    if (user) void saveContract(user.uid, { id, data: next, paid: true });
    setPhase("doc");
  }

  if (loading || !user || !ready) {
    return <p className="p-8 text-center text-sm text-zinc-600">Carregando...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="print:hidden">
        <button type="button" className="text-sm text-violet-700" onClick={() => router.push("/conta")}>
          Voltar à conta
        </button>
      </p>
      <h1 className="mt-4 text-2xl font-semibold print:hidden">Seu contrato</h1>
      {phase === "dados" ? (
        <div className="mt-6">
          <CompleteDetails data={data} onContinue={goToDoc} />
        </div>
      ) : (
        <div className="mt-6">
          <p className="print:hidden">
            <button
              type="button"
              className="text-sm text-violet-700"
              onClick={() => setPhase("dados")}
            >
              Voltar aos dados
            </button>
          </p>
          <PaidDocument key={JSON.stringify(data)} data={data} />
        </div>
      )}
    </div>
  );
}
