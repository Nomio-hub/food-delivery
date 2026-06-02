"use client";

import { useState } from "react";

export function TextField({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  value,
  onChange,
  readOnly,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  value: string;
  onChange?: ({ target }: { target: { value: string } }) => void;
  readOnly?: boolean;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        id={id}
        name={id}
        type={type}
        placeholder={placeholder ?? label}
        autoComplete={autoComplete}
        required={required}
        className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm leading-5 text-foreground placeholder:text-muted focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
      />
    </div>
  );
}

export function PasswordField({ id, label, placeholder, autoComplete }: { id: string; label: string; placeholder?: string; autoComplete?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder ?? label}
          autoComplete={autoComplete}
          required
          className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 pr-10 text-sm leading-5 text-foreground placeholder:text-muted focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted transition hover:text-foreground"
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
  );
}

export function ShowPasswordCheckbox({
  checked,
  onChange,
  label = "Show password",
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-foreground/50 accent-primary"
      />
      {label}
    </label>
  );
}

export function SubmitButton({ children, disabled, loading }: { children: React.ReactNode; disabled?: boolean; loading?: boolean }) {
  if (loading) {
    return (
      <button
        type="button"
        disabled={true}
        className="flex h-9 w-full items-center justify-center rounded-md bg-primary px-8 text-sm font-medium leading-5 text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-20"
      >
        Loading...
      </button>
    );
  }
  return (
    <button
      type="submit"
      disabled={disabled}
      className="flex h-9 w-full items-center justify-center rounded-md bg-primary px-8 text-sm font-medium leading-5 text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-20"
    >
      {children}
    </button>
  );
}

function Eye() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
      <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
      <path
        d="M2 2 14 14M6.5 6.5a2 2 0 0 0 2.8 2.8M9.9 9.9c-.6.4-1.2.6-1.9.6-4 0-6.5-4.5-6.5-4.5.6-1 1.4-1.9 2.4-2.6M5.5 4c.8-.3 1.6-.5 2.5-.5 4 0 6.5 4.5 6.5 4.5-.3.5-.7 1.1-1.2 1.7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
