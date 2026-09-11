"use client";

import { ContractPreview } from "@/components/contract-preview";
import { EsignChoiceCards } from "@/components/esign-choice";
import { Field, inputClass as input } from "@/components/form-ui";
import { useAuth } from "@/components/auth-provider";
import {
  clearLocalDraft,
  contractLabel,
  draftHasContent,
  readLocalDraft,
  saveContract,
  writeLocalDraft,
} from "@/lib/contracts";
import {
  ACCESSORIES_OPTIONS,
  DEBTS_OPTIONS,
  FINANCING_OPTIONS,
  INSPECTION_OPTIONS,
  PAYMENT_OPTIONS,
  PENALTY_OPTIONS,
  WARRANTY_OPTIONS,
} from "@/lib/situation";
import { emptyContract, type ContractData, type Party } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = ["Veículo", "Vendedor", "Comprador", "Negociação", "Situação"];

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <select className={input} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Wizard() {
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState<"form" | "preview">("form");
  const [data, setData] = useState<ContractData>(emptyContract);
  const [draftId, setDraftId] = useState("");
  const [gate, setGate] = useState<"loading" | "ask" | "ready">("loading");
  const [pendingLabel, setPendingLabel] = useState("Contrato em rascunho");
  const [finishing, setFinishing] = useState(false);
  const skipSave = useRef(true);
  const router = useRouter();
  const { user } = useAuth();
  const set = <K extends keyof ContractData>(k: K, v: ContractData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  useEffect(() => {
    const local = readLocalDraft();
    if (local && draftHasContent(local.data)) {
      setPendingLabel(contractLabel({ ...local, paid: false }));
      setData(local.data);
      setDraftId(local.id);
      setGate("ask");
    } else {
      setDraftId(crypto.randomUUID());
      setGate("ready");
    }
    skipSave.current = false;
  }, []);

  useEffect(() => {
    if (gate !== "ready" || skipSave.current || !draftId) return;
    const t = window.setTimeout(() => {
      writeLocalDraft({ id: draftId, data, updatedAt: new Date().toISOString() });
      if (user) {
        void saveContract(user.uid, { id: draftId, data, paid: false });
      }
    }, 600);
    return () => window.clearTimeout(t);
  }, [data, draftId, gate, user]);

  function resumeDraft() {
    writeLocalDraft({
      id: draftId,
      data,
      updatedAt: new Date().toISOString(),
    });
    setGate("ready");
  }

  function startNew() {
    skipSave.current = true;
    clearLocalDraft();
    const id = crypto.randomUUID();
    setDraftId(id);
    setData(emptyContract());
    setStep(0);
    setGate("ready");
    skipSave.current = false;
  }

  async function finish() {
    setFinishing(true);
    const id = draftId || crypto.randomUUID();
    writeLocalDraft({ id, data, updatedAt: new Date().toISOString() });
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
    <div className="mx-auto grid min-w-0 max-w-6xl gap-6 px-4 pb-28 pt-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:px-6 lg:py-6 lg:pb-6">
      {gate === "ask" && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/50 p-4">
          <div
            role="dialog"
            aria-labelledby="draft-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-xl"
          >
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-violet-700">
              ⌁
            </div>
            <h2 id="draft-title" className="mt-4 text-xl font-semibold">
              Documento encontrado
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Você tem um contrato em andamento{pendingLabel !== "Contrato em rascunho" ? `: ${pendingLabel}` : ""}.
              Deseja continuar ou criar um novo?
            </p>
            <button
              type="button"
              className="mt-6 min-h-12 w-full rounded-full bg-violet-600 text-sm font-medium text-white"
              onClick={resumeDraft}
            >
              Continuar editando
            </button>
            <button
              type="button"
              className="mt-2 min-h-12 w-full text-sm font-medium text-violet-700"
              onClick={startNew}
            >
              Criar novo
            </button>
          </div>
        </div>
      )}
      {gate === "loading" && (
        <p className="col-span-full text-center text-sm text-zinc-500">Carregando...</p>
      )}
      <div>
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
          <ol className="mb-5 flex gap-1 overflow-x-auto pb-1 text-[11px] font-medium text-zinc-500 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STEPS.map((s, i) => (
              <li key={s}>
                <button
                  onClick={() => setStep(i)}
                  className={`min-h-11 shrink-0 whitespace-nowrap rounded-full px-3 ${
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
                Pode seguir sem algum campo. Depois do pagamento faltam só o que
                costuma estar no documento do veículo: chassi, RENAVAM, endereço
                completo e o histórico detalhado.
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
                <Field label="Cor">
                  <input className={input} value={data.color} onChange={(e) => set("color", e.target.value)} />
                </Field>
                <Field label="Ano de fabricação">
                  <input
                    className={input}
                    inputMode="numeric"
                    maxLength={4}
                    value={data.yearManufacture}
                    onChange={(e) => set("yearManufacture", e.target.value)}
                  />
                </Field>
                <Field label="Ano modelo">
                  <input
                    className={input}
                    inputMode="numeric"
                    maxLength={4}
                    value={data.yearModel}
                    onChange={(e) => set("yearModel", e.target.value)}
                  />
                </Field>
                <Field label="Combustível">
                  <select
                    className={input}
                    value={data.fuel}
                    onChange={(e) => set("fuel", e.target.value)}
                  >
                    <option value="flex">Flex</option>
                    <option value="gasolina">Gasolina</option>
                    <option value="etanol">Etanol</option>
                    <option value="diesel">Diesel</option>
                    <option value="elétrico">Elétrico</option>
                    <option value="híbrido">Híbrido</option>
                    <option value="GNV">GNV</option>
                  </select>
                </Field>
                <Field label="Quilometragem">
                  <input
                    className={input}
                    inputMode="numeric"
                    value={data.km}
                    onChange={(e) => set("km", e.target.value)}
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
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Preço da venda (R$)">
                  <input
                    className={input}
                    inputMode="decimal"
                    placeholder="45000,00"
                    value={data.price}
                    onChange={(e) => set("price", e.target.value)}
                  />
                </Field>
                <Field label="Forma de pagamento">
                  <Select
                    value={data.paymentMethod}
                    onChange={(paymentMethod) =>
                      set("paymentMethod", paymentMethod as ContractData["paymentMethod"])
                    }
                    options={PAYMENT_OPTIONS}
                  />
                </Field>
                {data.paymentMethod === "avista" && (
                  <Field label="Como será pago à vista">
                    <Select
                      value={data.payChannel}
                      onChange={(payChannel) =>
                        set("payChannel", payChannel as ContractData["payChannel"])
                      }
                      options={[
                        { value: "pix", label: "PIX" },
                        { value: "transferencia", label: "Transferência" },
                        { value: "dinheiro", label: "Dinheiro" },
                      ]}
                    />
                  </Field>
                )}
                {data.paymentMethod === "sinal" && (
                  <Field label="Valor do sinal (R$)">
                    <input
                      className={input}
                      inputMode="decimal"
                      value={data.depositAmount}
                      onChange={(e) => set("depositAmount", e.target.value)}
                    />
                  </Field>
                )}
                {data.paymentMethod === "parcelado" && (
                  <Field label="Parcelas">
                    <input
                      className={input}
                      placeholder="Ex.: 12 parcelas de R$ 1.200"
                      value={data.installments}
                      onChange={(e) => set("installments", e.target.value)}
                    />
                  </Field>
                )}
                {data.paymentMethod === "troca" && (
                  <Field label="Veículo da troca">
                    <input
                      className={input}
                      placeholder="Marca, modelo e placa"
                      value={data.tradeVehicle}
                      onChange={(e) => set("tradeVehicle", e.target.value)}
                    />
                  </Field>
                )}
                <Field label="Data da entrega">
                  <input
                    className={input}
                    type="date"
                    value={data.deliveryDate}
                    onChange={(e) => set("deliveryDate", e.target.value)}
                  />
                </Field>
                <Field label="Local da entrega">
                  <input
                    className={input}
                    value={data.deliveryPlace}
                    onChange={(e) => set("deliveryPlace", e.target.value)}
                  />
                </Field>
                <Field label="Prazo para transferir (dias)">
                  <input
                    className={input}
                    inputMode="numeric"
                    value={data.transferDays}
                    onChange={(e) => set("transferDays", e.target.value)}
                  />
                </Field>
              </div>
            )}
            {step === 4 && (
              <div className="grid gap-3">
                <Field label="Financiamento">
                  <Select
                    value={data.financing}
                    onChange={(financing) =>
                      set("financing", financing as ContractData["financing"])
                    }
                    options={FINANCING_OPTIONS}
                  />
                </Field>
                <Field label="Débitos (IPVA, multas)">
                  <Select
                    value={data.debtsStatus}
                    onChange={(debtsStatus) =>
                      set("debtsStatus", debtsStatus as ContractData["debtsStatus"])
                    }
                    options={DEBTS_OPTIONS}
                  />
                </Field>
                {data.debtsStatus === "listed" && (
                  <Field label="Quais débitos">
                    <input
                      className={input}
                      placeholder="Ex.: IPVA 2026 e 2 multas"
                      value={data.debts}
                      onChange={(e) => set("debts", e.target.value)}
                    />
                  </Field>
                )}
                <Field label="Vistoria do comprador">
                  <Select
                    value={data.inspection}
                    onChange={(inspection) =>
                      set("inspection", inspection as ContractData["inspection"])
                    }
                    options={INSPECTION_OPTIONS}
                  />
                </Field>
                <Field label="Itens e acessórios">
                  <Select
                    value={data.accessoriesStatus}
                    onChange={(accessoriesStatus) =>
                      set(
                        "accessoriesStatus",
                        accessoriesStatus as ContractData["accessoriesStatus"],
                      )
                    }
                    options={ACCESSORIES_OPTIONS}
                  />
                </Field>
                {data.accessoriesStatus === "extras" && (
                  <Field label="Quais itens extras">
                    <input
                      className={input}
                      placeholder="Ex.: som, película, estepe"
                      value={data.accessoriesNote}
                      onChange={(e) => set("accessoriesNote", e.target.value)}
                    />
                  </Field>
                )}
                <Field label="Garantia">
                  <Select
                    value={data.warranty}
                    onChange={(warranty) =>
                      set("warranty", warranty as ContractData["warranty"])
                    }
                    options={WARRANTY_OPTIONS}
                  />
                </Field>
                <Field label="Multa se alguém desistir">
                  <Select
                    value={data.penaltyKind}
                    onChange={(penaltyKind) =>
                      set("penaltyKind", penaltyKind as ContractData["penaltyKind"])
                    }
                    options={PENALTY_OPTIONS}
                  />
                </Field>
                {(data.penaltyKind === "custom_percent" ||
                  data.penaltyKind === "fixed") && (
                  <Field
                    label={
                      data.penaltyKind === "custom_percent"
                        ? "Percentual da multa"
                        : "Valor da multa (R$)"
                    }
                  >
                    <input
                      className={input}
                      value={data.penaltyValue}
                      onChange={(e) => set("penaltyValue", e.target.value)}
                    />
                  </Field>
                )}
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

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          {nav}
        </div>
      </div>

      {tab === "preview" ? (
        <div className="min-w-0 lg:hidden">
          <ContractPreview data={data} locked />
        </div>
      ) : null}
      <div className="hidden min-w-0 lg:sticky lg:top-20 lg:block lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto">
        <ContractPreview data={data} locked />
      </div>
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
      {!party.type ? (
        <p className="text-sm text-zinc-500">
          Escolha uma opção para preencher os dados.
        </p>
      ) : (
        <>
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
      {party.type !== "pj" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={party.type === "pf2" ? "Estado civil da 1ª pessoa" : "Estado civil"}>
            <input
              className={input}
              value={party.maritalStatus}
              onChange={(e) => onChange({ ...party, maritalStatus: e.target.value })}
            />
          </Field>
          <Field label={party.type === "pf2" ? "Profissão da 1ª pessoa" : "Profissão"}>
            <input
              className={input}
              value={party.occupation}
              onChange={(e) => onChange({ ...party, occupation: e.target.value })}
            />
          </Field>
          {party.type === "pf2" && (
            <>
              <Field label="Estado civil da 2ª pessoa">
                <input
                  className={input}
                  value={party.maritalStatus2}
                  onChange={(e) =>
                    onChange({ ...party, maritalStatus2: e.target.value })
                  }
                />
              </Field>
              <Field label="Profissão da 2ª pessoa">
                <input
                  className={input}
                  value={party.occupation2}
                  onChange={(e) =>
                    onChange({ ...party, occupation2: e.target.value })
                  }
                />
              </Field>
            </>
          )}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="E-mail">
          <input
            className={input}
            type="email"
            value={party.email}
            onChange={(e) => onChange({ ...party, email: e.target.value })}
          />
        </Field>
        <Field label="Telefone">
          <input
            className={input}
            type="tel"
            inputMode="tel"
            value={party.phone}
            onChange={(e) => onChange({ ...party, phone: e.target.value })}
          />
        </Field>
        <Field label="Cidade">
          <input
            className={input}
            value={party.city}
            onChange={(e) => onChange({ ...party, city: e.target.value })}
          />
        </Field>
        <Field label="UF">
          <input
            className={input}
            maxLength={2}
            value={party.state}
            onChange={(e) =>
              onChange({ ...party, state: e.target.value.toUpperCase() })
            }
          />
        </Field>
      </div>
        </>
      )}
    </div>
  );
}
