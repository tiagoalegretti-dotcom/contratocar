import type { EsignChoice } from "@/lib/types";

export function EsignChoiceCards({
  value,
  onChange,
}: {
  value: EsignChoice;
  onChange: (v: EsignChoice) => void;
}) {
  const options: { id: EsignChoice; title: string; text: string }[] = [
    {
      id: "yes",
      title: "Sim, assinar pelo site",
      text: "Comprador e vendedor confirmam no ContratoCar, sem custo extra.",
    },
    {
      id: "no",
      title: "Não, vou assinar no papel",
      text: "O arquivo sai com espaço para assinatura manuscrita.",
    },
  ];
  return (
    <fieldset className="text-left">
      <legend className="text-sm font-semibold text-zinc-900">
        Quer usar a assinatura eletrônica do site?
      </legend>
      <p className="mt-1 text-sm text-zinc-500">
        Sem custo adicional. Você escolhe agora, antes de pagar.
      </p>
      <div className="mt-3 grid gap-2">
        {options.map((opt) => {
          const on = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex min-h-14 items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-left ${
                on ? "border-violet-600" : "border-zinc-200"
              }`}
            >
              <span>
                <span className="block text-sm font-medium">{opt.title}</span>
                <span className="mt-0.5 block text-sm text-zinc-500">{opt.text}</span>
              </span>
              <span
                className={`mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                  on ? "border-violet-600" : "border-zinc-300"
                }`}
              >
                {on && <span className="h-2 w-2 rounded-full bg-violet-600" />}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
