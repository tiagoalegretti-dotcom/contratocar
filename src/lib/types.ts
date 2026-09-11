export type PersonType = "pf" | "pf2" | "pj";
export type VehicleKind = "carro" | "moto" | "caminhao";
export type VehicleCondition = "usado" | "zero";
export type PaymentMethod = "" | "avista" | "sinal" | "parcelado" | "troca";
export type PayChannel = "" | "pix" | "transferencia" | "dinheiro";

export type FinancingStatus = "" | "none" | "paid_with_sale" | "seller_pays_before";
export type DebtsStatus = "" | "none" | "listed";
export type DefectsStatus = "" | "none" | "listed";
export type InspectionStatus = "" | "done" | "not_done";
export type AccessoriesStatus = "" | "stock" | "extras";
export type WarrantyStatus = "" | "as_is" | "legal";
export type PenaltyKind = "" | "10" | "20" | "custom_percent" | "fixed" | "none";

export type Party = {
  type: PersonType;
  name: string;
  document: string;
  rg: string;
  nationality: string;
  maritalStatus: string;
  occupation: string;
  name2: string;
  document2: string;
  rg2: string;
  maritalStatus2: string;
  occupation2: string;
  email: string;
  phone: string;
  zip: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
};

export type ContractData = {
  vehicleKind: VehicleKind;
  condition: VehicleCondition;
  seller: Party;
  buyer: Party;
  brand: string;
  model: string;
  yearManufacture: string;
  yearModel: string;
  color: string;
  plate: string;
  chassis: string;
  renavam: string;
  km: string;
  fuel: string;
  price: string;
  paymentMethod: PaymentMethod;
  payChannel: PayChannel;
  installments: string;
  depositAmount: string;
  tradeVehicle: string;
  tradeDifference: string;
  deliveryDate: string;
  deliveryPlace: string;
  financing: FinancingStatus;
  debtsStatus: DebtsStatus;
  knownDefects: string;
  debts: string;
  defectsStatus: DefectsStatus;
  inspection: InspectionStatus;
  accessoriesStatus: AccessoriesStatus;
  accessoriesNote: string;
  warranty: WarrantyStatus;
  penaltyKind: PenaltyKind;
  penaltyValue: string;
  transferDays: string;
  cityForum: string;
  stateForum: string;
};

export const emptyParty = (): Party => ({
  type: "pf",
  name: "",
  document: "",
  rg: "",
  nationality: "brasileiro(a)",
  maritalStatus: "",
  occupation: "",
  name2: "",
  document2: "",
  rg2: "",
  maritalStatus2: "",
  occupation2: "",
  email: "",
  phone: "",
  zip: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
});

export const emptyContract = (): ContractData => ({
  vehicleKind: "carro",
  condition: "usado",
  seller: emptyParty(),
  buyer: emptyParty(),
  brand: "",
  model: "",
  yearManufacture: "",
  yearModel: "",
  color: "",
  plate: "",
  chassis: "",
  renavam: "",
  km: "",
  fuel: "flex",
  price: "",
  paymentMethod: "",
  payChannel: "",
  installments: "",
  depositAmount: "",
  tradeVehicle: "",
  tradeDifference: "",
  deliveryDate: "",
  deliveryPlace: "",
  financing: "",
  debtsStatus: "",
  knownDefects: "",
  debts: "",
  defectsStatus: "",
  inspection: "",
  accessoriesStatus: "",
  accessoriesNote: "",
  warranty: "",
  penaltyKind: "",
  penaltyValue: "",
  transferDays: "30",
  cityForum: "",
  stateForum: "",
});

export const PRICE_BRL = 29.9;
