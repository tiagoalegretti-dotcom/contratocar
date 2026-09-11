"use client";

import { afterLoginPath, useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.94 1 10.42 1 12s.43 3.06 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function EntrarPage() {
  const { user, loading, signInGoogle } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace(afterLoginPath());
  }, [loading, user, router]);

  async function onGoogle() {
    setError("");
    setBusy(true);
    try {
      await signInGoogle();
      router.replace(afterLoginPath());
    } catch {
      setError("Não deu para entrar com o Google. Tente de novo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Entre com o Google
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        Depois do login você vê o valor e paga com PIX ou cartão no Mercado Pago.
      </p>

      {loading ? (
        <p className="mt-8 text-sm text-zinc-500">Carregando...</p>
      ) : (
        <button
          type="button"
          onClick={onGoogle}
          disabled={busy || loading}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50 disabled:opacity-50"
        >
          <GoogleMark />
          {busy ? "Abrindo o Google..." : "Continuar com Google"}
        </button>
      )}
      {error && <p className="mt-4 text-sm text-amber-700">{error}</p>}
    </div>
  );
}
