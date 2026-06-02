export function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Red marquee strip */}
      <div className="bg-accent-soft overflow-hidden">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-9 gap-y-2 px-6 py-7 text-[24px] font-semibold leading-9 tracking-tight whitespace-nowrap sm:gap-x-9 sm:text-[30px] sm:px-12 lg:px-[98px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>Fresh fast delivered</span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-[1440px] px-6 pt-[60px] pb-8 sm:px-12 lg:px-[88px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-[120px]">
          <Logo />

          <div className="grid flex-1 grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-4 lg:gap-x-[56px]">
            <LinksColumn
              title="NOMNOM"
              links={["Home", "Contact us", "Delivery zone"]}
            />
            <LinksColumn
              title="MENU"
              links={["Appetizers", "Salads", "Pizzas", "Main dishes", "Desserts"]}
            />
            <LinksColumn
              title=""
              links={["Side dish", "Brunch", "Desserts", "Beverages", "Fish & Sea foods"]}
            />
            <FollowUs />
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/40 py-8 text-sm text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-12">
          <p>
            Copy right 2024 © Nomnom LLC
          </p>
          <a href="#" className="hover:text-white">Privacy policy</a>
          <a href="#" className="hover:text-white">Terms and conditions</a>
          <a href="#" className="hover:text-white">Cookie policy</a>
        </div>
      </div>
    </footer>
  );
}

function Logo() {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero/logo.svg" alt="" aria-hidden="true" className="h-9 w-auto" />
      <div className="flex flex-col items-center leading-none">
        <span className="text-[20px] font-semibold tracking-tight">
          Nom<span className="text-accent-soft">Nom</span>
        </span>
        <span className="mt-1 text-xs text-zinc-100/80">Swift delivery</span>
      </div>
    </div>
  );
}

function LinksColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-base text-muted">{title || " "}</p>
      {links.map((link) => (
        <a
          key={link}
          href="#"
          className="text-base leading-6 text-white transition hover:text-accent-soft"
        >
          {link}
        </a>
      ))}
    </div>
  );
}

function FollowUs() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-base text-muted">FOLLOW US</p>
      <div className="flex items-center gap-4">
        <a
          href="#"
          aria-label="Facebook"
          className="text-white transition hover:text-accent-soft"
        >
          <svg viewBox="0 0 28 28" fill="currentColor" className="size-7" aria-hidden="true">
            <path d="M14 1.5C7.1 1.5 1.5 7.1 1.5 14c0 6.24 4.57 11.41 10.55 12.35V17.62H8.87V14h3.18v-2.76c0-3.14 1.87-4.88 4.73-4.88 1.37 0 2.8.25 2.8.25v3.08h-1.58c-1.55 0-2.04.97-2.04 1.96V14h3.47l-.56 3.62h-2.92v8.73C21.93 25.41 26.5 20.24 26.5 14c0-6.9-5.6-12.5-12.5-12.5Z" />
          </svg>
        </a>
        <a
          href="#"
          aria-label="Instagram"
          className="text-white transition hover:text-accent-soft"
        >
          <svg viewBox="0 0 28 28" fill="none" className="size-7" aria-hidden="true">
            <rect x="3" y="3" width="22" height="22" rx="6" stroke="currentColor" strokeWidth="2" />
            <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="2" />
            <circle cx="20" cy="8" r="1.3" fill="currentColor" />
          </svg>
        </a>
      </div>
    </div>
  );
}
