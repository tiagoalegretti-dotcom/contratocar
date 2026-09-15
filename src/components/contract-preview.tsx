"use client";

import { buildClauses, contractTitle, partyLabel } from "@/lib/contract";
import type { ContractData } from "@/lib/types";
import { useEffect, useRef } from "react";

export function ContractPreview({
  data,
  locked = true,
  veil = false,
}: {
  data: ContractData;
  locked?: boolean;
  veil?: boolean;
}) {
  const clauses = buildClauses(data);
  const ref = useRef<HTMLDivElement>(null);
  const city = data.cityForum || data.seller.city || "________________";
  const date = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!locked) return;
    const el = ref.current;
    if (!el) return;
    const block = (e: Event) => e.preventDefault();
    el.addEventListener("copy", block);
    el.addEventListener("cut", block);
    el.addEventListener("contextmenu", block);
    el.addEventListener("dragstart", block);
    return () => {
      el.removeEventListener("copy", block);
      el.removeEventListener("cut", block);
      el.removeEventListener("contextmenu", block);
      el.removeEventListener("dragstart", block);
    };
  }, [locked]);

  return (
    <div className="relative">
      {locked && !veil && (
        <p className="mb-2 text-center text-xs font-medium text-violet-700">
          Prévia protegida. O modelo não pode ser copiado.
        </p>
      )}
      <div
        ref={ref}
        className={`relative overflow-hidden rounded-xl border border-zinc-200 bg-[#faf8f4] shadow-sm ${
          locked ? "select-none" : ""
        } ${veil ? "max-h-[min(36rem,70vh)]" : ""}`}
        style={locked ? { userSelect: "none", WebkitUserSelect: "none" } : undefined}
      >
        <article className="min-h-[480px] px-6 py-8 font-serif text-[13px] leading-relaxed text-zinc-800 sm:px-10 sm:py-10 sm:text-sm">
          <h2 className="mb-1 text-center text-base font-bold tracking-wide sm:text-lg">
            {contractTitle(data)}
          </h2>
          <p className="mb-6 text-center text-[11px] text-zinc-500">
            Código Civil, arts. 481 a 532, e Código de Trânsito Brasileiro
          </p>
          {clauses.map((c, i) => (
            <section key={c.title} className="mb-4">
              <h3 className="mb-1 text-[12px] font-bold">
                CLÁUSULA {i + 1}. {c.title}
              </h3>
              <p>{c.body}</p>
            </section>
          ))}
          <p className="mt-8">
            {city}, {date}.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-8 text-center text-[11px]">
            <div>
              <div className="mb-8 border-b border-zinc-400" />
              VENDEDOR(A)
              <div className="mt-1 text-zinc-500">{partyLabel(data.seller) || " "}</div>
            </div>
            <div>
              <div className="mb-8 border-b border-zinc-400" />
              COMPRADOR(A)
              <div className="mt-1 text-zinc-500">{partyLabel(data.buyer) || " "}</div>
            </div>
          </div>
        </article>
        {locked && (
          <div
            aria-hidden
            className="absolute inset-0 cursor-not-allowed bg-[repeating-linear-gradient(-18deg,transparent,transparent_42px,rgba(109,40,217,0.04)_42px,rgba(109,40,217,0.04)_84px)]"
          />
        )}
        {veil && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 top-[22%] bg-gradient-to-b from-transparent via-[#faf8f4]/55 to-[#faf8f4]"
          />
        )}
        {veil && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 top-[38%] backdrop-blur-[5px]"
          />
        )}
        {veil && (
          <p className="absolute inset-x-0 bottom-4 px-4 text-center text-sm font-medium text-violet-800">
            Pague para ver e baixar o contrato completo
          </p>
        )}
      </div>
    </div>
  );
}
