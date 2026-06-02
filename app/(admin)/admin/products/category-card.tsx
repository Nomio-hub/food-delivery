"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Prisma } from "@/app/generated/prisma/client";
import axios from "axios";

type Props = {
  active: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
};

type CategoryWithCount = Prisma.FoodCategoryGetPayload<{
  include: {
    _count: {
      select: {
        foods: true;
      };
    };
  };
}>;

export function CategoryCard({ active, onSelect, onCreate }: Props) {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);

  useEffect(() => {
    axios.get("/api/foods/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const allCount = categories.reduce((prev, next) => {
    return prev + next._count.foods;
  }, 0);

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-background p-6">
      <h2 className="text-xl font-semibold leading-7 tracking-tight text-foreground">Dishes category</h2>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onSelect("all")}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-secondary-foreground transition",
            active === "all" ? "border-red-500" : "border-border hover:border-zinc-300"
          )}
        >
          <span>All dishes</span>
          <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold leading-4 text-primary-foreground">
            {allCount}
          </span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-secondary-foreground transition",
              active === cat.id ? "border-red-500" : "border-border hover:border-zinc-300"
            )}
          >
            <span>{cat.name}</span>
            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold leading-4 text-primary-foreground">
              {cat._count.foods}
            </span>
          </button>
        ))}
        <button
          onClick={onCreate}
          type="button"
          aria-label="Add category"
          className="inline-flex size-9 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </section>
  );
}
