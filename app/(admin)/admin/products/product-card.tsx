import Image from "next/image";
import { Pencil } from "lucide-react";
import { Food } from "@/app/generated/prisma/client";

export function ProductCard({ food }: { food: Food }) {
  return (
    <article className="flex h-60.25 flex-col gap-5 rounded-[20px] border border-border bg-background p-4">
      <div className="relative flex-1 overflow-hidden rounded-xl">
        <Image src={food.image} alt={food.name} fill sizes="(min-width: 1280px) 270px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        <button
          type="button"
          aria-label={`Edit ${food.name}`}
          className="absolute right-5 bottom-5 flex size-11 items-center justify-center rounded-full bg-background text-red-500 shadow-sm transition hover:scale-105"
        >
          <Pencil className="size-4" />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <h4 className="flex-1 text-sm font-medium leading-5 text-red-500">{food.name}</h4>
          <span className="text-xs leading-4 text-foreground">{food.price}</span>
        </div>
        <p className="text-xs leading-4 text-foreground">{food.ingredients}</p>
      </div>
    </article>
  );
}
