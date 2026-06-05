"use client";

import { useEffect, useState } from "react";
import { CategoryCard } from "./category-card";
import { ProductSection } from "./product-section";
import { CategoryCreateDialog } from "./category-create-dialog";
import { Prisma } from "@/app/generated/prisma/client";
import axios from "axios";
import { FoodCreateDialog } from "./food-create-dialog";

export type FoodCategoryWithFoods = Prisma.FoodCategoryGetPayload<{
  include: { foods: true };
}>;

export default function AdminProductsPage() {
  const [active, setActive] = useState("all");
  const [isCategoryCreating, setIsCategoryCreating] = useState(false);
  const [editCategory, setEditCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [categories, setCategories] = useState<FoodCategoryWithFoods[]>([]);
  const [creatingCategory, setCreatingCategory] = useState("");

  const visible =
    active === "all" ? categories : categories.filter((s) => s.id === active);

  useEffect(() => {
    axios.get("/api/foods/categories/foods").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const handleOnCreateProduct = (categoryId: string) => {
    setCreatingCategory(categoryId);
  };

  return (
    <div className="flex flex-col gap-5">
      <CategoryCard
        active={active}
        onSelect={setActive}
        onCreate={() => setIsCategoryCreating(true)}
        onEdit={(cat) => setEditCategory(cat)}
      />
      <div className="flex flex-col gap-5">
        {visible.map((section) => (
          <ProductSection
            onCreate={handleOnCreateProduct}
            key={section.id}
            category={section}
          />
        ))}
      </div>

      {/* Create dialog */}
      <CategoryCreateDialog
        open={isCategoryCreating}
        onClose={() => setIsCategoryCreating(false)}
      />

      {/* Edit/Delete dialog */}
      {editCategory && (
        <CategoryCreateDialog
          open={!!editCategory}
          onClose={() => setEditCategory(null)}
          category={editCategory}
        />
      )}

      <FoodCreateDialog
        categories={categories}
        foodCategoryId={creatingCategory}
        open={Boolean(creatingCategory)}
        onClose={() => setCreatingCategory("")}
      />
    </div>
  );
}
