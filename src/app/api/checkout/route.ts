import { createSitePayment, mpBrickReady } from "@/lib/mercadopago";
import { userFromRequest } from "@/lib/verify-user";

export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user) {
    return Response.json({ error: "Faça login para continuar." }, { status: 401 });
  }
  if (!mpBrickReady()) {
    return Response.json(
      {
        error:
          "Falta configurar o Mercado Pago. Coloque MP_ACCESS_TOKEN e MP_PUBLIC_KEY na Vercel.",
      },
      { status: 503 },
    );
  }
  let formData: Record<string, unknown> = {};
  try {
    formData = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Dados de pagamento inválidos." }, { status: 400 });
  }
  try {
    const result = await createSitePayment({
      formData,
      email: user.email,
      name: user.name,
      reference: `${user.uid}:${crypto.randomUUID()}`,
    });
    return Response.json(result);
  } catch (err) {
    console.error(err);
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : "Não deu para criar o pagamento no Mercado Pago.";
    return Response.json({ error: message }, { status: 502 });
  }
}
