import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { PRICE_BRL } from "./types";

export function mpToken() {
  return process.env.MP_ACCESS_TOKEN?.trim() ?? "";
}

export function mpPublicKey() {
  return (
    process.env.MP_PUBLIC_KEY?.trim() ||
    process.env.NEXT_PUBLIC_MP_PUBLIC_KEY?.trim() ||
    ""
  );
}

export function mpReady() {
  return Boolean(mpToken());
}

export function mpBrickReady() {
  return Boolean(mpToken() && mpPublicKey());
}

export function mpIsTest() {
  return mpToken().startsWith("TEST-");
}

export function checkoutUrl(preference: {
  init_point?: string | null;
  sandbox_init_point?: string | null;
}) {
  if (mpIsTest()) {
    return preference.sandbox_init_point || preference.init_point || "";
  }
  return preference.init_point || preference.sandbox_init_point || "";
}

function client() {
  return new MercadoPagoConfig({ accessToken: mpToken() });
}

export function appUrl() {
  const fromEnv =
    process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function createCheckoutPreference(params: {
  email: string;
  name: string;
  reference: string;
}) {
  const preference = new Preference(client());
  const url = appUrl();
  const body = {
    items: [
      {
        id: "contratocar",
        title: "ContratoCar",
        description: "Contrato de compra e venda de veículo",
        quantity: 1,
        currency_id: "BRL" as const,
        unit_price: PRICE_BRL,
      },
    ],
    payer: {
      email: params.email || undefined,
      name: params.name || undefined,
    },
    payment_methods: {
      excluded_payment_types: [{ id: "ticket" }, { id: "atm" }],
      installments: 12,
    },
    back_urls: {
      success: `${url}/pago`,
      failure: `${url}/pagar?status=falhou`,
      pending: `${url}/pagar?status=pendente`,
    },
    auto_return: "approved" as const,
    statement_descriptor: "CONTRATOCAR",
    external_reference: params.reference,
    metadata: {
      product: "contratocar",
    },
  };
  const created = await preference.create({
    body: url.startsWith("https://")
      ? { ...body, notification_url: `${url}/api/mercadopago/webhook` }
      : body,
  });
  return created;
}

export async function createSitePayment(params: {
  formData: Record<string, unknown>;
  email: string;
  name: string;
  reference: string;
}) {
  const payment = new Payment(client());
  const url = appUrl();
  const incoming = params.formData ?? {};
  const payerIn =
    incoming.payer && typeof incoming.payer === "object"
      ? (incoming.payer as Record<string, unknown>)
      : {};
  const body: Record<string, unknown> = {
    ...incoming,
    transaction_amount: PRICE_BRL,
    description: "ContratoCar",
    statement_descriptor: "CONTRATOCAR",
    external_reference: params.reference,
    metadata: { product: "contratocar", uid: params.reference.split(":")[0] },
    payer: {
      ...payerIn,
      email: (typeof payerIn.email === "string" && payerIn.email) || params.email,
      first_name:
        (typeof payerIn.first_name === "string" && payerIn.first_name) ||
        params.name,
    },
  };
  if (url.startsWith("https://")) {
    body.notification_url = `${url}/api/mercadopago/webhook`;
  }
  const created = await payment.create({
    body: body as never,
    requestOptions: { idempotencyKey: crypto.randomUUID() },
  });
  const pix = created.point_of_interaction?.transaction_data;
  return {
    id: String(created.id ?? ""),
    status: created.status ?? "",
    statusDetail: created.status_detail ?? "",
    pix:
      pix?.qr_code
        ? {
            qrCode: pix.qr_code,
            qrBase64: pix.qr_code_base64 ?? "",
            ticketUrl: pix.ticket_url ?? "",
          }
        : null,
  };
}

export async function getPayment(id: string) {
  const payment = new Payment(client());
  return payment.get({ id });
}

export function isApprovedPayment(data: {
  status?: string | null;
  transaction_amount?: number | null;
}) {
  if (data.status !== "approved") return false;
  const amount = Number(data.transaction_amount ?? 0);
  return amount + 0.001 >= PRICE_BRL;
}
