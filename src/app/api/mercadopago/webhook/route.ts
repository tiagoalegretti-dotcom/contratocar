import { getPayment } from "@/lib/mercadopago";

export async function POST(req: Request) {
  let body: { type?: string; topic?: string; data?: { id?: string }; action?: string } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    /* query only */
  }
  const url = new URL(req.url);
  const id =
    body.data?.id ||
    url.searchParams.get("data.id") ||
    url.searchParams.get("id");
  const topic = body.type || body.topic || url.searchParams.get("topic") || body.action;
  if (id && (topic === "payment" || topic === "topic_payment" || !topic)) {
    try {
      await getPayment(id);
    } catch (err) {
      console.error(err);
    }
  }
  return new Response(null, { status: 200 });
}

export async function GET(req: Request) {
  return POST(req);
}
