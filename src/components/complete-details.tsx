"use client";

import { Field, inputClass as input } from "@/components/form-ui";
import { ChoiceScreen, DeclarationScreen, SituationRow } from "@/components/situation-picker";
import { applyHistoryStatus, HISTORY_STEPS, type HistoryStep } from "@/lib/history";
import { isContractComplete } from "@/lib/validate";
import {
  ACCESSORIES_OPTIONS,
  DEBTS_OPTIONS,
  FINANCING_OPTIONS,
  INSPECTION_OPTIONS,
  situationSummaries,
} from "@/lib/situation";
import type { AccessoriesStatus, ContractData, DebtsStatus, FinancingStatus, InspectionStatus, Party, PayChannel, PaymentMethod, PenaltyKind, WarrantyStatus, YesNo } from "@/lib/types";
import { useState } from "react";

async function fillCep(party: Party, zip: string, onChange: (p: Party) => void) {
  const n = zip.replace(/\D/g, "");
  onChange({ ...party, zip });
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

function PartyBlock({
  title,
  party,
  onChange,
}: {
  title: string;
  party: Party;
  onChange: (p: Party) => void;
}) {
  return (
    <fieldset className="grid gap-3 rounded-2xl border border-zinc-200 p-4">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      {party.type === "pj" ? (
        <>
          <Field label="Razão social">
            <input className={input} value={party.name} onChange={(e) => onChange({ ...party, name: e.target.value })} />
          </Field>
          <Field label="CNPJ">
            <input className={input} inputMode="numeric" value={party.document} onChange={(e) => onChange({ ...party, document: e.target.value })} />
          </Field>
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-zinc-600">1ª pessoa</p>
          <Field label="Nome completo">
            <input className={input} value={party.name} onChange={(e) => onChange({ ...party, name: e.target.value })} />
          </Field>
          <Field label="CPF">
            <input className={input} inputMode="numeric" value={party.document} onChange={(e) => onChange({ ...party, document: e.target.value })} />
          </Field>
          <Field label="RG">
            <input className={input} value={party.rg} onChange={(e) => onChange({ ...party, rg: e.target.value })} />
          </Field>
          <Field label="Estado civil">
            <input className={input} value={party.maritalStatus} onChange={(e) => onChange({ ...party, maritalStatus: e.target.value })} />
          </Field>
          <Field label="Profissão">
            <input className={input} value={party.occupation} onChange={(e) => onChange({ ...party, occupation: e.target.value })} />
          </Field>
        </>
      )}
      {party.type === "pf2" && (
        <>
          <p className="mt-2 text-sm font-medium text-zinc-600">2ª pessoa</p>
          <Field label="Nome completo">
            <input className={input} value={party.name2} onChange={(e) => onChange({ ...party, name2: e.target.value })} />
          </Field>
          <Field label="CPF">
            <input className={input} inputMode="numeric" value={party.document2} onChange={(e) => onChange({ ...party, document2: e.target.value })} />
          </Field>
          <Field label="RG">
            <input className={input} value={party.rg2} onChange={(e) => onChange({ ...party, rg2: e.target.value })} />
          </Field>
          <Field label="Estado civil">
            <input className={input} value={party.maritalStatus2} onChange={(e) => onChange({ ...party, maritalStatus2: e.target.value })} />
          </Field>
          <Field label="Profissão">
            <input className={input} value={party.occupation2} onChange={(e) => onChange({ ...party, occupation2: e.target.value })} />
          </Field>
        </>
      )}
      <Field label="E-mail">
        <input className={input} type="email" autoComplete="email" value={party.email} onChange={(e) => onChange({ ...party, email: e.target.value })} />
      </Field>
      <Field label="Telefone">
        <input className={input} type="tel" inputMode="tel" value={party.phone} onChange={(e) => onChange({ ...party, phone: e.target.value })} />
      </Field>
      <Field label="CEP">
        <input
          className={input}
          inputMode="numeric"
          autoComplete="postal-code"
          value={party.zip}
          onChange={(e) => fillCep(party, e.target.value, onChange)}
        />
      </Field>
      <Field label="Rua">
        <input className={input} value={party.street} onChange={(e) => onChange({ ...party, street: e.target.value })} />
      </Field>
      <Field label="Número">
        <input className={input} inputMode="numeric" value={party.number} onChange={(e) => onChange({ ...party, number: e.target.value })} />
      </Field>
      <Field label="Bairro">
        <input className={input} value={party.neighborhood} onChange={(e) => onChange({ ...party, neighborhood: e.target.value })} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Cidade">
          <input className={input} value={party.city} onChange={(e) => onChange({ ...party, city: e.target.value })} />
        </Field>
        <Field label="UF">
          <input className={input} maxLength={2} value={party.state} onChange={(e) => onChange({ ...party, state: e.target.value.toUpperCase() })} />
        </Field>
      </div>
    </fieldset>
  );
}

export function CompleteDetails({
  data,
  onContinue,
}: {
  data: ContractData;
  onContinue: (next: ContractData) => void;
}) {
  const [local, setLocal] = useState(data);
  const [tried, setTried] = useState(false);
  const [declare, setDeclare] = useState<
    | null
    | "debts"
    | "accessories"
    | "warranty"
    | "payment"
    | "payChannel"
    | "deposit"
    | "installments"
    | "trade"
    | "penalty"
    | "penaltyValue"
  >(null);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [historyAskNote, setHistoryAskNote] = useState(false);
  const ready = isContractComplete(local);
  const sums = situationSummaries(local);

  function submit() {
    if (!ready) {
      setTried(true);
      return;
    }
    onContinue(applyHistoryStatus(local));
  }

  const historyStep: HistoryStep | undefined =
    historyIndex !== null ? HISTORY_STEPS[historyIndex] : undefined;

  if (historyStep && historyAskNote) {
    return (
      <DeclarationScreen
        title={historyStep.noteTitle}
        hint={historyStep.noteHint}
        label={historyStep.noteLabel}
        placeholder={historyStep.placeholder}
        value={String(local[historyStep.noteKey] ?? "")}
        onChange={(value) =>
          setLocal({ ...local, [historyStep.noteKey]: value })
        }
        onBack={() => setHistoryAskNote(false)}
        onDone={() => {
          const next = historyIndex! + 1;
          setHistoryAskNote(false);
          if (next >= HISTORY_STEPS.length) {
            setHistoryIndex(null);
            setLocal((prev) => applyHistoryStatus(prev));
          } else {
            setHistoryIndex(next);
          }
        }}
      />
    );
  }

  if (historyStep) {
    return (
      <ChoiceScreen
        title={historyStep.title}
        hint={historyStep.hint}
        value={String(local[historyStep.key] ?? "")}
        onBack={() => {
          if (historyIndex === 0) {
            setHistoryIndex(null);
            return;
          }
          const prev = HISTORY_STEPS[historyIndex! - 1];
          setHistoryIndex(historyIndex! - 1);
          setHistoryAskNote(local[prev.key] === "yes");
        }}
        onSelect={(value) => {
          const yes = value === "yes";
          const nextData = {
            ...local,
            [historyStep.key]: value as YesNo,
            [historyStep.noteKey]: yes
              ? local[historyStep.noteKey]
              : "",
          };
          setLocal(nextData);
          if (yes) {
            setHistoryAskNote(true);
            return;
          }
          const next = historyIndex! + 1;
          if (next >= HISTORY_STEPS.length) {
            setHistoryIndex(null);
            setLocal(applyHistoryStatus(nextData));
          } else {
            setHistoryIndex(next);
          }
        }}
        options={[
          {
            value: "yes",
            title: historyStep.yesTitle,
            description: historyStep.yesDescription,
          },
          {
            value: "no",
            title: historyStep.noTitle,
            description: historyStep.noDescription,
          },
        ]}
      />
    );
  }

  if (declare === "debts") {
    return (
      <DeclarationScreen
        title="Quais débitos o veículo tem hoje?"
        hint="IPVA, multa e licenciamento entram nessa declaração."
        label="Débitos do veículo"
        placeholder="Ex.: IPVA 2026 em aberto; 2 multas no Detran"
        value={local.debts}
        onChange={(debts) => setLocal({ ...local, debts })}
        onBack={() => setDeclare(null)}
        onDone={() => setDeclare(null)}
      />
    );
  }

  if (declare === "accessories") {
    return (
      <DeclarationScreen
        title="Quais itens e acessórios acompanham o veículo?"
        hint="Liste o que não é de série e vai junto na entrega."
        label="Itens e acessórios"
        placeholder="Ex.: som, película, estepe, tapetes"
        value={local.accessoriesNote}
        onChange={(accessoriesNote) => setLocal({ ...local, accessoriesNote })}
        onBack={() => setDeclare(null)}
        onDone={() => setDeclare(null)}
      />
    );
  }

  if (declare === "warranty") {
    return (
      <ChoiceScreen
        title="Como fica a garantia para o comprador?"
        hint="A lei continua cobrindo defeito que o vendedor conhecia e escondeu."
        value={local.warranty}
        onBack={() => setDeclare(null)}
        onSelect={(warranty) => {
          setLocal({ ...local, warranty: warranty as WarrantyStatus });
          setDeclare(null);
        }}
        options={[
          {
            value: "as_is",
            title: "No estado em que se encontra",
            badge: "Mais comum",
            description:
              "O comprador aceita o veículo como está, sem garantia de funcionamento.",
          },
          {
            value: "legal",
            title: "Garantia da lei",
            description:
              "Cobre vício oculto nos prazos do Código Civil e, se for relação de consumo, do CDC (90 dias para bem durável).",
          },
        ]}
      />
    );
  }

  if (declare === "payment") {
    return (
      <ChoiceScreen
        title="Como será feito o pagamento?"
        hint="Isso entra na cláusula de preço do contrato."
        value={local.paymentMethod}
        onBack={() => setDeclare(null)}
        onSelect={(paymentMethod) => {
          const next = paymentMethod as PaymentMethod;
          setLocal({ ...local, paymentMethod: next });
          if (next === "avista") setDeclare("payChannel");
          else if (next === "sinal") setDeclare("deposit");
          else if (next === "parcelado") setDeclare("installments");
          else if (next === "troca") setDeclare("trade");
          else setDeclare(null);
        }}
        options={[
          {
            value: "avista",
            title: "À vista",
            description: "O valor inteiro na hora da venda.",
          },
          {
            value: "sinal",
            title: "Sinal e o resto na entrega",
            description: "Uma parte agora e o saldo quando o veículo for entregue.",
          },
          {
            value: "parcelado",
            title: "Parcelado",
            description: "O preço dividido em parcelas combinadas entre as partes.",
          },
          {
            value: "troca",
            title: "Com veículo na troca",
            description: "Entra outro veículo como parte do pagamento.",
          },
        ]}
      />
    );
  }

  if (declare === "payChannel") {
    return (
      <ChoiceScreen
        title="Como o valor à vista será pago?"
        hint="PIX, transferência ou dinheiro."
        value={local.payChannel}
        onBack={() => setDeclare("payment")}
        onSelect={(payChannel) => {
          setLocal({ ...local, payChannel: payChannel as PayChannel });
          setDeclare(null);
        }}
        options={[
          { value: "pix", title: "PIX", description: "Pagamento instantâneo." },
          {
            value: "transferencia",
            title: "Transferência",
            description: "TED, DOC ou transferência entre contas.",
          },
          {
            value: "dinheiro",
            title: "Dinheiro",
            description: "Pagamento em espécie.",
          },
        ]}
      />
    );
  }

  if (declare === "deposit") {
    return (
      <DeclarationScreen
        title="Qual o valor do sinal?"
        hint="O restante fica para a data da entrega."
        label="Valor do sinal (R$)"
        placeholder="Ex.: 5000"
        value={local.depositAmount}
        onChange={(depositAmount) => setLocal({ ...local, depositAmount })}
        onBack={() => setDeclare("payment")}
        onDone={() => setDeclare(null)}
      />
    );
  }

  if (declare === "installments") {
    return (
      <DeclarationScreen
        title="Em quantas parcelas?"
        hint="Escreva o número e, se quiser, o valor de cada uma."
        label="Parcelas"
        placeholder="Ex.: 12 parcelas de R$ 1.200"
        value={local.installments}
        onChange={(installments) => setLocal({ ...local, installments })}
        onBack={() => setDeclare("payment")}
        onDone={() => setDeclare(null)}
      />
    );
  }

  if (declare === "trade") {
    return (
      <DeclarationScreen
        title="Qual veículo entra na troca?"
        hint="Marca, modelo, placa e, se houver, a diferença em dinheiro."
        label="Veículo da troca"
        placeholder="Ex.: Fiat Uno 2012, placa ABC1D23, diferença de R$ 8.000"
        value={local.tradeVehicle}
        onChange={(tradeVehicle) => setLocal({ ...local, tradeVehicle })}
        onBack={() => setDeclare("payment")}
        onDone={() => setDeclare(null)}
      />
    );
  }

  if (declare === "penalty") {
    return (
      <ChoiceScreen
        title="Qual multa vale se alguém desistir?"
        hint="A multa combinada não impede pedir perdas e danos nem o cumprimento do contrato."
        value={local.penaltyKind}
        onBack={() => setDeclare(null)}
        onSelect={(penaltyKind) => {
          const next = penaltyKind as PenaltyKind;
          setLocal({
            ...local,
            penaltyKind: next,
            penaltyValue:
              next === "custom_percent" || next === "fixed"
                ? local.penaltyValue
                : "",
          });
          if (next === "custom_percent" || next === "fixed") {
            setDeclare("penaltyValue");
          } else {
            setDeclare(null);
          }
        }}
        options={[
          {
            value: "10",
            title: "10% do preço",
            badge: "Mais comum",
            description: "Quem descumprir paga 10% do valor da venda.",
          },
          {
            value: "20",
            title: "20% do preço",
            description: "Multa maior, para quem quiser mais proteção.",
          },
          {
            value: "custom_percent",
            title: "Outro percentual",
            description: "Vocês escolhem a porcentagem sobre o preço.",
          },
          {
            value: "fixed",
            title: "Valor fixo",
            description: "Um valor em reais, combinado entre as partes.",
          },
          {
            value: "none",
            title: "Sem multa combinada",
            description: "Fica só perdas e danos, sem valor prefixado.",
          },
        ]}
      />
    );
  }

  if (declare === "penaltyValue") {
    const percent = local.penaltyKind === "custom_percent";
    return (
      <DeclarationScreen
        title={percent ? "Qual percentual da multa?" : "Qual o valor da multa?"}
        hint={
          percent
            ? "Informe só o número, sem o símbolo de porcentagem."
            : "Informe o valor em reais."
        }
        label={percent ? "Percentual" : "Valor (R$)"}
        placeholder={percent ? "Ex.: 15" : "Ex.: 3000"}
        value={local.penaltyValue}
        onChange={(penaltyValue) => setLocal({ ...local, penaltyValue })}
        onBack={() => setDeclare("penalty")}
        onDone={() => setDeclare(null)}
      />
    );
  }

  return (
    <div className="print:hidden">
      <h2 className="text-xl font-semibold">Complete o que faltou</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Agora entram chassi, RENAVAM, endereço completo, RG e o histórico do
        veículo. O restante que você já preencheu continua no contrato.
      </p>
      <div className="mt-6 grid gap-4">
        <PartyBlock
          title="Vendedor"
          party={local.seller}
          onChange={(seller) => setLocal({ ...local, seller })}
        />
        <PartyBlock
          title="Comprador"
          party={local.buyer}
          onChange={(buyer) => setLocal({ ...local, buyer })}
        />
        <fieldset className="grid gap-3 rounded-2xl border border-zinc-200 p-4 sm:grid-cols-2">
          <legend className="px-1 text-sm font-semibold">Veículo</legend>
          <Field label="Marca">
            <input className={input} value={local.brand} onChange={(e) => setLocal({ ...local, brand: e.target.value })} />
          </Field>
          <Field label="Modelo">
            <input className={input} value={local.model} onChange={(e) => setLocal({ ...local, model: e.target.value })} />
          </Field>
          <Field label="Placa">
            <input className={input} autoCapitalize="characters" value={local.plate} onChange={(e) => setLocal({ ...local, plate: e.target.value.toUpperCase() })} />
          </Field>
          <Field label="Preço da venda (R$)">
            <input className={input} inputMode="decimal" value={local.price} onChange={(e) => setLocal({ ...local, price: e.target.value })} />
          </Field>
          <Field label="Ano fabricação">
            <input className={input} inputMode="numeric" maxLength={4} value={local.yearManufacture} onChange={(e) => setLocal({ ...local, yearManufacture: e.target.value })} />
          </Field>
          <Field label="Ano modelo">
            <input className={input} inputMode="numeric" maxLength={4} value={local.yearModel} onChange={(e) => setLocal({ ...local, yearModel: e.target.value })} />
          </Field>
          <Field label="Cor">
            <input className={input} value={local.color} onChange={(e) => setLocal({ ...local, color: e.target.value })} />
          </Field>
          <Field label="Combustível">
            <input className={input} value={local.fuel} onChange={(e) => setLocal({ ...local, fuel: e.target.value })} />
          </Field>
          <Field label="Chassi">
            <input className={input} autoCapitalize="characters" value={local.chassis} onChange={(e) => setLocal({ ...local, chassis: e.target.value.toUpperCase() })} />
          </Field>
          <Field label="RENAVAM">
            <input className={input} inputMode="numeric" value={local.renavam} onChange={(e) => setLocal({ ...local, renavam: e.target.value })} />
          </Field>
          <Field label="Quilometragem">
            <input className={input} inputMode="numeric" value={local.km} onChange={(e) => setLocal({ ...local, km: e.target.value })} />
          </Field>
        </fieldset>
        <fieldset className="grid gap-2 rounded-2xl border border-zinc-200 p-4">
          <legend className="px-1 text-sm font-semibold">Situação do veículo</legend>
          <p className="mb-2 text-sm text-zinc-500">
            Toque em Alterar no que mudar. O site do Detran mostra débitos e restrições.
          </p>
          <SituationRow
            title="Financiamento"
            summary={sums.financing}
            options={FINANCING_OPTIONS}
            value={local.financing}
            onSelect={(financing) =>
              setLocal({ ...local, financing: financing as FinancingStatus })
            }
          />
          <SituationRow
            title="Débitos (IPVA, multas)"
            summary={sums.debts}
            options={DEBTS_OPTIONS}
            value={local.debtsStatus}
            followUpValues={["listed"]}
            onFollowUp={() => setDeclare("debts")}
            onSelect={(debtsStatus) =>
              setLocal({
                ...local,
                debtsStatus: debtsStatus as DebtsStatus,
                debts: debtsStatus === "none" ? "" : local.debts,
              })
            }
          />
          <SituationRow
            title="Histórico e defeitos"
            summary={sums.defects}
            onOpenPage={() => {
              setHistoryAskNote(false);
              setHistoryIndex(0);
            }}
          />
          <SituationRow
            title="Vistoria do comprador"
            summary={sums.inspection}
            options={INSPECTION_OPTIONS}
            value={local.inspection}
            onSelect={(inspection) =>
              setLocal({ ...local, inspection: inspection as InspectionStatus })
            }
          />
          <SituationRow
            title="Itens e acessórios"
            summary={sums.accessories}
            options={ACCESSORIES_OPTIONS}
            value={local.accessoriesStatus}
            followUpValues={["extras"]}
            onFollowUp={() => setDeclare("accessories")}
            onSelect={(accessoriesStatus) =>
              setLocal({
                ...local,
                accessoriesStatus: accessoriesStatus as AccessoriesStatus,
                accessoriesNote:
                  accessoriesStatus === "stock" ? "" : local.accessoriesNote,
              })
            }
          />
          <SituationRow
            title="Garantia"
            summary={sums.warranty}
            onOpenPage={() => setDeclare("warranty")}
          />
          <SituationRow
            title="Forma de pagamento"
            summary={sums.payment}
            onOpenPage={() => setDeclare("payment")}
          />
          <SituationRow
            title="Multa por quebra"
            summary={sums.penalty}
            onOpenPage={() => setDeclare("penalty")}
          />
        </fieldset>
        <fieldset className="grid gap-3 rounded-2xl border border-zinc-200 p-4">
          <legend className="px-1 text-sm font-semibold">Negociação</legend>
          <Field label="Data da entrega">
            <input className={input} type="date" value={local.deliveryDate} onChange={(e) => setLocal({ ...local, deliveryDate: e.target.value })} />
          </Field>
          <Field label="Local da entrega">
            <input className={input} value={local.deliveryPlace} onChange={(e) => setLocal({ ...local, deliveryPlace: e.target.value })} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Prazo transferência (dias)">
              <input className={input} inputMode="numeric" value={local.transferDays} onChange={(e) => setLocal({ ...local, transferDays: e.target.value })} />
            </Field>
            <Field label="Cidade do foro">
              <input className={input} value={local.cityForum} onChange={(e) => setLocal({ ...local, cityForum: e.target.value })} />
            </Field>
            <Field label="UF do foro">
              <input className={input} maxLength={2} value={local.stateForum} onChange={(e) => setLocal({ ...local, stateForum: e.target.value.toUpperCase() })} />
            </Field>
          </div>
        </fieldset>
      </div>
      <div className="mt-6">
        <button
          type="button"
          onClick={submit}
          className="min-h-12 rounded-full bg-violet-600 px-5 text-base font-medium text-white disabled:opacity-40"
        >
          Ir para o contrato
        </button>
        {tried && !ready && (
          <p className="mt-3 text-sm text-amber-700">
            Preencha todos os campos para continuar.
          </p>
        )}
      </div>
    </div>
  );
}

