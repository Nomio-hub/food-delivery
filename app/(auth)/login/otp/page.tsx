"use client";
import { AuthHeader } from "../../../components/auth-layout";
import { SubmitButton, TextField } from "../../../components/auth-form";
import { useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/app/user-provider";

export default function OTPPage() {
  const { setAccessToken } = useUser();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleSubmitForm = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/api/auth/otp", {
        email,
        otp,
      })
      .then((res) => {
        alert(res.data.message);
        setLoading(false);
        setAccessToken(res.data.accessToken);
      })
      .catch(({ response }) => {
        alert(response.message);
      });
  };
  return (
    <>
      <AuthHeader title="Welcome back" subtitle="Log in to keep ordering your favorite dishes." />

      <form className="flex flex-col gap-4" onSubmit={handleSubmitForm}>
        <TextField
          value={email}
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email address"
          autoComplete="email"
          readOnly
          required
        />
        <TextField
          value={otp + ""}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (!isNaN(value)) {
              if (value < 9999) setOtp(value);
            }
          }}
          id="otp"
          label="OTP"
          type="number"
          placeholder="Enter your otp"
          required
        />
        <SubmitButton loading={loading}>{"Let's Go"}</SubmitButton>
      </form>
    </>
  );
}
