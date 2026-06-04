"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProductCard, type Product } from "./product-card";

type FoodWithCategory = Product & { category: { id: string; name: string } };
type Section = { id: string; name: string; foods: FoodWithCategory[] };

export function Menu() {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    axios.get("/api/foods").then((res) => {
      const foods: FoodWithCategory[] = res.data;
      const map = new Map<string, Section>();

      for (const food of foods) {
        const catId = food.category.id;
        if (!map.has(catId)) {
          map.set(catId, { id: catId, name: food.category.name, foods: [] });
        }
        map.get(catId)!.foods.push(food);
      }

      setSections(Array.from(map.values()));
    });
  }, []);

  return (
    <section className="bg-primary">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-14 px-6 py-14 sm:px-12 lg:px-[88px]">
        {sections.map((section) => (
          <div key={section.id} className="flex flex-col gap-6">
            <h2 className="text-[30px] font-semibold leading-9 tracking-tight text-white">
              {section.name}
            </h2>
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-3">
              {section.foods.map((food) => (
                <ProductCard key={food.id} product={food} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
