"use client";

import { redirect } from "next/navigation";
import { useUser } from "../user-provider";
import { AdminSidebar } from "./sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useUser();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!loading && !user) {
    return redirect("/login");
  }

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        You are not admin
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <AdminSidebar />
      <main className="pl-57.25 pr-6 py-6">
        <div className="flex items-start justify-end pb-6">
          <div className="size-9 overflow-hidden rounded-full bg-zinc-300" />
        </div>
        {children}
      </main>
    </div>
  );
}
