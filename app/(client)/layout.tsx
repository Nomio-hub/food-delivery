"use client";
import { useState } from "react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { CartSidebar } from "../components/cart-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />
      {children}
      <Footer />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
