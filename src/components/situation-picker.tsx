"use client";

import { useEffect, useId, useState } from "react";

type Option = { value: string; label: string };

export function SituationRow({
  title,
  summary,
  options = [],
  value = "",
  onSelect,
  followUpValues = [],
  onFollowUp,
  onOpenPage,
}: {
  title: string;
  summary: string;
  options?: readonly Option[];
  value?: string;
  onSelect?: (value: string) => void;
  followUpValues?: readonly string[];
  onFollowUp?: () => void;
  onOpenPage?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function pick(next: string) {
    onSelect?.(next);
    setOpen(false);
    if (followUpValues.includes(next)) onFollowUp?.();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => (onOpenPage ? onOpenPage() : setOpen(true))}
        className="flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-left"
      >
        <span>
          <span className="block text-sm text-zinc-500">{title}</span>
          <span className="mt-0.5 block text-base font-medium text-zinc-900">
            {summary}
          </span>
        </span>
        <span className="shrink-0 text-sm font-medium text-violet-700">Alterar</span>
      </button>
      {open && !onOpenPage && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/50 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-labelledby={titleId}
            className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h3 id={titleId} className="text-lg font-semibold">
                {title}
              </h3>
              <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-full text-zinc-500"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
            <div className="grid gap-2">
              {options.map((opt) => {
                const selected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => pick(opt.value)}
                    className={`flex min-h-12 items-center justify-between rounded-2xl border px-4 text-left text-sm font-medium ${
                      selected
                        ? "border-violet-600 text-violet-800"
                        : "border-zinc-200 text-zinc-800"
                    }`}
                  >
                    {opt.label}
                    <span
                      className={`grid h-4 w-4 place-items-center rounded-full border ${
                        selected ? "border-violet-600" : "border-zinc-300"
                      }`}
                    >
                      {selected && (
                        <span className="h-2 w-2 rounded-full bg-violet-600" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function DeclarationScreen({
  title,
  hint,
  label,
  placeholder,
  value,
  onChange,
  onBack,
  onDone,
}: {
  title: string;
  hint: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onBack: () => void;
  onDone: () => void;
}) {
  const ok = Boolean(value.trim());
  return (
    <div className="print:hidden">
      <button
        type="button"
        onClick={onBack}
        className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 text-lg text-zinc-700"
        aria-label="Voltar"
      >
        ←
      </button>
      <h2 className="mt-8 text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-zinc-500">{hint}</p>
      <label className="mt-8 block text-sm">
        <span className="mb-2 block font-medium text-zinc-600">{label}</span>
        <textarea
          autoFocus
          className="min-h-36 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base outline-none ring-violet-600/20 placeholder:text-zinc-400 focus:border-violet-500 focus:ring-4"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
      <button
        type="button"
        disabled={!ok}
        onClick={onDone}
        className="mt-8 min-h-12 w-full rounded-full bg-violet-600 text-base font-medium text-white disabled:opacity-40 sm:w-auto sm:px-10"
      >
        Continuar
      </button>
    </div>
  );
}

export function ChoiceScreen({
  title,
  hint,
  options,
  value,
  onSelect,
  onBack,
}: {
  title: string;
  hint: string;
  options: readonly {
    value: string;
    title: string;
    description: string;
    badge?: string;
  }[];
  value: string;
  onSelect: (value: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="print:hidden">
      <button
        type="button"
        onClick={onBack}
        className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 text-lg text-zinc-700"
        aria-label="Voltar"
      >
        ←
      </button>
      <h2 className="mt-8 text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-zinc-500">{hint}</p>
      <div className="mt-8 grid gap-3">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`flex items-start justify-between gap-3 rounded-2xl border px-4 py-4 text-left ${
                selected ? "border-violet-600" : "border-zinc-200"
              }`}
            >
              <span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-semibold">{opt.title}</span>
                  {opt.badge && (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
                      {opt.badge}
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm text-zinc-500">
                  {opt.description}
                </span>
              </span>
              <span
                className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                  selected ? "border-violet-600" : "border-zinc-300"
                }`}
              >
                {selected && <span className="h-2.5 w-2.5 rounded-full bg-violet-600" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
