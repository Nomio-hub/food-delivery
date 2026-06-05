"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/user-provider";
import { useCart } from "@/hooks/useCart";

const ADDRESS_KEY = "delivery-address";

export function Header({ onCartClick }: { onCartClick?: () => void }) {
  const router = useRouter();
  const { user, loading } = useUser();
  const { itemCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [addressOpen, setAddressOpen] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [savedAddress, setSavedAddress] = useState("");
  const addressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ADDRESS_KEY);
    if (stored) setSavedAddress(stored);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        addressRef.current &&
        !addressRef.current.contains(e.target as Node)
      ) {
        setAddressOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSignOut() {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  }

  function handleSaveAddress() {
    if (!addressInput.trim()) return;
    localStorage.setItem(ADDRESS_KEY, addressInput.trim());
    setSavedAddress(addressInput.trim());
    setAddressInput("");
    setAddressOpen(false);
  }

  function handleClearAddress() {
    localStorage.removeItem(ADDRESS_KEY);
    setSavedAddress("");
  }

  const isAdmin = user?.role === "ADMIN";
  const displayAddress = savedAddress
    ? savedAddress.length > 20
      ? savedAddress.slice(0, 20) + "…"
      : savedAddress
    : "Add Location";

  return (
    <header className="bg-primary w-full">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3 sm:px-12 lg:px-[88px]">
        <Logo />

        <div className="flex items-center gap-3">
          {loading ? null : (
            <>
              {/* Location pill — always visible */}
              <div className="relative hidden sm:block" ref={addressRef}>
                <button
                  type="button"
                  onClick={() => setAddressOpen((v) => !v)}
                  className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs transition hover:bg-zinc-50"
                >
                  <PinIcon className="size-5 text-accent-soft" />
                  <span className="font-medium text-accent-soft">
                    Delivery address:
                  </span>
                  <span
                    className={
                      savedAddress ? "font-medium text-zinc-700" : "text-muted"
                    }
                  >
                    {displayAddress}
                  </span>
                  <ChevronDownIcon className="size-5 text-muted" />
                </button>

                {addressOpen && (
                  <div className="absolute left-0 top-11 z-50 w-72 rounded-2xl border bg-white p-4 shadow-xl">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Delivery address
                    </p>
                    {savedAddress && (
                      <div className="mb-3 flex items-center gap-2 rounded-full border border-accent-soft px-3 py-2 text-sm text-zinc-700">
                        <PinIcon className="size-4 flex-shrink-0 text-accent-soft" />
                        <span className="flex-1 truncate">{savedAddress}</span>
                        <button
                          onClick={handleClearAddress}
                          className="text-zinc-400 hover:text-zinc-600"
                        >
                          <XIcon className="size-4" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 rounded-full border border-accent-soft px-3 py-2">
                      <PinIcon className="size-4 flex-shrink-0 text-accent-soft" />
                      <input
                        autoFocus
                        type="text"
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSaveAddress()
                        }
                        placeholder="Add Location"
                        className="flex-1 bg-transparent text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleSaveAddress}
                      disabled={!addressInput.trim()}
                      className="mt-3 w-full rounded-full bg-accent-soft py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-40"
                    >
                      Deliver Here
                    </button>
                  </div>
                )}
              </div>

              {/* Admin товч */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => router.push("/admin/products")}
                  className="hidden items-center gap-1.5 rounded-full bg-accent-soft px-4 py-2.5 text-xs font-semibold text-white transition hover:brightness-110 sm:flex"
                >
                  <ShieldIcon className="size-3.5" />
                  Admin panel
                </button>
              )}

              {/* Cart — always visible */}
              <button
                onClick={onCartClick}
                type="button"
                aria-label="Cart"
                className="relative flex size-9 items-center justify-center rounded-full bg-secondary text-primary transition hover:bg-zinc-200"
              >
                <CartIcon className="size-4" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-accent-soft text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Profile / Auth dropdown — always visible */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  aria-label="Account"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-white transition hover:brightness-110"
                >
                  <UserIcon className="size-4" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-11 z-50 min-w-[180px] rounded-2xl bg-white py-3 shadow-lg">
                    {user ? (
                      <>
                        <p className="px-4 pb-2 text-sm font-semibold text-zinc-800">
                          {user.email}
                        </p>
                        {isAdmin && (
                          <>
                            <hr className="border-zinc-100" />
                            <button
                              type="button"
                              onClick={() => {
                                setDropdownOpen(false);
                                router.push("/admin/products");
                              }}
                              className="w-full px-4 py-2 text-left text-sm font-medium text-accent-soft hover:bg-zinc-50"
                            >
                              Admin panel
                            </button>
                          </>
                        )}
                        <hr className="border-zinc-100" />
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                        >
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Нэвтрээгүй үед */}
                        <p className="px-4 pb-2 text-xs text-zinc-400">
                          Нэвтэрч орно уу
                        </p>
                        <hr className="border-zinc-100" />
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            router.push("/login");
                          }}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                        >
                          Log in
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            router.push("/signup");
                          }}
                          className="w-full px-4 py-2 text-left text-sm font-medium text-accent-soft hover:bg-zinc-50"
                        >
                          Sign up
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/logo.svg"
        alt=""
        aria-hidden="true"
        className="h-9 w-auto"
      />
      <div className="flex flex-col leading-none">
        <span className="font-semibold text-[20px] tracking-tight text-white">
          Nom<span className="text-accent-soft">Nom</span>
        </span>
        <span className="text-xs text-zinc-100/80">Swift delivery</span>
      </div>
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 1.5L2.5 4v4c0 3 2.5 5.5 5.5 6 3-0.5 5.5-3 5.5-6V4L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 8l1.5 1.5 3-3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 18s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="m6 8 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1.33 1.33h1.78l1.65 8.04a1.33 1.33 0 0 0 1.31 1.07h6.21a1.33 1.33 0 0 0 1.3-1.02l1.08-4.48H4.05"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.33" cy="13.67" r="0.83" fill="currentColor" />
      <circle cx="12.33" cy="13.67" r="0.83" fill="currentColor" />
    </svg>
  );
}
function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M13.33 14v-1.33A2.67 2.67 0 0 0 10.67 10H5.33a2.67 2.67 0 0 0-2.66 2.67V14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="8"
        cy="4.67"
        r="2.67"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
