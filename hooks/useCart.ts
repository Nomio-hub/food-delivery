"use client";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  createElement,
} from "react";

const CART_KEY = "cart";

type CartFood = {
  foodId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  ingredients?: string;
};

type Cart = {
  cartFoods: CartFood[];
};

function useCartCore() {
  const [cart, setCart] = useState<Cart>({ cartFoods: [] });

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    foodId: string,
    meta?: { price: number; name: string; image: string; ingredients?: string },
    quantity: number = 1,
  ) => {
    setCart((prev) => {
      const existing = prev.cartFoods.find((cf) => cf.foodId === foodId);
      if (existing) {
        return {
          cartFoods: prev.cartFoods.map((cf) =>
            cf.foodId === foodId
              ? { ...cf, quantity: cf.quantity + quantity }
              : cf,
          ),
        };
      }
      return {
        cartFoods: [
          ...prev.cartFoods,
          {
            foodId,
            quantity,
            price: meta?.price ?? 0,
            name: meta?.name ?? "",
            image: meta?.image ?? "",
            ingredients: meta?.ingredients ?? "",
          },
        ],
      };
    });
  };

  const removeFromCart = (foodId: string, deleteAll = false) => {
    setCart((prev) => {
      if (deleteAll) {
        return {
          cartFoods: prev.cartFoods.filter((cf) => cf.foodId !== foodId),
        };
      }
      return {
        cartFoods: prev.cartFoods
          .map((cf) =>
            cf.foodId === foodId ? { ...cf, quantity: cf.quantity - 1 } : cf,
          )
          .filter((cf) => cf.quantity > 0),
      };
    });
  };

  const clearCart = () => {
    setCart({ cartFoods: [] });
    localStorage.removeItem(CART_KEY);
  };

  const itemCount = cart.cartFoods.reduce((sum, cf) => sum + cf.quantity, 0);

  return { cart, addToCart, removeFromCart, clearCart, itemCount };
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
