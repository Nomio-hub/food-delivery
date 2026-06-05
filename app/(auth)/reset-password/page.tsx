"use client";
import { Suspense } from "react";
import { AuthHeader } from "../../components/auth-layout";
import { SubmitButton, TextField } from "../../components/auth-form";
import { useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

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
    stroke="currentColor"
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

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Нууц үг таарахгүй байна");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/auth/reset-password", { token, password });
      router.push("/login");
    } catch ({ response }: any) {
      alert(response?.data?.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthHeader
        title="Create new password"
        subtitle="Set a new password with a combination of letters and numbers for better security."
      />
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="relative">
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 bottom-3 text-zinc-400 hover:text-zinc-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        <div className="relative">
          <TextField
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            id="confirm"
            label="Confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute right-3 bottom-3 text-zinc-400 hover:text-zinc-600 transition-colors"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        <SubmitButton loading={loading} disabled={!password || !confirm}>
          Create password
        </SubmitButton>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-10 text-sm text-zinc-400">
          Уншиж байна…
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
