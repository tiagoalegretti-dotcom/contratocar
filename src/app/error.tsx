"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-xl font-semibold">Algo falhou nesta tela</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Tente de novo. Se você acabou de entrar com o Google, abra Minha conta.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white"
        >
          Tentar de novo
        </button>
        <a href="/conta" className="rounded-full px-5 py-2 text-sm text-violet-700">
          Minha conta
        </a>
      </div>
    </div>
  );
}
