"use client";
import { AuthHeader } from "../../components/auth-layout";
import { SubmitButton, TextField } from "../../components/auth-form";
import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", { email });
      setSent(true);
    } catch ({ response }: any) {
      alert(response?.data?.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center flex flex-col gap-2">
        <p className="text-lg font-medium">Имэйл илгээгдлээ ✅</p>
        <p className="text-sm text-zinc-500">
          <strong>{email}</strong> хаяг руу нууц үг шинэчлэх линк илгээлээ.
          Имэйлээ шалгана уу.
        </p>
      </div>
    );
  }

  return (
    <>
      <AuthHeader
        title="Forgot password?"
        subtitle="Enter your email and we'll send you a reset link."
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
        <SubmitButton loading={loading} disabled={!email}>
          Send reset link
        </SubmitButton>
      </form>
    </>
  );
}
