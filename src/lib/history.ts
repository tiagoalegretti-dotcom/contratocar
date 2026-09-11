import type { ContractData, YesNo } from "./types";

export type HistoryStep = {
  key: keyof ContractData;
  noteKey: keyof ContractData;
  title: string;
  hint: string;
  yesTitle: string;
  yesDescription: string;
  noTitle: string;
  noDescription: string;
  noteTitle: string;
  noteHint: string;
  noteLabel: string;
  placeholder: string;
  clauseYes: string;
  clauseNo: string;
  shortYes: string;
};

export const HISTORY_STEPS: HistoryStep[] = [
  {
    key: "historyCrash",
    noteKey: "historyCrashNote",
    title: "O veículo já teve sinistro ou batida?",
    hint: "Colisão, capotamento, enchente ou outro evento que tenha gerado aviso à seguradora.",
    yesTitle: "Sim, houve sinistro ou batida",
    yesDescription: "O contrato vai registrar o que aconteceu.",
    noTitle: "Não, no que o vendedor sabe",
    noDescription: "Nenhum sinistro relevante de conhecimento do vendedor.",
    noteTitle: "O que aconteceu no sinistro?",
    noteHint: "Ano aproximado, o que foi atingido e se foi reparado.",
    noteLabel: "Sinistro ou batida",
    placeholder: "Ex.: batida na traseira em 2022, lanternas e para-choque trocados",
    clauseYes:
      "O(A) VENDEDOR(A) declara que o veículo sofreu sinistro ou batida, nos seguintes termos:",
    clauseNo:
      "O(A) VENDEDOR(A) declara que, no que é de seu conhecimento, o veículo não sofreu sinistro, batida grave, enchente nem aviso de sinistro à seguradora.",
    shortYes: "Sinistro",
  },
  {
    key: "historyAuction",
    noteKey: "historyAuctionNote",
    title: "O veículo veio de leilão ou foi recuperado?",
    hint: "Leilão, perda total, recuperado de roubo ou restrição de leilão.",
    yesTitle: "Sim, leilão ou recuperado",
    yesDescription: "Isso precisa constar no contrato.",
    noTitle: "Não veio de leilão",
    noDescription: "Não é veículo de leilão nem recuperado, no que o vendedor sabe.",
    noteTitle: "Qual a origem de leilão ou recuperação?",
    noteHint: "Se souber, informe o tipo (sinistro, financeira, roubo) e o ano.",
    noteLabel: "Leilão ou recuperado",
    placeholder: "Ex.: leilão de seguradora em 2021, perda parcial, já transferido",
    clauseYes:
      "O(A) VENDEDOR(A) declara que o veículo teve passagem por leilão ou recuperação, nos seguintes termos:",
    clauseNo:
      "O(A) VENDEDOR(A) declara que, no que é de seu conhecimento, o veículo não é proveniente de leilão, perda total ou recuperação de roubo.",
    shortYes: "Leilão",
  },
  {
    key: "historyParts",
    noteKey: "historyPartsNote",
    title: "Motor, câmbio ou peça importante foi trocada?",
    hint: "Motor, câmbio, cabeçote, kit de embreagem, direção ou suspensão relevante.",
    yesTitle: "Sim, houve troca importante",
    yesDescription: "O contrato vai listar o que foi trocado.",
    noTitle: "Não houve troca relevante",
    noDescription: "Só desgaste natural, no que o vendedor sabe.",
    noteTitle: "O que foi trocado ou reparado?",
    noteHint: "Peça, ano aproximado e se tem nota.",
    noteLabel: "Peças e reparos",
    placeholder: "Ex.: câmbio trocado em 2023, com nota fiscal",
    clauseYes:
      "O(A) VENDEDOR(A) declara as seguintes trocas ou reparos relevantes:",
    clauseNo:
      "O(A) VENDEDOR(A) declara que, no que é de seu conhecimento, não houve troca de motor, câmbio nem outro conjunto relevante além da manutenção de rotina.",
    shortYes: "Peças trocadas",
  },
  {
    key: "historyDocs",
    noteKey: "historyDocsNote",
    title: "Há pendência de documento ou restrição?",
    hint: "CRLV atrasado, recall em aberto, bloqueio, comunicação de venda antiga ou outro problema no registro.",
    yesTitle: "Sim, há pendência",
    yesDescription: "O comprador precisa saber antes de fechar.",
    noTitle: "Documentos em ordem",
    noDescription: "Sem pendência conhecida no registro.",
    noteTitle: "Qual a pendência de documento?",
    noteHint: "O que falta regularizar e quem fica responsável.",
    noteLabel: "Pendência",
    placeholder: "Ex.: recall de airbag em aberto; CRLV do ano ainda não emitido",
    clauseYes:
      "O(A) VENDEDOR(A) declara as seguintes pendências de documento ou restrição:",
    clauseNo:
      "O(A) VENDEDOR(A) declara que, no que é de seu conhecimento, não há pendência de documento, recall em aberto nem restrição no registro além do que já conste neste contrato.",
    shortYes: "Documento",
  },
  {
    key: "historyOther",
    noteKey: "historyOtherNote",
    title: "Há outro defeito ou fato a declarar?",
    hint: "Barulho, ar-condicionado, elétrica, funilaria, luz no painel ou qualquer outro problema conhecido.",
    yesTitle: "Sim, há mais o que declarar",
    yesDescription: "Escreva o que o comprador precisa saber.",
    noTitle: "Nada mais a declarar",
    noDescription: "Além das respostas anteriores, só o desgaste natural do uso.",
    noteTitle: "Quais outros defeitos ou fatos?",
    noteHint: "Quanto mais específico, menos briga depois.",
    noteLabel: "Outros fatos",
    placeholder: "Ex.: ar-condicionado sem gás; risco na porta direita; luz de injeção acesa",
    clauseYes: "O(A) VENDEDOR(A) declara ainda os seguintes fatos ou defeitos:",
    clauseNo:
      "O(A) VENDEDOR(A) declara não ter outros fatos ou defeitos a informar além do desgaste natural do uso e do que já ficou registrado acima.",
    shortYes: "Outros defeitos",
  },
];

function answer(data: ContractData, key: keyof ContractData): YesNo {
  const v = data[key];
  return v === "yes" || v === "no" ? v : "";
}

function noteOf(data: ContractData, key: keyof ContractData) {
  return String(data[key] ?? "").trim();
}

export function isHistoryComplete(data: ContractData) {
  return HISTORY_STEPS.every((step) => {
    const v = answer(data, step.key);
    if (v === "no") return true;
    if (v === "yes") return Boolean(noteOf(data, step.noteKey));
    return false;
  });
}

export function applyHistoryStatus(data: ContractData): ContractData {
  const anyYes = HISTORY_STEPS.some((step) => answer(data, step.key) === "yes");
  return {
    ...data,
    defectsStatus: anyYes ? "listed" : "none",
    knownDefects: compileVehicleHistory(data),
  };
}

export function compileVehicleHistory(data: ContractData) {
  return HISTORY_STEPS.map((step) => {
    const v = answer(data, step.key);
    if (v === "yes") {
      return `${step.clauseYes} ${noteOf(data, step.noteKey)}.`;
    }
    if (v === "no") return step.clauseNo;
    return "";
  })
    .filter(Boolean)
    .join(" ");
}

export function historySummary(data: ContractData) {
  if (!HISTORY_STEPS.some((step) => answer(data, step.key))) {
    return "Escolher";
  }
  const yes = HISTORY_STEPS.filter((step) => answer(data, step.key) === "yes");
  if (yes.length === 0) {
    if (isHistoryComplete(data)) return "Nada relevante a declarar";
    return "Incompleto";
  }
  return yes.map((step) => step.shortYes).join("; ");
}
