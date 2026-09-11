import { mpBrickReady, mpPublicKey } from "@/lib/mercadopago";
import { PRICE_BRL } from "@/lib/types";

export async function GET() {
  if (!mpBrickReady()) {
    return Response.json(
      { error: "Mercado Pago não configurado.", publicKey: "", amount: PRICE_BRL },
      { status: 503 },
    );
  }
  return Response.json({ publicKey: mpPublicKey(), amount: PRICE_BRL });
}
