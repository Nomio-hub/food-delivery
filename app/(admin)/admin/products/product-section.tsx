import { AddDishCard } from "./add-dish-card";
import { FoodCategoryWithFoods } from "./page";
import { ProductCard } from "./product-card";

export function ProductSection({ category, onCreate }: { category: FoodCategoryWithFoods; onCreate: (catId: string) => void }) {
  return (
    <section className="flex flex-col gap-4 rounded-xl bg-background p-5">
      <h3 className="flex items-center gap-2 text-xl font-semibold leading-7 tracking-tight text-foreground">
        <span>{category.name}</span>
        <span>({category.foods.length})</span>
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AddDishCard
          category={category.name}
          onClick={() => {
            onCreate(category.id);
          }}
        />
        {category.foods.map((food, i) => (
          <ProductCard key={`${category.id}-${i}`} food={food} />
        ))}
      </div>
    </section>
  );
}
