import type { ContractData, Party } from "./types";

function filled(v: string) {
  return Boolean(v.trim());
}

function partyComplete(p: Party) {
  const base =
    filled(p.name) &&
    filled(p.document) &&
    filled(p.email) &&
    filled(p.phone) &&
    filled(p.zip) &&
    filled(p.street) &&
    filled(p.number) &&
    filled(p.neighborhood) &&
    filled(p.city) &&
    filled(p.state);

  if (p.type === "pj") return base;

  const person1 =
    filled(p.rg) && filled(p.maritalStatus) && filled(p.occupation);

  if (p.type === "pf2") {
    return (
      base &&
      person1 &&
      filled(p.name2) &&
      filled(p.document2) &&
      filled(p.rg2) &&
      filled(p.maritalStatus2) &&
      filled(p.occupation2)
    );
  }

  return base && person1;
}

export function isContractComplete(data: ContractData) {
  return (
    partyComplete(data.seller) &&
    partyComplete(data.buyer) &&
    filled(data.brand) &&
    filled(data.model) &&
    filled(data.plate) &&
    filled(data.yearManufacture) &&
    filled(data.yearModel) &&
    filled(data.color) &&
    filled(data.chassis) &&
    filled(data.renavam) &&
    filled(data.km) &&
    filled(data.fuel) &&
    filled(data.price) &&
    Boolean(data.paymentMethod) &&
    (data.paymentMethod !== "avista" || Boolean(data.payChannel)) &&
    (data.paymentMethod !== "sinal" || filled(data.depositAmount)) &&
    (data.paymentMethod !== "parcelado" || filled(data.installments)) &&
    (data.paymentMethod !== "troca" || filled(data.tradeVehicle)) &&
    filled(data.deliveryDate) &&
    filled(data.deliveryPlace) &&
    Boolean(data.financing) &&
    Boolean(data.debtsStatus) &&
    (data.debtsStatus !== "listed" || filled(data.debts)) &&
    Boolean(data.defectsStatus) &&
    (data.defectsStatus !== "listed" || filled(data.knownDefects)) &&
    Boolean(data.inspection) &&
    Boolean(data.accessoriesStatus) &&
    (data.accessoriesStatus !== "extras" || filled(data.accessoriesNote)) &&
    Boolean(data.warranty) &&
    Boolean(data.penaltyKind) &&
    ((data.penaltyKind !== "custom_percent" && data.penaltyKind !== "fixed") ||
      filled(data.penaltyValue)) &&
    filled(data.transferDays) &&
    filled(data.cityForum) &&
    filled(data.stateForum)
  );
}
