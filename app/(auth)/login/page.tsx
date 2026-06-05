"use client";
import { AuthHeader } from "../../components/auth-layout";
import { SubmitButton, TextField } from "../../components/auth-form";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/user-provider";
import Link from "next/link";

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#71717A"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="m6.72 6.72-5.72-5.72" />
    <path d="m17.28 17.28 5.72 5.72" />
    <path d="m10.59 10.59a3 3 0 0 0 4.24 4.24" />
  </svg>
);

export default function LoginPage() {
  const { setAccessToken } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth", { email, password });
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
        title="Log in"
        subtitle="Log in to enjoy your favorite dishes."
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

        <div className="relative">
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 bottom-2.5 text-zinc-400 hover:text-zinc-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        {/* Forgot password холбоос */}
        <div className="flex justify-start -mt-1">
          <Link
            href="/forgot-password"
            className="text-sm text-zinc-500 underline hover:text-zinc-700"
          >
            Forgot password?
          </Link>
        </div>

        <SubmitButton loading={loading}>Let's Go</SubmitButton>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-500">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-[#2563EB] hover:underline"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}
