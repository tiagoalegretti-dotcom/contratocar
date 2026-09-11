import { formatBRL, moneyExtenso } from "./money";
import type { ContractData, Party } from "./types";

function blank(value: string, fallback = "________________") {
  const v = value.trim();
  return v || fallback;
}

function qualify(p: Party, role: string) {
  if (p.type === "pj") {
    return `${role}: ${blank(p.name)}, pessoa jurídica inscrita no CNPJ nº ${blank(p.document)}, com sede em ${address(p)}, neste ato representada na forma de seu contrato social`;
  }
  return `${role}: ${blank(p.name)}, ${blank(p.nationality, "brasileiro(a)")}, ${blank(p.maritalStatus, "estado civil não informado")}, ${blank(p.occupation, "profissão não informada")}, inscrito(a) no CPF nº ${blank(p.document)} e RG nº ${blank(p.rg)}, residente e domiciliado(a) em ${address(p)}`;
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
  const map = {
    pix: "PIX",
    transferencia: "transferência bancária",
    dinheiro: "dinheiro",
    parcelado: "pagamento parcelado",
  };
  let text = map[data.paymentMethod];
  if (data.paymentMethod === "parcelado" && data.installments.trim()) {
    text += `, em ${data.installments} parcela(s)`;
  }
  return text;
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
      body: `O(A) VENDEDOR(A) vende ao(à) COMPRADOR(A) o ${kind} ${condition} ${vehicle}, ano de fabricação ${blank(data.yearManufacture)}, modelo ${blank(data.yearModel)}, cor ${blank(data.color)}, combustível ${blank(data.fuel)}, placa ${blank(data.plate)}, chassi ${blank(data.chassis)}, RENAVAM ${blank(data.renavam)}, com ${blank(data.km, "quilometragem não informada")} km rodados, no estado em que se encontra.`,
    },
    {
      title: "DO PREÇO E PAGAMENTO",
      body: `O preço certo e ajustado é de ${formatBRL(price)} (${moneyExtenso(price) || "valor por extenso"}), a ser pago por ${paymentLabel(data)}. O comprovante vale como recibo.`,
    },
    {
      title: "DA ENTREGA E POSSE",
      body: `A entrega do veículo ocorrerá em ${blank(data.deliveryPlace, "local a combinar")}, na data de ${blank(data.deliveryDate, "data a combinar")}. A posse transmite-se com a entrega, nos termos dos arts. 481 e seguintes do Código Civil.`,
    },
    {
      title: "DA TRANSFERÊNCIA NO DETRAN",
      body: `O(A) COMPRADOR(A) obriga-se a promover a transferência de propriedade junto ao órgão de trânsito competente no prazo de ${blank(data.transferDays)} dias, conforme o Código de Trânsito Brasileiro. As despesas de transferência correm por conta do(a) COMPRADOR(A), salvo acordo escrito em contrário.`,
    },
    {
      title: "DOS DÉBITOS E MULTAS",
      body: data.debts.trim()
        ? `O(A) VENDEDOR(A) declara os seguintes débitos/pendências conhecidos: ${data.debts.trim()}. Multas e tributos posteriores à entrega são de responsabilidade do(a) COMPRADOR(A).`
        : "O(A) VENDEDOR(A) declara que, até a data da entrega, o veículo está livre de débitos de IPVA, licenciamento e multas de seu conhecimento, ou que tais valores serão quitados por ele(a) até a transferência. Multas lavradas após a entrega são de responsabilidade do(a) COMPRADOR(A).",
    },
    {
      title: "DOS DEFEITOS CONHECIDOS",
      body: data.knownDefects.trim()
        ? `O(A) VENDEDOR(A) declara os seguintes defeitos/vícios conhecidos: ${data.knownDefects.trim()}. O(A) COMPRADOR(A) declara ter vistoriado o veículo e aceitá-lo no estado descrito.`
        : "O(A) VENDEDOR(A) declara não ter conhecimento de vícios ocultos além do desgaste natural do uso. O(A) COMPRADOR(A) declara ter vistoriado o veículo. Aplicam-se, no que couber, os arts. 441 e seguintes do Código Civil.",
    },
    {
      title: "DAS OBRIGAÇÕES",
      body: "O(A) VENDEDOR(A) entregará o veículo e a documentação necessária à transferência. O(A) COMPRADOR(A) pagará o preço no modo ajustado e providenciará o ATPV-e/comunicação de venda e o registro no DETRAN.",
    },
    {
      title: "DA MULTA",
      body: "O descumprimento de qualquer obrigação sujeita a parte inadimplente a multa de 10% (dez por cento) sobre o preço, sem prejuízo de perdas e danos e da execução específica.",
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
    sellerName: data.seller.name,
    buyerName: data.buyer.name,
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
