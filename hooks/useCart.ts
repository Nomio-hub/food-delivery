"use client";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  createElement,
} from "react";
import axios from "axios";
import { useUser } from "@/app/user-provider";

const CART_TOKEN_KEY = "cart-token";

function useCartCore() {
  const { accessToken } = useUser();
  const [cart, setCart] = useState<any>(null);

  // accessToken өөрчлөгдөх бүрт getHeaders шинэчлэгдэнэ
  const getHeaders = () => ({
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...(typeof window !== "undefined" && localStorage.getItem(CART_TOKEN_KEY)
      ? { "x-cart-token": localStorage.getItem(CART_TOKEN_KEY) }
      : {}),
  });

  useEffect(() => {
    axios.get("/api/cart", { headers: getHeaders() }).then((res) => {
      setCart(res.data);
      if (res.data.token) localStorage.setItem(CART_TOKEN_KEY, res.data.token);
    });
  }, [accessToken]); // ← accessToken өөрчлөгдөхөд cart дахин татна

  const addToCart = async (foodId: string) => {
    const res = await axios.post(
      "/api/cart",
      { foodId },
      { headers: getHeaders() },
    );
    setCart(res.data);
    if (res.data.token) localStorage.setItem(CART_TOKEN_KEY, res.data.token);
  };

  const removeFromCart = async (foodId: string, deleteAll = false) => {
    const res = await axios.patch(
      "/api/cart",
      { foodId, deleteAll },
      { headers: getHeaders() },
    );
    setCart(res.data);
  };

  const itemCount =
    cart?.cartFoods?.reduce((sum: number, cf: any) => sum + cf.quantity, 0) ??
    0;

  return { cart, addToCart, removeFromCart, itemCount };
}

type CartValue = ReturnType<typeof useCartCore>;
const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const value = useCartCore();
  return createElement(CartContext.Provider, { value }, children);
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
