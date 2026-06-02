"use client";
import { AuthHeader } from "../../components/auth-layout";
import { SubmitButton, TextField } from "../../components/auth-form";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmitForm = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/api/auth", { email })
      .then((res) => {
        setLoading(false);
        alert(res.data.message);
        router.push(`/login/otp?email=${email}`);
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
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email address"
          autoComplete="email"
          required
        />
        <SubmitButton loading={loading}>{"Let's Go"}</SubmitButton>
      </form>
    </>
  );
}
