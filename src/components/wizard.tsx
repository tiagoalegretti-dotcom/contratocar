"use client";

import { ContractPreview } from "@/components/contract-preview";
import { EsignChoiceCards } from "@/components/esign-choice";
import { Field, inputClass as input } from "@/components/form-ui";
import { useAuth } from "@/components/auth-provider";
import { saveContract } from "@/lib/contracts";
import { emptyContract, type ContractData } from "@/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = ["Veículo", "Vendedor", "Comprador", "Valor"];

export function Wizard() {
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState<"form" | "preview">("form");
  const [data, setData] = useState<ContractData>(emptyContract);
  const [finishing, setFinishing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const set = <K extends keyof ContractData>(k: K, v: ContractData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  async function finish() {
    setFinishing(true);
    const id = crypto.randomUUID();
    sessionStorage.setItem("contratocar-contract", JSON.stringify(data));
    sessionStorage.setItem("contratocar-contract-id", id);
    sessionStorage.setItem("contratocar-checkout", "1");
    if (user) {
      await saveContract(user.uid, { id, data, paid: false });
      router.push("/pagar");
      return;
    }
    router.push("/entrar");
  }

  const nav = (
    <>
      <button
        className="min-h-12 rounded-full px-4 text-base text-zinc-600 disabled:opacity-40"
        disabled={step === 0}
        onClick={() => setStep((s) => s - 1)}
      >
        Voltar
      </button>
      {step < STEPS.length - 1 ? (
        <button
          className="min-h-12 flex-1 rounded-full bg-violet-600 px-5 text-base font-medium text-white lg:flex-none"
          onClick={() => setStep((s) => s + 1)}
        >
          Continuar
        </button>
      ) : (
        <button
          disabled={finishing}
          onClick={finish}
          className="min-h-12 flex-1 rounded-full bg-violet-600 px-5 text-base font-medium text-white disabled:opacity-40 lg:flex-none"
        >
          {finishing ? "Aguarde..." : "Finalizar"}
        </button>
      )}
    </>
  );

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-24 pt-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:px-6 lg:py-6 lg:pb-6">
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="mb-4 flex gap-2 lg:hidden">
          <button
            className={`min-h-12 flex-1 rounded-full text-base font-medium ${
              tab === "form" ? "bg-violet-600 text-white" : "bg-zinc-100"
            }`}
            onClick={() => setTab("form")}
          >
            Perguntas
          </button>
          <button
            className={`min-h-12 flex-1 rounded-full text-base font-medium ${
              tab === "preview" ? "bg-violet-600 text-white" : "bg-zinc-100"
            }`}
            onClick={() => setTab("preview")}
          >
            Prévia
          </button>
        </div>

        <div className={tab === "preview" ? "hidden lg:block" : ""}>
          <ol className="mb-5 flex gap-1 overflow-x-auto text-[11px] font-medium text-zinc-500">
            {STEPS.map((s, i) => (
              <li key={s}>
                <button
                  onClick={() => setStep(i)}
                  className={`min-h-11 whitespace-nowrap rounded-full px-3 ${
                    i === step ? "bg-violet-600 text-white" : "bg-zinc-100"
                  }`}
                >
                  {i + 1}. {s}
                </button>
              </li>
            ))}
          </ol>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
            {step === STEPS.length - 1 && (
              <p className="mb-4 text-sm text-zinc-500">
                Pode seguir sem preencher. Depois do pagamento você completa todos
                os dados do contrato.
              </p>
            )}
            {step === 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Tipo">
                  <select
                    className={input}
                    value={data.vehicleKind}
                    onChange={(e) =>
                      set("vehicleKind", e.target.value as ContractData["vehicleKind"])
                    }
                  >
                    <option value="carro">Carro</option>
                    <option value="moto">Moto</option>
                    <option value="caminhao">Caminhão</option>
                  </select>
                </Field>
                <Field label="Condição">
                  <select
                    className={input}
                    value={data.condition}
                    onChange={(e) =>
                      set("condition", e.target.value as ContractData["condition"])
                    }
                  >
                    <option value="usado">Usado</option>
                    <option value="zero">Zero km</option>
                  </select>
                </Field>
                <Field label="Marca">
                  <input className={input} value={data.brand} onChange={(e) => set("brand", e.target.value)} />
                </Field>
                <Field label="Modelo">
                  <input className={input} value={data.model} onChange={(e) => set("model", e.target.value)} />
                </Field>
                <Field label="Placa">
                  <input
                    className={input}
                    autoCapitalize="characters"
                    value={data.plate}
                    onChange={(e) => set("plate", e.target.value.toUpperCase())}
                  />
                </Field>
              </div>
            )}
            {step === 1 && (
              <MiniParty
                question="Quem está vendendo o veículo?"
                party={data.seller}
                onChange={(seller) => setData((d) => ({ ...d, seller }))}
              />
            )}
            {step === 2 && (
              <MiniParty
                question="Quem está comprando o veículo?"
                party={data.buyer}
                onChange={(buyer) => setData((d) => ({ ...d, buyer }))}
              />
            )}
            {step === 3 && (
              <div className="grid gap-5">
                <Field label="Preço da venda (R$)">
                  <input
                    className={input}
                    inputMode="decimal"
                    placeholder="45000,00"
                    value={data.price}
                    onChange={(e) => set("price", e.target.value)}
                  />
                </Field>
                <EsignChoiceCards
                  value={data.wantEsign}
                  onChange={(wantEsign) => set("wantEsign", wantEsign)}
                />
              </div>
            )}

            <div className="mt-5 hidden items-center justify-between gap-3 lg:flex">
              {nav}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 p-3 backdrop-blur-md lg:hidden print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          {nav}
        </div>
      </div>

      {tab === "preview" ? (
        <ContractPreview data={data} locked />
      ) : (
        <div className="hidden lg:block">
          <ContractPreview data={data} locked />
        </div>
      )}
    </div>
  );
}

function MiniParty({
  question,
  party,
  onChange,
}: {
  question: string;
  party: ContractData["seller"];
  onChange: (p: ContractData["seller"]) => void;
}) {
  const kinds: {
    id: ContractData["seller"]["type"];
    title: string;
    text: string;
    icon: string;
  }[] = [
    {
      id: "pf",
      title: "Uma pessoa",
      text: "Pessoa física, sozinha.",
      icon: "1",
    },
    {
      id: "pf2",
      title: "Duas pessoas",
      text: "Casal ou coproprietários juntos.",
      icon: "2",
    },
    {
      id: "pj",
      title: "Empresa",
      text: "Loja, revenda ou empresa com CNPJ.",
      icon: "CNPJ",
    },
  ];

  return (
    <div className="grid gap-3">
      <h2 className="text-xl font-semibold">{question}</h2>
      <div className="grid gap-2">
        {kinds.map((k) => {
          const on = party.type === k.id;
          return (
            <button
              key={k.id}
              type="button"
              onClick={() => onChange({ ...party, type: k.id })}
              className={`flex min-h-16 items-center gap-3 rounded-2xl border px-4 py-3 text-left ${
                on
                  ? "border-violet-600 ring-2 ring-violet-600/20"
                  : "border-zinc-200"
              }`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                {k.icon}
              </span>
              <span className="flex-1">
                <span className="block font-medium">{k.title}</span>
                <span className="block text-sm text-zinc-500">{k.text}</span>
              </span>
              <span
                className={`h-5 w-5 shrink-0 rounded-full border ${
                  on
                    ? "border-4 border-violet-600"
                    : "border-2 border-zinc-300"
                }`}
              />
            </button>
          );
        })}
      </div>
      {party.type === "pj" ? (
        <>
          <Field label="Razão social">
            <input
              className={input}
              value={party.name}
              onChange={(e) => onChange({ ...party, name: e.target.value })}
            />
          </Field>
          <Field label="CNPJ">
            <input
              className={input}
              inputMode="numeric"
              value={party.document}
              onChange={(e) => onChange({ ...party, document: e.target.value })}
            />
          </Field>
        </>
      ) : (
        <>
          <Field label={party.type === "pf2" ? "Nome da 1ª pessoa" : "Nome completo"}>
            <input
              className={input}
              autoComplete="name"
              value={party.name}
              onChange={(e) => onChange({ ...party, name: e.target.value })}
            />
          </Field>
          <Field label={party.type === "pf2" ? "CPF da 1ª pessoa" : "CPF"}>
            <input
              className={input}
              inputMode="numeric"
              value={party.document}
              onChange={(e) => onChange({ ...party, document: e.target.value })}
            />
          </Field>
          {party.type === "pf2" && (
            <>
              <Field label="Nome da 2ª pessoa">
                <input
                  className={input}
                  value={party.name2}
                  onChange={(e) => onChange({ ...party, name2: e.target.value })}
                />
              </Field>
              <Field label="CPF da 2ª pessoa">
                <input
                  className={input}
                  inputMode="numeric"
                  value={party.document2}
                  onChange={(e) =>
                    onChange({ ...party, document2: e.target.value })
                  }
                />
              </Field>
            </>
          )}
        </>
      )}
    </div>
  );
}
