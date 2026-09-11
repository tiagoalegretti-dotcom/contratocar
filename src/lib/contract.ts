import { formatBRL, moneyExtenso } from "./money";
import type { ContractData, Party } from "./types";

function blank(value: string, fallback = "________________") {
  const v = value.trim();
  return v || fallback;
}

function qualifyOne(
  name: string,
  document: string,
  rg: string,
  maritalStatus: string,
  occupation: string,
  nationality: string,
  addr: string,
) {
  return `${blank(name)}, ${blank(nationality, "brasileiro(a)")}, ${blank(maritalStatus, "estado civil não informado")}, ${blank(occupation, "profissão não informada")}, inscrito(a) no CPF nº ${blank(document)} e RG nº ${blank(rg)}, residente e domiciliado(a) em ${addr}`;
}

function qualify(p: Party, role: string) {
  const addr = address(p);
  if (p.type === "pj") {
    return `${role}: ${blank(p.name)}, pessoa jurídica inscrita no CNPJ nº ${blank(p.document)}, com sede em ${addr}, neste ato representada na forma de seu contrato social`;
  }
  if (p.type === "pf2") {
    return `${role}: ${qualifyOne(p.name, p.document, p.rg, p.maritalStatus, p.occupation, p.nationality, addr)} e ${qualifyOne(p.name2, p.document2, p.rg2, p.maritalStatus2, p.occupation2, p.nationality, addr)}, na qualidade de coproprietários / em conjunto`;
  }
  return `${role}: ${qualifyOne(p.name, p.document, p.rg, p.maritalStatus, p.occupation, p.nationality, addr)}`;
}

export function partyLabel(p: Party) {
  if (p.type === "pf2") {
    return [p.name, p.name2].filter((n) => n.trim()).join(" e ") || "________________";
  }
  return p.name;
}

function address(p: Party) {
  const line = [
    p.street && ` ${p.street}`,
    p.number && `, nº ${p.number}`,
    p.neighborhood && `, ${p.neighborhood}`,
    (p.city || p.state) && `, ${p.city}/${p.state}`,
    p.zip && `, CEP ${p.zip}`,
  ]
    .filter(Boolean)
    .join("");
  return line.trim() || "endereço não informado";
}

function kindLabel(kind: ContractData["vehicleKind"]) {
  if (kind === "moto") return "motocicleta";
  if (kind === "caminhao") return "caminhão";
  return "automóvel";
}

function paymentLabel(data: ContractData) {
  if (data.paymentMethod === "sinal") {
    return `sinal de ${blank(data.depositAmount)} e o restante na entrega`;
  }
  if (data.paymentMethod === "parcelado") {
    return `pagamento parcelado em ${blank(data.installments)} parcela(s)`;
  }
  if (data.paymentMethod === "troca") {
    const extra = data.tradeDifference.trim()
      ? `, com diferença de ${data.tradeDifference.trim()}`
      : "";
    return `dação em pagamento / troca pelo veículo ${blank(data.tradeVehicle)}${extra}`;
  }
  const channel = {
    pix: "PIX",
    transferencia: "transferência bancária",
    dinheiro: "dinheiro",
    "": "pagamento à vista",
  }[data.payChannel];
  return `pagamento à vista, por ${channel}`;
}

function financingClause(data: ContractData) {
  if (data.financing === "paid_with_sale") {
    return "O veículo possui financiamento. As partes ajustam que a quitação ocorrerá com o valor desta venda, e o(a) VENDEDOR(A) entregará o comprovante de baixa da alienação.";
  }
  if (data.financing === "seller_pays_before") {
    return "O veículo possui financiamento. O(A) VENDEDOR(A) quitará a dívida antes da entrega e apresentará o comprovante de baixa da alienação.";
  }
  return "O(A) VENDEDOR(A) declara que o veículo não está alienado fiduciariamente nem vinculado a financiamento, no que é de seu conhecimento.";
}

function debtsClause(data: ContractData) {
  if (data.debtsStatus === "listed") {
    return `O(A) VENDEDOR(A) declara os seguintes débitos conhecidos: ${blank(data.debts)}. Multas e tributos posteriores à entrega são de responsabilidade do(a) COMPRADOR(A).`;
  }
  return "O(A) VENDEDOR(A) declara que, até a data da entrega, o veículo está livre de débitos de IPVA, licenciamento e multas de seu conhecimento. Multas lavradas após a entrega são de responsabilidade do(a) COMPRADOR(A).";
}

function defectsClause(data: ContractData) {
  const defects =
    data.defectsStatus === "listed"
      ? `O(A) VENDEDOR(A) declara os seguintes fatos/defeitos conhecidos: ${blank(data.knownDefects)}.`
      : "O(A) VENDEDOR(A) declara não ter outros fatos ou defeitos a informar além do desgaste natural do uso.";
  const inspection =
    data.inspection === "not_done"
      ? " O(A) COMPRADOR(A) declara que não vistoriou o veículo e assume o risco dessa escolha."
      : " O(A) COMPRADOR(A) declara ter vistoriado o veículo e aceitá-lo no estado descrito.";
  return `${defects}${inspection} Aplicam-se, no que couber, os arts. 441 e seguintes do Código Civil.`;
}

function warrantyClause(data: ContractData) {
  if (data.warranty === "legal") {
    return "As partes ajustam garantia por vício oculto. Se a relação for de consumo, aplicam-se os prazos do Código de Defesa do Consumidor (90 dias para bem durável). Fora disso, aplicam-se os arts. 441 e seguintes do Código Civil. Permanece a responsabilidade por defeito que o(a) VENDEDOR(A) conhecia e ocultou.";
  }
  return "O veículo é vendido no estado em que se encontra. O(A) COMPRADOR(A) declara aceitá-lo assim, sem garantia contratual de funcionamento. Isso não afasta a responsabilidade do(a) VENDEDOR(A) por vício que conhecia e ocultou, nos termos da boa-fé e do Código Civil.";
}

function penaltyClause(data: ContractData) {
  const extra =
    "sem prejuízo de perdas e danos e da execução específica do contrato";
  if (data.penaltyKind === "none") {
    return `Não há multa prefixada. O descumprimento autoriza a parte inocente a exigir perdas e danos e o cumprimento do contrato, nos termos do Código Civil.`;
  }
  if (data.penaltyKind === "20") {
    return `O descumprimento de qualquer obrigação sujeita a parte inadimplente a multa de 20% (vinte por cento) sobre o preço, ${extra}.`;
  }
  if (data.penaltyKind === "custom_percent") {
    const n = blank(data.penaltyValue);
    return `O descumprimento de qualquer obrigação sujeita a parte inadimplente a multa de ${n}% (${n} por cento) sobre o preço, ${extra}.`;
  }
  if (data.penaltyKind === "fixed") {
    return `O descumprimento de qualquer obrigação sujeita a parte inadimplente a multa no valor de R$ ${blank(data.penaltyValue)}, ${extra}.`;
  }
  return `O descumprimento de qualquer obrigação sujeita a parte inadimplente a multa de 10% (dez por cento) sobre o preço, ${extra}.`;
}

function accessoriesClause(data: ContractData) {
  if (data.accessoriesStatus === "extras") {
    return `O veículo é vendido com os equipamentos de série e com os seguintes itens e acessórios: ${blank(data.accessoriesNote)}.`;
  }
  return "O veículo é vendido somente com os equipamentos de série, sem acessórios extras além dos que o acompanham de fábrica.";
}

export function parsePrice(price: string) {
  const n = Number(
    price.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."),
  );
  return Number.isFinite(n) ? n : 0;
}

export type Clause = { title: string; body: string };

export function buildClauses(data: ContractData): Clause[] {
  const price = parsePrice(data.price);
  const vehicle = `${blank(data.brand)} ${blank(data.model)}`.trim();
  const kind = kindLabel(data.vehicleKind);
  const condition =
    data.condition === "zero" ? "zero quilômetro" : "usado";

  return [
    {
      title: "DAS PARTES",
      body: `${qualify(data.seller, "VENDEDOR(A)")}, e ${qualify(data.buyer, "COMPRADOR(A)")}, têm entre si justo e contratado o seguinte.`,
    },
    {
      title: "DO OBJETO",
      body: `O(A) VENDEDOR(A) vende ao(à) COMPRADOR(A) o ${kind} ${condition} ${vehicle}, ano de fabricação ${blank(data.yearManufacture)}, modelo ${blank(data.yearModel)}, cor ${blank(data.color)}, combustível ${blank(data.fuel)}, placa ${blank(data.plate)}, chassi ${blank(data.chassis)}, RENAVAM ${blank(data.renavam)}, com ${blank(data.km, "quilometragem não informada")} km rodados, no estado em que se encontra. ${accessoriesClause(data)}`,
    },
    {
      title: "DO PREÇO E PAGAMENTO",
      body: `O preço certo e ajustado é de ${formatBRL(price)} (${moneyExtenso(price) || "valor por extenso"}), a ser pago por ${paymentLabel(data)}. O comprovante vale como recibo.`,
    },
    {
      title: "DO FINANCIAMENTO",
      body: financingClause(data),
    },
    {
      title: "DA ENTREGA E POSSE",
      body: `A entrega do veículo ocorrerá em ${blank(data.deliveryPlace, "local a combinar")}, na data de ${blank(data.deliveryDate, "data a combinar")}. A posse transmite-se com a entrega, nos termos dos arts. 481 e seguintes do Código Civil.`,
    },
    {
      title: "DA TRANSFERÊNCIA",
      body: `O(A) COMPRADOR(A) obriga-se a promover a transferência de propriedade junto ao órgão de trânsito competente no prazo de ${blank(data.transferDays)} dias, inclusive pelos canais digitais oficiais, conforme o Código de Trânsito Brasileiro. As despesas de transferência correm por conta do(a) COMPRADOR(A), salvo acordo escrito em contrário.`,
    },
    {
      title: "DOS DÉBITOS E MULTAS",
      body: debtsClause(data),
    },
    {
      title: "DOS DEFEITOS CONHECIDOS",
      body: defectsClause(data),
    },
    {
      title: "DA GARANTIA",
      body: warrantyClause(data),
    },
    {
      title: "DAS OBRIGAÇÕES",
      body: "O(A) VENDEDOR(A) entregará o veículo e a documentação necessária à transferência. O(A) COMPRADOR(A) pagará o preço no modo ajustado e providenciará a transferência de propriedade e a comunicação de venda junto ao órgão de trânsito, inclusive pelos canais digitais oficiais (ATPV-e / aplicativo do governo), no prazo legal.",
    },
    {
      title: "DA MULTA",
      body: penaltyClause(data),
    },
    {
      title: "DO FORO",
      body: `Fica eleito o foro da comarca de ${blank(data.cityForum || data.seller.city)}/${blank(data.stateForum || data.seller.state)} para dirimir dúvidas deste contrato, com renúncia de qualquer outro.`,
    },
  ];
}

export function contractTitle(data: ContractData) {
  const kind = kindLabel(data.vehicleKind).toUpperCase();
  return `CONTRATO DE COMPRA E VENDA DE ${kind}`;
}

export type ContractDraft = {
  title: string;
  subtitle: string;
  clauses: Clause[];
  closing: string;
  sellerName: string;
  buyerName: string;
  sellerSignedAt?: string;
  buyerSignedAt?: string;
};

export function draftFromData(data: ContractData): ContractDraft {
  const city = data.cityForum || data.seller.city || "________________";
  const date = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return {
    title: contractTitle(data),
    subtitle: "Código Civil, arts. 481 a 532, e Código de Trânsito Brasileiro",
    clauses: buildClauses(data),
    closing: `${city}, ${date}.`,
    sellerName: partyLabel(data.seller),
    buyerName: partyLabel(data.buyer),
  };
}

export function draftToPlainText(draft: ContractDraft) {
  return [
    draft.title,
    "",
    draft.subtitle,
    "",
    ...draft.clauses.flatMap((c, i) => [
      `CLÁUSULA ${i + 1}. ${c.title}`,
      c.body,
      "",
    ]),
    draft.closing,
    "",
    "________________________________",
    "VENDEDOR(A)",
    draft.sellerName,
    "",
    draft.sellerSignedAt
      ? `Assinado eletronicamente em ${draft.sellerSignedAt} (MP 2.200-2/2001)`
      : "",
    "",
    "________________________________",
    "COMPRADOR(A)",
    draft.buyerName,
    draft.buyerSignedAt
      ? `Assinado eletronicamente em ${draft.buyerSignedAt} (MP 2.200-2/2001)`
      : "",
  ].join("\n");
}

export function contractPlainText(data: ContractData) {
  return draftToPlainText(draftFromData(data));
}
