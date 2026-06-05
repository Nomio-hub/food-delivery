"use client";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/app/user-provider";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export function CartSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { accessToken } = useUser();

  const [tab, setTab] = useState<"cart" | "order">("cart");
  const [address, setAddress] = useState(() =>
    typeof window !== "undefined"
      ? (localStorage.getItem("delivery-address") ?? "")
      : "",
  );
  const [addressError, setAddressError] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (tab === "order" && accessToken) {
      axios
        .get("/api/orders", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => setOrders(res.data))
        .catch(() => {});
    }
  }, [tab, accessToken]);

  if (!open) return null;

  const items = cart?.cartFoods ?? [];
  const subtotal = items.reduce(
    (sum: number, cf: any) => sum + cf.quantity * parseFloat(cf.price),
    0,
  );
  const shipping = items.length > 0 ? 0.99 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!accessToken) {
      setShowAuthPrompt(true);
      return;
    }
    if (!address.trim()) {
      setAddressError(true);
      return;
    }
    setAddressError(false);
    setPlacing(true);
    try {
      const res = await axios.post(
        "/api/orders",
        {
          address,
          items: items.map((cf: any) => ({
            foodId: cf.foodId,
            quantity: cf.quantity,
            price: cf.price,
          })),
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setOrders((prev) => [res.data, ...prev]);
      clearCart();
      setAddress("");
      setTab("order");
      toast.success("Захиалга амжилттай өгөгдлөө");
    } catch {
      toast.error("Захиалга өгөхөд алдаа гарлаа");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl">
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

        <div className="flex border-b">
          <button
            onClick={() => setTab("cart")}
            className={`flex-1 py-2.5 text-sm font-semibold transition ${tab === "cart" ? "bg-accent-soft text-white" : "text-zinc-500 hover:bg-zinc-50"}`}
          >
            Cart
          </button>
          <button
            onClick={() => setTab("order")}
            className={`flex-1 py-2.5 text-sm font-semibold transition ${tab === "order" ? "bg-accent-soft text-white" : "text-zinc-500 hover:bg-zinc-50"}`}
          >
            Order
          </button>
        </div>

        {tab === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="mb-3 text-sm font-medium text-zinc-500">My cart</p>

              {items.length === 0 ? (
                <p className="py-10 text-center text-sm text-zinc-400">
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
                          src={cf.image || "/placeholder.png"}
                          alt={cf.name || "Food image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-snug text-accent-soft">
                          {cf.name}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-zinc-400">
                          {cf.ingredients}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border px-2 py-0.5">
                            <button
                              onClick={() => removeFromCart(cf.foodId)}
                              className="text-base leading-none text-zinc-400 hover:text-zinc-700"
                            >
                              −
                            </button>
                            <span className="w-4 text-center text-sm font-medium">
                              {cf.quantity}
                            </span>
                            <button
                              onClick={() => addToCart(cf.foodId)}
                              className="text-base leading-none text-zinc-400 hover:text-zinc-700"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-zinc-800">
                            ${(cf.quantity * parseFloat(cf.price)).toFixed(2)}
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

              <div className="mt-5">
                <p className="mb-2 text-sm font-medium text-zinc-700">
                  Delivery location
                </p>
                <textarea
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setAddressError(false);
                  }}
                  placeholder="Please share your complete address."
                  rows={3}
                  className={`w-full resize-none rounded-xl border px-3 py-2.5 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-1 ${
                    addressError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-zinc-200 focus:ring-accent-soft"
                  }`}
                />
                {addressError && (
                  <p className="mt-1 text-xs text-red-500">
                    Хүргэлтийн хаягаа оруулна уу
                  </p>
                )}
              </div>
            </div>

            <div className="border-t px-5 py-4">
              <p className="mb-3 text-sm font-semibold text-zinc-700">
                Payment info
              </p>
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-zinc-500">
                  <span>Items</span>
                  <span>
                    {items.length > 0 ? `$${subtotal.toFixed(2)}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Shipping</span>
                  <span>
                    {items.length > 0 ? `$${shipping.toFixed(2)}` : "—"}
                  </span>
                </div>
                <div className="mt-1 flex justify-between border-t pt-2 font-semibold text-zinc-800">
                  <span>Total</span>
                  <span>{items.length > 0 ? `$${total.toFixed(2)}` : "—"}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={items.length === 0 || placing}
                className="mt-4 w-full rounded-full bg-accent-soft py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
              >
                {placing ? "Захиалж байна…" : "Checkout"}
              </button>
            </div>
          </>
        )}

        {tab === "order" && (
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <p className="mb-4 text-sm font-medium text-zinc-500">
              Order history
            </p>
            {!accessToken ? (
              <p className="py-10 text-center text-sm text-zinc-400">
                Захиалга харахын тулд нэвтэрнэ үү
              </p>
            ) : orders.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-400">
                Захиалга байхгүй байна
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order: any) => (
                  <div key={order.id} className="rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-zinc-800">
                        ${order.totalPrice?.toFixed(2)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "CANCELED"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status === "DELIVERED"
                          ? "Delivered"
                          : order.status === "CANCELED"
                            ? "Canceled"
                            : "Pending"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">
                      {order.address}
                    </p>
                    <div className="mt-2 flex flex-col gap-0.5">
                      {order.foodOrderItems?.map((item: any) => (
                        <p key={item.id} className="text-xs text-zinc-500">
                          • {item.food?.name} ×{item.quantity}
                        </p>
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] text-zinc-300">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showAuthPrompt && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={() => setShowAuthPrompt(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-[70] w-80 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowAuthPrompt(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600"
            >
              <svg viewBox="0 0 16 16" fill="none" className="size-4">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <p className="text-center text-base font-semibold text-zinc-800">
              You need to log in first
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="/login"
                className="flex-1 rounded-full bg-zinc-900 py-2.5 text-center text-sm font-semibold text-white hover:bg-zinc-700"
              >
                Log in
              </a>
              <a
                href="/signup"
                className="flex-1 rounded-full border py-2.5 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                Sign up
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
