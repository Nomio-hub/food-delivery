"use client";
import { useRouter } from "next/navigation";
import { AuthLayout } from "../components/auth-layout";
import { useUser } from "../user-provider";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

  return <AuthLayout>{children}</AuthLayout>;
}
