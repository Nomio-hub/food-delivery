import { Plus } from "lucide-react";

export function AddDishCard({ category, onClick }: { category: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="flex h-60.25 flex-col items-center justify-center gap-6 rounded-[20px] border border-dashed border-red-500 px-4 py-2 transition hover:bg-red-50"
      onClick={onClick}
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-red-500 text-white">
        <Plus className="size-4" />
      </span>
      <span className="w-38.5 text-center text-sm font-medium leading-5 text-secondary-foreground">Add new Dish to {category}</span>
    </button>
  );
}
