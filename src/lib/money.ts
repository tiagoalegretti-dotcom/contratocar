const UNITS = [
  "zero",
  "um",
  "dois",
  "três",
  "quatro",
  "cinco",
  "seis",
  "sete",
  "oito",
  "nove",
  "dez",
  "onze",
  "doze",
  "treze",
  "quatorze",
  "quinze",
  "dezesseis",
  "dezessete",
  "dezoito",
  "dezenove",
];

const TENS = [
  "",
  "",
  "vinte",
  "trinta",
  "quarenta",
  "cinquenta",
  "sessenta",
  "setenta",
  "oitenta",
  "noventa",
];

const HUNDREDS = [
  "",
  "cento",
  "duzentos",
  "trezentos",
  "quatrocentos",
  "quinhentos",
  "seiscentos",
  "setecentos",
  "oitocentos",
  "novecentos",
];

function underThousand(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "cem";
  if (n < 20) return UNITS[n];
  if (n < 100) {
    const d = Math.floor(n / 10);
    const u = n % 10;
    return u ? `${TENS[d]} e ${UNITS[u]}` : TENS[d];
  }
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return rest ? `${HUNDREDS[h]} e ${underThousand(rest)}` : HUNDREDS[h];
}

export function numberToWordsPt(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "";
  const int = Math.floor(n);
  if (int === 0) return "zero";
  if (int >= 1_000_000_000) return String(int);

  const millions = Math.floor(int / 1_000_000);
  const thousands = Math.floor((int % 1_000_000) / 1000);
  const rest = int % 1000;
  const parts: string[] = [];

  if (millions) {
    parts.push(millions === 1 ? "um milhão" : `${underThousand(millions)} milhões`);
  }
  if (thousands) {
    parts.push(thousands === 1 ? "mil" : `${underThousand(thousands)} mil`);
  }
  if (rest) parts.push(underThousand(rest));

  return parts.join(" e ");
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

export function moneyExtenso(value: number): string {
  const int = Math.floor(value || 0);
  const cents = Math.round(((value || 0) - int) * 100);
  const reais = int === 1 ? "real" : "reais";
  let text = `${numberToWordsPt(int)} ${reais}`;
  if (cents) {
    const c = cents === 1 ? "centavo" : "centavos";
    text += ` e ${numberToWordsPt(cents)} ${c}`;
  }
  return text;
}
