"use client";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";

export function CartSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { cart, addToCart, removeFromCart, itemCount } = useCart();

  if (!open) return null;

  const items = cart?.cartFoods ?? [];
  const subtotal = items.reduce(
    (sum: number, cf: any) => sum + cf.quantity * parseFloat(cf.food.price),
    0,
  );
  const shipping = 0.99;
  const total = subtotal + shipping;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="size-5 text-accent-soft"
              aria-hidden="true"
            >
              <path
                d="M2 2h1.5l2 9h9l1.5-6H5.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="16.5" r="1.2" fill="currentColor" />
              <circle cx="14" cy="16.5" r="1.2" fill="currentColor" />
            </svg>
            <span className="text-base font-semibold text-zinc-800">
              Order detail
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-full border text-zinc-500 hover:bg-zinc-50"
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
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button className="flex-1 py-2.5 text-sm font-semibold text-white bg-accent-soft">
            Cart
          </button>
          <button className="flex-1 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-50">
            Order
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-3 text-sm font-medium text-zinc-500">My cart</p>

          {items.length === 0 ? (
            <p className="text-center text-sm text-zinc-400 py-10">
              Сагс хоосон байна
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((cf: any) => (
                <div
                  key={cf.foodId}
                  className="flex items-start gap-3 border-b pb-4"
                >
                  <div className="relative size-16 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={cf.food.image}
                      alt={cf.food.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-accent-soft leading-snug">
                      {cf.food.name}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-400 line-clamp-2">
                      {cf.food.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border px-2 py-0.5">
                        <button
                          onClick={() => removeFromCart(cf.foodId)}
                          className="text-zinc-400 hover:text-zinc-700 text-base leading-none"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium w-4 text-center">
                          {cf.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(cf.foodId)}
                          className="text-zinc-400 hover:text-zinc-700 text-base leading-none"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-zinc-800">
                        ${(cf.quantity * parseFloat(cf.food.price)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(cf.foodId, true)}
                    className="flex size-6 flex-shrink-0 items-center justify-center rounded-full border text-zinc-400 hover:text-red-500"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="size-3.5"
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
                </div>
              ))}
            </div>
          )}

          {/* Delivery location */}
          <div className="mt-5">
            <p className="mb-2 text-sm font-medium text-zinc-700">
              Delivery location
            </p>
            <textarea
              placeholder="Please share your complete address."
              className="w-full resize-none rounded-xl border px-3 py-2.5 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-accent-soft"
              rows={3}
            />
          </div>
        </div>

        {/* Payment info + checkout */}
        <div className="border-t px-5 py-4">
          <p className="mb-3 text-sm font-semibold text-zinc-700">
            Payment info
          </p>
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between text-zinc-500">
              <span>Items</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}$</span>
            </div>
            <div className="mt-1 flex justify-between border-t pt-2 font-semibold text-zinc-800">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button className="mt-4 w-full rounded-full bg-accent-soft py-3 text-sm font-semibold text-white transition hover:brightness-110">
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}
