import { getPayment, isApprovedPayment, mpReady } from "@/lib/mercadopago";

export async function GET(req: Request) {
  if (!mpReady()) {
    return Response.json({ error: "Mercado Pago não configurado." }, { status: 503 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("payment_id") || searchParams.get("collection_id");
  if (!id) {
    return Response.json({ error: "Pagamento não informado." }, { status: 400 });
  }
  try {
    const payment = await getPayment(id);
    const approved = isApprovedPayment({
      status: payment.status,
      transaction_amount: payment.transaction_amount,
    });
    return Response.json({
      approved,
      status: payment.status,
      paymentId: String(payment.id ?? id),
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Não foi possível conferir o pagamento." }, { status: 502 });
  }
}
