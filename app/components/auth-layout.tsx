import Image from "next/image";
import Link from "next/link";

export function AuthLayout({
  children,
  backHref = "/",
}: {
  children: React.ReactNode;
  backHref?: string;
}) {
  return (
    <main className="min-h-screen w-full bg-background">
      <div className="mx-auto flex min-h-screen max-w-360 flex-col gap-8 px-6 py-10 lg:flex-row lg:items-center lg:gap-12 lg:px-25 lg:py-25">
        {/* Form column */}
        <div className="flex w-full max-w-104 flex-col gap-6 lg:flex-1">
          <Link
            href={backHref}
            aria-label="Back"
            className="flex size-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-foreground transition hover:bg-zinc-50"
          >
            <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
              <path
                d="m10 4-4 4 4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {children}
        </div>

        {/* Image column */}
        <div className="relative hidden h-150 flex-1 overflow-hidden rounded-2xl lg:block lg:h-[calc(100vh-200px)] lg:max-h-226">
          <Image
            src="/auth/rider.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </main>
  );
}

export function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-[24px] font-semibold leading-8 tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-base leading-6 text-muted">{subtitle}</p>
    </header>
  );
}

export function AuthFooter({
  prompt,
  linkText,
  linkHref,
}: {
  prompt: string;
  linkText: string;
  linkHref: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 text-base">
      <span className="text-muted">{prompt}</span>
      <Link href={linkHref} className="text-[#2563eb] hover:underline">
        {linkText}
      </Link>
    </div>
  );
}
