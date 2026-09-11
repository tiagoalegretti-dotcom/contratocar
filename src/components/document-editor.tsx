"use client";

import {
  draftFromData,
  draftToPlainText,
  type ContractDraft,
} from "@/lib/contract";
import type { ContractData } from "@/lib/types";
import { useEffect, useState } from "react";

const field =
  "w-full rounded-md border border-transparent bg-white/70 px-2 py-1 outline-none focus:border-violet-400 focus:bg-white";

export function PaidDocument({ data }: { data: ContractData }) {
  const [editing, setEditing] = useState(true);
  const [draft, setDraft] = useState<ContractDraft>(() => draftFromData(data));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("contratocar-edited");
    if (raw) {
      try {
        setDraft(JSON.parse(raw) as ContractDraft);
        return;
      } catch {
        /* ignore */
      }
    }
    setDraft(draftFromData(data));
  }, [data]);

  function persist(next: ContractDraft) {
    setDraft(next);
    sessionStorage.setItem("contratocar-edited", JSON.stringify(next));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  }

  function download() {
    const blob = new Blob([draftToPlainText(draft)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contrato-compra-venda-veiculo.txt";
    a.click();
    URL.revokeObjectURL(url);
    window.print();
  }

  function setClause(i: number, patch: Partial<ContractDraft["clauses"][0]>) {
    persist({
      ...draft,
      clauses: draft.clauses.map((c, idx) =>
        idx === i ? { ...c, ...patch } : c,
      ),
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50"
        >
          {editing ? "Ver documento" : "Editar documento"}
        </button>
        <button
          type="button"
          onClick={download}
          className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Baixar e imprimir
        </button>
        {editing && (
          <button
            type="button"
            onClick={() =>
              persist({
                ...draft,
                clauses: [
                  ...draft.clauses,
                  { title: "CLÁUSULA ADICIONAL", body: "" },
                ],
              })
            }
            className="rounded-full px-4 py-2 text-sm text-violet-700 hover:bg-violet-50"
          >
            + Nova cláusula
          </button>
        )}
        {saved && <span className="text-xs text-zinc-500">Salvo</span>}
      </div>

      {editing && (
        <p className="mt-3 text-sm text-zinc-600 print:hidden">
          Clique no texto para editar. O download sai com as alterações.
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-[#faf8f4] shadow-sm print:mt-0 print:border-0 print:shadow-none">
        <article className="min-h-[480px] px-6 py-8 font-serif text-[13px] leading-relaxed text-zinc-800 sm:px-10 sm:py-10 sm:text-sm">
          {editing ? (
            <input
              className={`${field} text-center text-base font-bold tracking-wide sm:text-lg`}
              value={draft.title}
              onChange={(e) => persist({ ...draft, title: e.target.value })}
            />
          ) : (
            <h2 className="mb-1 text-center text-base font-bold tracking-wide sm:text-lg">
              {draft.title}
            </h2>
          )}
          {editing ? (
            <input
              className={`${field} mt-1 mb-6 text-center text-[11px] text-zinc-500`}
              value={draft.subtitle}
              onChange={(e) => persist({ ...draft, subtitle: e.target.value })}
            />
          ) : (
            <p className="mb-6 text-center text-[11px] text-zinc-500">
              {draft.subtitle}
            </p>
          )}

          {draft.clauses.map((c, i) => (
            <section key={`${c.title}-${i}`} className="mb-4">
              {editing ? (
                <div className="mb-1 flex items-start gap-2">
                  <span className="mt-1 shrink-0 text-[12px] font-bold">
                    CLÁUSULA {i + 1}.
                  </span>
                  <input
                    className={`${field} text-[12px] font-bold`}
                    value={c.title}
                    onChange={(e) => setClause(i, { title: e.target.value })}
                  />
                  {draft.clauses.length > 1 && (
                    <button
                      type="button"
                      className="shrink-0 text-xs text-zinc-400 hover:text-red-600 print:hidden"
                      onClick={() =>
                        persist({
                          ...draft,
                          clauses: draft.clauses.filter((_, idx) => idx !== i),
                        })
                      }
                    >
                      Remover
                    </button>
                  )}
                </div>
              ) : (
                <h3 className="mb-1 text-[12px] font-bold">
                  CLÁUSULA {i + 1}. {c.title}
                </h3>
              )}
              {editing ? (
                <textarea
                  className={`${field} min-h-24 resize-y`}
                  value={c.body}
                  onChange={(e) => setClause(i, { body: e.target.value })}
                />
              ) : (
                <p className="whitespace-pre-wrap">{c.body}</p>
              )}
            </section>
          ))}

          {editing ? (
            <input
              className={`${field} mt-8`}
              value={draft.closing}
              onChange={(e) => persist({ ...draft, closing: e.target.value })}
            />
          ) : (
            <p className="mt-8">{draft.closing}</p>
          )}

          <div className="mt-12 grid grid-cols-2 gap-8 text-center text-[11px]">
            <div>
              {draft.sellerSignedAt ? (
                <p className="mb-2 italic text-violet-800">{draft.sellerName}</p>
              ) : (
                <div className="mb-8 border-b border-zinc-400" />
              )}
              VENDEDOR(A)
              {editing ? (
                <input
                  className={`${field} mt-1 text-center text-zinc-500`}
                  value={draft.sellerName}
                  onChange={(e) =>
                    persist({ ...draft, sellerName: e.target.value })
                  }
                />
              ) : (
                <div className="mt-1 text-zinc-500">{draft.sellerName}</div>
              )}
              {draft.sellerSignedAt ? (
                <p className="mt-1 text-[10px] text-zinc-500">
                  Assinado eletronicamente em {draft.sellerSignedAt}
                </p>
              ) : (
                <button
                  type="button"
                  className="mt-2 rounded-full bg-violet-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-violet-700 print:hidden"
                  onClick={() =>
                    persist({
                      ...draft,
                      sellerSignedAt: new Date().toLocaleString("pt-BR"),
                    })
                  }
                >
                  Assinar pelo site
                </button>
              )}
            </div>
            <div>
              {draft.buyerSignedAt ? (
                <p className="mb-2 italic text-violet-800">{draft.buyerName}</p>
              ) : (
                <div className="mb-8 border-b border-zinc-400" />
              )}
              COMPRADOR(A)
              {editing ? (
                <input
                  className={`${field} mt-1 text-center text-zinc-500`}
                  value={draft.buyerName}
                  onChange={(e) =>
                    persist({ ...draft, buyerName: e.target.value })
                  }
                />
              ) : (
                <div className="mt-1 text-zinc-500">{draft.buyerName}</div>
              )}
              {draft.buyerSignedAt ? (
                <p className="mt-1 text-[10px] text-zinc-500">
                  Assinado eletronicamente em {draft.buyerSignedAt}
                </p>
              ) : (
                <button
                  type="button"
                  className="mt-2 rounded-full bg-violet-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-violet-700 print:hidden"
                  onClick={() =>
                    persist({
                      ...draft,
                      buyerSignedAt: new Date().toLocaleString("pt-BR"),
                    })
                  }
                >
                  Assinar pelo site
                </button>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
