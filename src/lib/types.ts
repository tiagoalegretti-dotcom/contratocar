export type PersonType = "pf" | "pj";
export type VehicleKind = "carro" | "moto" | "caminhao";
export type VehicleCondition = "usado" | "zero";
export type PaymentMethod = "pix" | "transferencia" | "dinheiro" | "parcelado";

export type Party = {
  type: PersonType;
  name: string;
  document: string;
  rg: string;
  nationality: string;
  maritalStatus: string;
  occupation: string;
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
  installments: string;
  deliveryDate: string;
  deliveryPlace: string;
  knownDefects: string;
  debts: string;
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
  paymentMethod: "pix",
  installments: "",
  deliveryDate: "",
  deliveryPlace: "",
  knownDefects: "",
  debts: "",
  transferDays: "30",
  cityForum: "",
  stateForum: "",
});

export const PRICE_BRL = 29.9;
