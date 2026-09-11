export const inputClass =
  "min-h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 text-base outline-none ring-violet-600/20 placeholder:text-zinc-400 focus:border-violet-500 focus:ring-4";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-zinc-700">{label}</span>
      {children}
    </label>
  );
}
