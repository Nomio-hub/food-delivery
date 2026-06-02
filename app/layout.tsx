import type { Metadata } from "next";
import { Bebas_Neue, Inter, Geist } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./user-provider";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "NomNom — Swift delivery",
  description: "Fresh. Fast. Delivered. Order food from your favorite spots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", inter.variable, bebas.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <UserProvider />
      </body>
    </html>
  );
}
