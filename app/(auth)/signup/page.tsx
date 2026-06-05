"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/user-provider";
import Link from "next/link";
import { AuthHeader } from "@/app/components/auth-layout";
import { SubmitButton, TextField } from "@/app/components/auth-form";

export default function SignupPage() {
  const { setAccessToken } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Нууц үг таарахгүй байна");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/signup", { email, password });
      setAccessToken(res.data.accessToken);
      router.push("/");
    } catch ({ response }: any) {
      alert(response?.data?.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthHeader
        title="Create account"
        subtitle="Sign up to start ordering your favorite dishes."
      />

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email address"
          autoComplete="email"
          required
        />
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="At least 6 characters"
          autoComplete="new-password"
          required
        />
        <TextField
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          id="confirm"
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
        />

        {/* Show password checkbox */}
        <label className="flex items-center gap-2 text-sm text-zinc-500 cursor-pointer select-none -mt-0.5">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="w-4 h-4 accent-black"
          />
          Show password
        </label>

        <SubmitButton loading={loading}>Sign up</SubmitButton>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-500">
        Бүртгэлтэй юу?{" "}
        <Link
          href="/login"
          className="font-medium text-[#2563EB] hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
