export function Header() {
  return (
    <header className="bg-primary w-full">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3 sm:px-12 lg:px-[88px]">
        <Logo />

        <div className="flex items-center gap-3">
          <LocationPill />

          <button
            type="button"
            aria-label="Cart"
            className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary transition hover:bg-zinc-200"
          >
            <CartIcon className="size-4" />
          </button>

          <button
            type="button"
            aria-label="Account"
            className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-white transition hover:brightness-110"
          >
            <UserIcon className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero/logo.svg" alt="" aria-hidden="true" className="h-9 w-auto" />
      <div className="flex flex-col leading-none">
        <span className="font-semibold text-[20px] tracking-tight text-white">
          Nom<span className="text-accent-soft">Nom</span>
        </span>
        <span className="text-xs text-zinc-100/80">Swift delivery</span>
      </div>
    </div>
  );
}

function LocationPill() {
  return (
    <button
      type="button"
      className="hidden items-center gap-1 rounded-full bg-white px-3 py-2 text-xs transition hover:bg-zinc-50 sm:flex"
    >
      <PinIcon className="size-5 text-accent-soft" />
      <span className="font-medium text-accent-soft">Delivery address:</span>
      <span className="text-muted">Add Location</span>
      <ChevronDownIcon className="size-5 text-muted" />
    </button>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 18s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="m6 8 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M1.33 1.33h1.78l1.65 8.04a1.33 1.33 0 0 0 1.31 1.07h6.21a1.33 1.33 0 0 0 1.3-1.02l1.08-4.48H4.05"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.33" cy="13.67" r="0.83" fill="currentColor" />
      <circle cx="12.33" cy="13.67" r="0.83" fill="currentColor" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M13.33 14v-1.33A2.67 2.67 0 0 0 10.67 10H5.33a2.67 2.67 0 0 0-2.66 2.67V14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="4.67" r="2.67" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
