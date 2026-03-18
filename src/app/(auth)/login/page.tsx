"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Unable to login");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8">
        <h1 className="mb-6 text-3xl font-bold">Login</h1>
        <div className="grid gap-4">
          <input placeholder="Email" type="email" className="rounded-xl px-4 py-3" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Password" type="password" className="rounded-xl px-4 py-3" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button className="rounded-xl bg-white px-4 py-3 font-semibold text-slate-950">Login</button>
          <Link href="/register" className="text-sm text-slate-300 underline">Create a new account</Link>
        </div>
      </form>
    </main>
  );
}
