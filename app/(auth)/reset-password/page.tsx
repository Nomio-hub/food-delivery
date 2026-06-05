"use client";
import { AuthHeader } from "../../components/auth-layout";
import { SubmitButton, TextField } from "../../components/auth-form";
import { useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        <TextField
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          id="confirm"
          label="Confirm"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm"
          autoComplete="new-password"
          required
        />

        {/* Show password checkbox */}
        <label className="flex items-center gap-2 text-sm text-zinc-500 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="w-4 h-4 accent-black"
          />
          Show password
        </label>

        <SubmitButton loading={loading} disabled={!password || !confirm}>
          Create password
        </SubmitButton>
      </form>
    </>
  );
}
