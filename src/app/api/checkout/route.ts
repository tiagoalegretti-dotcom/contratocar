import { auth } from "@/auth";
import { createPaidToken } from "@/lib/payments";
import { PRICE_BRL } from "@/lib/types";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Faça login para continuar." }, { status: 401 });
  }
  const token = createPaidToken();
  return Response.json({ token, amount: PRICE_BRL, simulated: true });
}
