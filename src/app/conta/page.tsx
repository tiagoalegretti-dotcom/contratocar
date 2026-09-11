"use client";

import { useAuth } from "@/components/auth-provider";
import { contractLabel, listContracts, type SavedContract } from "@/lib/contracts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ContaPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState<SavedContract[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/entrar");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    listContracts(user.uid)
      .then(setRows)
      .finally(() => setBusy(false));
  }, [user]);

  if (loading || !user) {
    return <p className="p-8 text-center text-sm text-zinc-600">Carregando...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Minha conta</h1>
          <p className="mt-1 text-sm text-zinc-600">{user.email}</p>
        </div>
        <button type="button" className="text-sm text-zinc-500" onClick={() => void signOut()}>
          Sair
        </button>
      </div>

      <Link
        href="/contrato"
        className="mt-8 inline-flex min-h-12 items-center rounded-full bg-violet-600 px-5 text-sm font-medium text-white"
      >
        Novo contrato
      </Link>

      <h2 className="mt-10 text-lg font-semibold">Seus contratos</h2>
      {busy ? (
        <p className="mt-3 text-sm text-zinc-500">Carregando...</p>
      ) : rows.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-600">
          Nenhum contrato ainda. Gere um para ele aparecer aqui.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={`/conta/${row.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 px-4 py-4 hover:border-violet-300"
              >
                <span>
                  <span className="block font-medium">{contractLabel(row)}</span>
                  <span className="text-sm text-zinc-500">
                    {row.paid ? "Pago" : "Aguardando pagamento"} ·{" "}
                    {new Date(row.updatedAt).toLocaleString("pt-BR")}
                  </span>
                </span>
                <span className="text-sm text-violet-700">Abrir</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
