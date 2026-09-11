import { auth } from "@/auth";
import { PayClient } from "@/components/pay-client";
import { redirect } from "next/navigation";

export default async function PagarPage() {
  const session = await auth();
  if (!session?.user) redirect("/entrar");

  return (
    <PayClient
      name={session.user.name ?? "você"}
      email={session.user.email ?? ""}
    />
  );
}
