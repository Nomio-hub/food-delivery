"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin/products", label: "Food menu", Icon: LayoutGrid },
  { href: "/admin/orders", label: "Orders", Icon: Truck },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex w-51.25 flex-col gap-10 bg-background px-5 py-9">
      <Link href="/admin" className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/logo.svg" alt="" aria-hidden="true" className="size-10" />
        <div className="flex flex-col leading-none">
          <span className="text-[18px] font-semibold leading-7 tracking-tight text-foreground">
            NomNom
          </span>
          <span className="text-xs leading-4 text-muted-foreground">
            Swift delivery
          </span>
        </div>
      </Link>

      <nav className="flex flex-col gap-6">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex h-10 items-center gap-2.5 rounded-full px-6 text-sm font-medium transition",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <Icon className="size-5.5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
