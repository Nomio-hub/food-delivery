import Image from "next/image";

export function Hero() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-cream">
      <BackgroundTagline />

      <div className="relative mx-auto h-[480px] max-w-[1440px] sm:h-[540px] lg:h-[570px]">
        {/* Layered dark/orange pill background */}
        <div className="pointer-events-none absolute inset-x-[-100px] top-[28%] h-[62%] rounded-[9999px] bg-accent" />
        <div className="pointer-events-none absolute inset-x-[-160px] top-[24%] h-[62%] rounded-[9999px] bg-primary" />

        {/* Glow ellipse behind the dish */}
        <div className="pointer-events-none absolute left-1/2 top-[28%] hidden h-[420px] w-[640px] -translate-x-[55%] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(253,84,63,0.55),_transparent_65%)] blur-2xl sm:block" />

        {/* TODAY'S */}
        <h1 className="absolute left-6 top-[28%] font-display text-[80px] uppercase leading-none text-white sm:left-12 sm:text-[120px] lg:left-[88px] lg:text-[158px]">
          Today&rsquo;s
        </h1>

        {/* OFFER! */}
        <p className="absolute right-6 top-[55%] font-display text-[80px] uppercase leading-none text-white sm:right-12 sm:text-[120px] lg:right-[88px] lg:text-[158px]">
          offer!
        </p>

        {/* Steak Society stacked tags */}
        <div className="absolute left-6 top-[64%] sm:left-12 lg:left-[120px]">
          <div className="relative">
            <span className="block translate-x-[18px] translate-y-[8px] rounded-full bg-cream px-5 py-2.5 font-display text-[24px] uppercase tracking-wide text-primary sm:text-[32px] lg:text-[40px]">
              Steak Society
            </span>
            <span className="absolute left-0 top-0 block rounded-full bg-accent px-5 py-2.5 font-display text-[24px] uppercase tracking-wide text-white sm:text-[32px] lg:text-[40px]">
              Steak Society
            </span>
          </div>
        </div>

        {/* Main dish */}
        <div className="pointer-events-none absolute left-1/2 top-[6%] h-[420px] w-[420px] -translate-x-[52%] sm:h-[520px] sm:w-[520px] lg:h-[620px] lg:w-[620px]">
          <Image
            src="/hero/dish.png"
            alt="Today's featured dish"
            fill
            priority
            sizes="(min-width: 1024px) 620px, (min-width: 640px) 520px, 420px"
            className="object-contain"
          />
        </div>

        {/* Lime tart accent (top right) */}
        <div className="pointer-events-none absolute right-[18%] top-[14%] hidden h-[140px] w-[140px] rotate-[2deg] sm:block lg:right-[24%] lg:top-[10%] lg:h-[190px] lg:w-[190px]">
          <Image
            src="/hero/lime-tart.png"
            alt=""
            fill
            sizes="190px"
            className="object-contain"
          />
        </div>

        {/* Plus icon between dish and tart */}
        <PlusBadge className="absolute right-[33%] top-[32%] hidden text-accent sm:block lg:right-[36%]" />
      </div>
    </section>
  );
}

function BackgroundTagline() {
  const lines = Array.from({ length: 7 });
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="-rotate-6 select-none opacity-20">
        <div className="flex flex-col gap-2">
          {lines.map((_, i) => (
            <TaglineRow key={i} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TaglineRow({ flip }: { flip: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-5 whitespace-nowrap font-display text-[90px] uppercase leading-none sm:text-[110px] lg:text-[130px]">
      <Word color={flip ? "accent" : "muted"}>Say</Word>
      <Word color="muted">Cheese</Word>
      <Dot />
      <Word color="accent">Fresh</Word>
      <Word color={flip ? "accent" : "muted"}>Fast</Word>
      <Word color="accent">Delivered!</Word>
      <Dot />
      <Word color={flip ? "muted" : "accent"}>Say</Word>
    </div>
  );
}

function Word({
  color,
  children,
}: {
  color: "muted" | "accent";
  children: React.ReactNode;
}) {
  return (
    <span className={color === "accent" ? "text-accent" : "text-muted"}>
      {children}
    </span>
  );
}

function Dot() {
  return <span className="text-accent">·</span>;
}

function PlusBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 70 70"
      className={`${className ?? ""} h-[56px] w-[56px] lg:h-[70px] lg:w-[70px]`}
      aria-hidden="true"
    >
      <path
        d="M35 8v54M8 35h54"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
