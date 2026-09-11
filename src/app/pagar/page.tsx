"use client";

import { PayClient } from "@/components/pay-client";
import { useAuth } from "@/components/auth-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function PagarInner() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get("status");

  useEffect(() => {
    if (!loading && !user) router.replace("/entrar");
  }, [loading, user, router]);

  if (loading || !user) {
    return <p className="p-8 text-center text-sm text-zinc-600">Carregando...</p>;
  }

  return (
    <PayClient
      name={user.displayName ?? "você"}
      email={user.email ?? ""}
      status={status}
    />
  );
}

export default function PagarPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-sm">Carregando...</p>}>
      <PagarInner />
    </Suspense>
  );
}
