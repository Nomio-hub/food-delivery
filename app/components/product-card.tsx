"use client";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

export type Product = {
  id: string;
  name: string;
  ingredients: string;
  image: string;
  price: number;
};

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const handleAddToCart = async () => {
    for (let i = 0; i < qty; i++) {
      await addToCart(product.id);
    }
    setOpen(false);
    setQty(1);
  };

  return (
    <>
      {/* Card */}
      <article
        className="flex flex-col gap-5 rounded-[20px] bg-white p-4 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
          <Image
            src={product.image || "/p1.png"}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className="absolute right-5 bottom-5 flex size-11 items-center justify-center rounded-full bg-white text-accent-soft shadow-sm transition hover:scale-105"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="size-4"
              aria-hidden="true"
            >
              <path
                d="M8 3v10M3 8h10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <h3 className="flex-1 text-[24px] font-semibold leading-8 tracking-tight text-accent-soft">
              {product.name}
            </h3>
            <span className="text-[18px] font-semibold leading-7 text-foreground">
              {product.price}₮
            </span>
          </div>
          <p className="text-sm leading-5 text-foreground">
            {product.ingredients}
          </p>
        </div>
      </article>

      {/* Modal */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => {
              setOpen(false);
              setQty(1);
            }}
          />

          {/* Dialog */}
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Close */}
            <button
              onClick={() => {
                setOpen(false);
                setQty(1);
              }}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/80 text-zinc-500 hover:bg-zinc-100"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="size-4"
                aria-hidden="true"
              >
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Image */}
            <div className="relative h-56 w-full">
              <Image
                src={product.image || "/p1.png"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-accent-soft">
                {product.name}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {product.ingredients}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600">
                  Total price
                </span>
                <span className="text-xl font-bold text-zinc-800">
                  ${(product.price * qty).toFixed(2)}
                </span>
              </div>

              {/* Quantity */}
              <div className="mt-3 flex items-center justify-end gap-4">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex size-9 items-center justify-center rounded-full border border-zinc-200 text-xl text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
                  disabled={qty <= 1}
                >
                  −
                </button>
                <span className="w-6 text-center text-lg font-semibold">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex size-9 items-center justify-center rounded-full border border-zinc-200 text-xl text-zinc-600 hover:bg-zinc-50"
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className="mt-5 w-full rounded-full bg-zinc-900 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-700 active:scale-95"
              >
                Add to cart
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
