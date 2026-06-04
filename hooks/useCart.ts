"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@/app/user-provider";

const CART_TOKEN_KEY = "cart-token";

export function useCart() {
  const { accessToken } = useUser();
  const [cart, setCart] = useState<any>(null);

  const getHeaders = () => ({
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...(localStorage.getItem(CART_TOKEN_KEY) && {
      "x-cart-token": localStorage.getItem(CART_TOKEN_KEY),
    }),
  });

  useEffect(() => {
    axios.get("/api/cart", { headers: getHeaders() }).then((res) => {
      setCart(res.data);
      if (res.data.token) localStorage.setItem(CART_TOKEN_KEY, res.data.token);
    });
  }, [accessToken]);

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
