import type { ContractData } from "./types";

export const FINANCING_OPTIONS = [
  { value: "none", label: "Não tem financiamento" },
  { value: "paid_with_sale", label: "Tem, será quitado com o valor da venda" },
  { value: "seller_pays_before", label: "Tem, o vendedor quita antes da entrega" },
] as const;

export const DEBTS_OPTIONS = [
  { value: "none", label: "Não há débitos" },
  { value: "listed", label: "Há IPVA, multas ou outros débitos" },
] as const;

export const DEFECTS_OPTIONS = [
  { value: "none", label: "Nada a declarar" },
  { value: "listed", label: "Há histórico ou defeitos a declarar" },
] as const;

export const INSPECTION_OPTIONS = [
  { value: "done", label: "Vistoriou o veículo" },
  { value: "not_done", label: "Não vistoriou o veículo" },
] as const;

export const ACCESSORIES_OPTIONS = [
  { value: "stock", label: "Somente os de série" },
  { value: "extras", label: "Há itens e acessórios extras" },
] as const;

export const WARRANTY_OPTIONS = [
  { value: "as_is", label: "No estado em que se encontra" },
  { value: "legal", label: "Garantia da lei" },
] as const;

export const PAYMENT_OPTIONS = [
  { value: "avista", label: "À vista" },
  { value: "sinal", label: "Sinal e o resto na entrega" },
  { value: "parcelado", label: "Parcelado" },
  { value: "troca", label: "Com veículo na troca" },
] as const;

export const PENALTY_OPTIONS = [
  { value: "10", label: "10% do preço" },
  { value: "20", label: "20% do preço" },
  { value: "custom_percent", label: "Outro percentual" },
  { value: "fixed", label: "Valor fixo" },
  { value: "none", label: "Sem multa combinada" },
] as const;

function labelOf<T extends string>(
  options: readonly { value: T; label: string }[],
  value: string,
  empty: string,
) {
  return options.find((o) => o.value === value)?.label ?? empty;
}

export function situationSummaries(data: ContractData) {
  return {
    financing: labelOf(FINANCING_OPTIONS, data.financing, "Escolher"),
    debts:
      data.debtsStatus === "listed" && data.debts.trim()
        ? data.debts.trim()
        : labelOf(DEBTS_OPTIONS, data.debtsStatus, "Escolher"),
    defects:
      data.defectsStatus === "listed" && data.knownDefects.trim()
        ? data.knownDefects.trim()
        : labelOf(DEFECTS_OPTIONS, data.defectsStatus, "Escolher"),
    inspection: labelOf(INSPECTION_OPTIONS, data.inspection, "Escolher"),
    accessories:
      data.accessoriesStatus === "extras" && data.accessoriesNote.trim()
        ? data.accessoriesNote.trim()
        : labelOf(ACCESSORIES_OPTIONS, data.accessoriesStatus, "Escolher"),
    warranty: labelOf(WARRANTY_OPTIONS, data.warranty, "Escolher"),
    payment:
      data.paymentMethod === "avista" && data.payChannel
        ? `À vista (${data.payChannel === "pix" ? "PIX" : data.payChannel === "dinheiro" ? "dinheiro" : "transferência"})`
        : data.paymentMethod === "sinal" && data.depositAmount.trim()
          ? `Sinal de ${data.depositAmount.trim()}`
          : data.paymentMethod === "parcelado" && data.installments.trim()
            ? data.installments.trim()
            : data.paymentMethod === "troca" && data.tradeVehicle.trim()
              ? data.tradeVehicle.trim()
              : labelOf(PAYMENT_OPTIONS, data.paymentMethod, "Escolher"),
    penalty:
      data.penaltyKind === "custom_percent" && data.penaltyValue.trim()
        ? `${data.penaltyValue.trim()}% do preço`
        : data.penaltyKind === "fixed" && data.penaltyValue.trim()
          ? `R$ ${data.penaltyValue.trim()}`
          : labelOf(PENALTY_OPTIONS, data.penaltyKind, "Escolher"),
  };
}
