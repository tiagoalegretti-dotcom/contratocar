"use client";

import { PRICE_BRL } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

type PixInfo = { qrCode: string; qrBase64: string };

export function MpCheckout({
  amount,
  email,
  authHeader,
  blocked,
  onBlocked,
}: {
  amount: number;
  email: string;
  authHeader: () => Promise<string | null>;
  blocked: boolean;
  onBlocked: () => void;
}) {
  const [Payment, setPayment] = useState<
    null | typeof import("@mercadopago/sdk-react").Payment
  >(null);
  const [error, setError] = useState("");
  const [pix, setPix] = useState<PixInfo | null>(null);
  const [paymentId, setPaymentId] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/mp-config");
      const json = (await res.json()) as { publicKey?: string; error?: string };
      if (!res.ok || !json.publicKey) {
        if (!cancelled) {
          setError(
            json.error ||
              "Falta a chave pública do Mercado Pago (MP_PUBLIC_KEY na Vercel).",
          );
        }
        return;
      }
      const sdk = await import("@mercadopago/sdk-react");
      sdk.initMercadoPago(json.publicKey, { locale: "pt-BR" });
      if (!cancelled) setPayment(() => sdk.Payment);
    })().catch(() => {
      if (!cancelled) setError("Não deu para carregar o pagamento.");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!paymentId || !pix) return;
    let stop = false;
    const tick = async () => {
      const res = await fetch(
        `/api/payment?payment_id=${encodeURIComponent(paymentId)}`,
      );
      const json = (await res.json()) as { approved?: boolean };
      if (!stop && json.approved) {
        window.location.href = `/pago?payment_id=${encodeURIComponent(paymentId)}`;
      }
    };
    const id = window.setInterval(tick, 3000);
    void tick();
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, [paymentId, pix]);

  const onSubmit = useCallback(
    async ({ formData }: { formData: Record<string, unknown> }) => {
      if (blocked) {
        onBlocked();
        throw new Error("blocked");
      }
      const token = await authHeader();
      if (!token) throw new Error("login");
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const json = (await res.json()) as {
        id?: string;
        status?: string;
        pix?: PixInfo | null;
        error?: string;
      };
      if (!res.ok) throw new Error(json.error || "Falha no pagamento");
      if (json.status === "approved" && json.id) {
        window.location.href = `/pago?payment_id=${encodeURIComponent(json.id)}`;
        return;
      }
      if (json.pix?.qrCode && json.id) {
        setPaymentId(json.id);
        setPix(json.pix);
        return;
      }
      if (json.status === "in_process" || json.status === "pending") {
        throw new Error("Pagamento em análise. Tente de novo em instantes.");
      }
      throw new Error("Pagamento recusado. Confira os dados do cartão.");
    },
    [authHeader, blocked, onBlocked],
  );

  if (error) {
    return <p className="text-sm text-amber-700">{error}</p>;
  }

  if (pix) {
    return (
      <div className="rounded-2xl border border-zinc-200 p-4">
        <h2 className="text-lg font-semibold">Pague com PIX</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Escaneie o QR Code ou copie o código. Esta página confirma sozinha.
        </p>
        {pix.qrBase64 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt="QR Code PIX"
            className="mx-auto mt-4 h-52 w-52"
            src={`data:image/png;base64,${pix.qrBase64}`}
          />
        )}
        <textarea
          readOnly
          className="mt-4 w-full rounded-xl border border-zinc-200 p-3 text-xs"
          rows={4}
          value={pix.qrCode}
        />
        <button
          type="button"
          className="mt-3 w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-medium text-white"
          onClick={() => navigator.clipboard.writeText(pix.qrCode)}
        >
          Copiar código PIX
        </button>
      </div>
    );
  }

  if (!Payment) {
    return <p className="text-sm text-zinc-500">Carregando o pagamento...</p>;
  }

  return (
    <Payment
      initialization={{ amount, payer: { email } }}
      customization={{
        paymentMethods: {
          creditCard: "all",
          debitCard: "all",
          prepaidCard: "all",
          bankTransfer: "all",
          maxInstallments: 12,
          minInstallments: 1,
        },
      }}
      onSubmit={onSubmit as never}
      onReady={() => undefined}
      onError={() => undefined}
    />
  );
}

export const MP_AMOUNT = PRICE_BRL;
