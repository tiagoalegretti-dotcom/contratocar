import { signIn } from "@/auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function EntrarPage() {
  const session = await auth();
  if (session?.user) redirect("/pagar");

  const googleReady = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Entre com o Google
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        Depois do login você vê o valor e pode pagar para baixar o contrato.
      </p>

      {googleReady ? (
        <form
          className="mt-8 w-full"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/pagar" });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50"
          >
            <GoogleMark />
            Continuar com Google
          </button>
        </form>
      ) : (
        <p className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-900">
          Falta configurar o login Google. No Google Cloud, crie um cliente OAuth
          e coloque <code className="font-mono">AUTH_GOOGLE_ID</code> e{" "}
          <code className="font-mono">AUTH_GOOGLE_SECRET</code> no arquivo{" "}
          <code className="font-mono">.env.local</code>. URL de redirecionamento:{" "}
          <code className="font-mono text-xs">
            http://localhost:3000/api/auth/callback/google
          </code>
        </p>
      )}
    </div>
  );
}

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
