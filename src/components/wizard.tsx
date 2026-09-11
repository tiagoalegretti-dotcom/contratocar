"use client";

import { ContractPreview } from "@/components/contract-preview";
import { emptyContract, type ContractData, type Party } from "@/lib/types";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  "Negociação",
  "Vendedor",
  "Comprador",
  "Veículo",
  "Pagamento",
  "Extras",
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-zinc-700">{label}</span>
      {children}
    </label>
  );
}

const input =
  "min-h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 text-base outline-none ring-violet-600/20 placeholder:text-zinc-400 focus:border-violet-500 focus:ring-4";

function PartyFields({
  party,
  onChange,
}: {
  party: Party;
  onChange: (p: Party) => void;
}) {
  const set = (k: keyof Party, v: string) => onChange({ ...party, [k]: v });

  async function onZip(zip: string) {
    set("zip", zip);
    const n = zip.replace(/\D/g, "");
    if (n.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${n}/json/`);
      const json = (await res.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };
      if (json.erro) return;
      onChange({
        ...party,
        zip,
        street: json.logradouro || party.street,
        neighborhood: json.bairro || party.neighborhood,
        city: json.localidade || party.city,
        state: json.uf || party.state,
      });
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Pessoa">
        <select
          className={input}
          value={party.type}
          onChange={(e) =>
            onChange({ ...party, type: e.target.value as Party["type"] })
          }
        >
          <option value="pf">Pessoa física</option>
          <option value="pj">Pessoa jurídica</option>
        </select>
      </Field>
      <Field label={party.type === "pj" ? "Razão social" : "Nome completo"}>
        <input
          className={input}
          autoComplete="name"
          autoCapitalize="words"
          value={party.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </Field>
      <Field label={party.type === "pj" ? "CNPJ" : "CPF"}>
        <input
          className={input}
          inputMode="numeric"
          autoComplete="off"
          value={party.document}
          onChange={(e) => set("document", e.target.value)}
        />
      </Field>
      {party.type === "pf" && (
        <>
          <Field label="RG">
            <input
              className={input}
              value={party.rg}
              onChange={(e) => set("rg", e.target.value)}
            />
          </Field>
          <Field label="Estado civil">
            <input
              className={input}
              value={party.maritalStatus}
              onChange={(e) => set("maritalStatus", e.target.value)}
            />
          </Field>
          <Field label="Profissão">
            <input
              className={input}
              autoComplete="organization-title"
              value={party.occupation}
              onChange={(e) => set("occupation", e.target.value)}
            />
          </Field>
        </>
      )}
      <Field label="E-mail">
        <input
          className={input}
          type="email"
          autoComplete="email"
          inputMode="email"
          value={party.email}
          onChange={(e) => set("email", e.target.value)}
        />
      </Field>
      <Field label="Telefone">
        <input
          className={input}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={party.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
      </Field>
      <Field label="CEP">
        <input
          className={input}
          inputMode="numeric"
          autoComplete="postal-code"
          value={party.zip}
          onChange={(e) => onZip(e.target.value)}
        />
      </Field>
      <Field label="Rua">
        <input
          className={input}
          autoComplete="address-line1"
          value={party.street}
          onChange={(e) => set("street", e.target.value)}
        />
      </Field>
      <Field label="Número">
        <input
          className={input}
          inputMode="numeric"
          autoComplete="address-line2"
          value={party.number}
          onChange={(e) => set("number", e.target.value)}
        />
      </Field>
      <Field label="Bairro">
        <input
          className={input}
          value={party.neighborhood}
          onChange={(e) => set("neighborhood", e.target.value)}
        />
      </Field>
      <Field label="Cidade">
        <input
          className={input}
          autoComplete="address-level2"
          value={party.city}
          onChange={(e) => set("city", e.target.value)}
        />
      </Field>
      <Field label="UF">
        <input
          className={input}
          maxLength={2}
          autoComplete="address-level1"
          autoCapitalize="characters"
          value={party.state}
          onChange={(e) => set("state", e.target.value.toUpperCase())}
        />
      </Field>
    </div>
  );
}

export function Wizard() {
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState<"form" | "preview">("form");
  const [data, setData] = useState<ContractData>(emptyContract);
  const [finishing, setFinishing] = useState(false);
  const router = useRouter();
  const set = <K extends keyof ContractData>(k: K, v: ContractData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const canFinish = useMemo(() => {
    return Boolean(
      data.seller.name &&
        data.seller.document &&
        data.buyer.name &&
        data.buyer.document &&
        data.brand &&
        data.model &&
        data.plate &&
        data.price,
    );
  }, [data]);

  async function finish() {
    setFinishing(true);
    sessionStorage.setItem("contratocar-contract", JSON.stringify(data));
    router.push("/entrar");
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-24 pt-4 lg:px-6 lg:py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:pb-6">
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
            {step === 0 && (
              <div className="grid gap-3">
                <Field label="Tipo de veículo">
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
              </div>
            )}
            {step === 1 && (
              <PartyFields
                party={data.seller}
                onChange={(seller) => setData((d) => ({ ...d, seller }))}
              />
            )}
            {step === 2 && (
              <PartyFields
                party={data.buyer}
                onChange={(buyer) => setData((d) => ({ ...d, buyer }))}
              />
            )}
            {step === 3 && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Marca">
                  <input className={input} value={data.brand} onChange={(e) => set("brand", e.target.value)} />
                </Field>
                <Field label="Modelo">
                  <input className={input} value={data.model} onChange={(e) => set("model", e.target.value)} />
                </Field>
                <Field label="Ano fabricação">
                  <input className={input} inputMode="numeric" maxLength={4} value={data.yearManufacture} onChange={(e) => set("yearManufacture", e.target.value)} />
                </Field>
                <Field label="Ano modelo">
                  <input className={input} inputMode="numeric" maxLength={4} value={data.yearModel} onChange={(e) => set("yearModel", e.target.value)} />
                </Field>
                <Field label="Cor">
                  <input className={input} value={data.color} onChange={(e) => set("color", e.target.value)} />
                </Field>
                <Field label="Combustível">
                  <input className={input} value={data.fuel} onChange={(e) => set("fuel", e.target.value)} />
                </Field>
                <Field label="Placa">
                  <input className={input} autoCapitalize="characters" value={data.plate} onChange={(e) => set("plate", e.target.value.toUpperCase())} />
                </Field>
                <Field label="Chassi">
                  <input className={input} autoCapitalize="characters" value={data.chassis} onChange={(e) => set("chassis", e.target.value.toUpperCase())} />
                </Field>
                <Field label="RENAVAM">
                  <input className={input} inputMode="numeric" value={data.renavam} onChange={(e) => set("renavam", e.target.value)} />
                </Field>
                <Field label="Quilometragem">
                  <input className={input} inputMode="numeric" value={data.km} onChange={(e) => set("km", e.target.value)} />
                </Field>
              </div>
            )}
            {step === 4 && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Preço (R$)">
                  <input className={input} inputMode="decimal" placeholder="45000,00" value={data.price} onChange={(e) => set("price", e.target.value)} />
                </Field>
                <Field label="Forma de pagamento">
                  <select
                    className={input}
                    value={data.paymentMethod}
                    onChange={(e) =>
                      set("paymentMethod", e.target.value as ContractData["paymentMethod"])
                    }
                  >
                    <option value="pix">PIX</option>
                    <option value="transferencia">Transferência</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="parcelado">Parcelado</option>
                  </select>
                </Field>
                {data.paymentMethod === "parcelado" && (
                  <Field label="Parcelas">
                    <input className={input} value={data.installments} onChange={(e) => set("installments", e.target.value)} />
                  </Field>
                )}
                <Field label="Data da entrega">
                  <input className={input} type="date" value={data.deliveryDate} onChange={(e) => set("deliveryDate", e.target.value)} />
                </Field>
                <Field label="Local da entrega">
                  <input className={input} value={data.deliveryPlace} onChange={(e) => set("deliveryPlace", e.target.value)} />
                </Field>
              </div>
            )}
            {step === 5 && (
              <div className="grid gap-3">
                <Field label="Débitos conhecidos (IPVA, multa, financiamento)">
                  <textarea className={`${input} min-h-20`} value={data.debts} onChange={(e) => set("debts", e.target.value)} />
                </Field>
                <Field label="Defeitos conhecidos">
                  <textarea className={`${input} min-h-20`} value={data.knownDefects} onChange={(e) => set("knownDefects", e.target.value)} />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Prazo de transferência (dias)">
                    <input className={input} value={data.transferDays} onChange={(e) => set("transferDays", e.target.value)} />
                  </Field>
                  <Field label="Cidade do foro">
                    <input className={input} value={data.cityForum} onChange={(e) => set("cityForum", e.target.value)} />
                  </Field>
                  <Field label="UF do foro">
                    <input className={input} maxLength={2} value={data.stateForum} onChange={(e) => set("stateForum", e.target.value.toUpperCase())} />
                  </Field>
                </div>
              </div>
            )}

            <div className="mt-5 hidden items-center justify-between gap-3 lg:flex">
              <button
                className="rounded-full px-4 py-2 text-sm text-zinc-600 disabled:opacity-40"
                disabled={step === 0}
                onClick={() => setStep((s) => s - 1)}
              >
                Voltar
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
                  onClick={() => setStep((s) => s + 1)}
                >
                  Continuar
                </button>
              ) : (
                <button
                  disabled={!canFinish || finishing}
                  onClick={finish}
                  className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-40"
                >
                  {finishing ? "Aguarde..." : "Finalizar"}
                </button>
              )}
            </div>
            {step === STEPS.length - 1 && !canFinish && (
              <p className="mt-3 text-xs text-amber-700">
                Preencha nome e documento das partes, marca, modelo, placa e preço para finalizar.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 p-3 backdrop-blur-md lg:hidden print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <button
            className="min-h-12 rounded-full px-4 text-base text-zinc-600 disabled:opacity-40"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            Voltar
          </button>
          {step < STEPS.length - 1 ? (
            <button
              className="min-h-12 flex-1 rounded-full bg-violet-600 px-5 text-base font-medium text-white"
              onClick={() => setStep((s) => s + 1)}
            >
              Continuar
            </button>
          ) : (
            <button
              disabled={!canFinish || finishing}
              onClick={finish}
              className="min-h-12 flex-1 rounded-full bg-violet-600 px-5 text-base font-medium text-white disabled:opacity-40"
            >
              {finishing ? "Aguarde..." : "Finalizar"}
            </button>
          )}
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
