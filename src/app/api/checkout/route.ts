import { createCheckoutPreference, mpReady } from "@/lib/mercadopago";
import { userFromRequest } from "@/lib/verify-user";

export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user) {
    return Response.json({ error: "Faça login para continuar." }, { status: 401 });
  }
  if (!mpReady()) {
    return Response.json(
      {
        error:
          "Falta o token do Mercado Pago. Coloque MP_ACCESS_TOKEN no .env.local e na Vercel.",
      },
      { status: 503 },
    );
  }
  try {
    const preference = await createCheckoutPreference({
      email: user.email,
      name: user.name,
      reference: `${user.uid}:${crypto.randomUUID()}`,
    });
    const url = preference.init_point || preference.sandbox_init_point;
    if (!url) {
      return Response.json({ error: "O Mercado Pago não devolveu o link." }, { status: 502 });
    }
    return Response.json({ url, preferenceId: preference.id });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Não deu para criar o pagamento no Mercado Pago." },
      { status: 502 },
    );
  }
}
