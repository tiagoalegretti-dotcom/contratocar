export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      <rect width="64" height="64" rx="16" fill="#6D28D9" />
      <rect x="18" y="12" width="28" height="34" rx="3" fill="#fff" />
      <rect x="23" y="18" width="18" height="2.2" rx="1.1" fill="#C4B5FD" />
      <rect x="23" y="23" width="14" height="2.2" rx="1.1" fill="#C4B5FD" />
      <rect x="23" y="28" width="16" height="2.2" rx="1.1" fill="#C4B5FD" />
      <path
        fill="#fff"
        d="M14 42.5h8.2l2.4-5.2c.4-.8 1.2-1.3 2.1-1.3h13c.9 0 1.7.5 2.1 1.3l2.2 5.2H50c1.1 0 2 .9 2 2v5.2c0 1.1-.9 2-2 2h-3.2a6.3 6.3 0 0 1-12.2 0H27.4a6.3 6.3 0 0 1-12.2 0H14c-1.1 0-2-.9-2-2v-5.2c0-1.1.9-2 2-2Zm7.3 9.2a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6Zm21.2 0a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6Z"
      />
    </svg>
  );
}

export function BrandLockup() {
  return (
    <span className="flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-950 sm:text-base">
      <LogoMark className="h-7 w-7 sm:h-8 sm:w-8" />
      ContratoCar
    </span>
  );
}
