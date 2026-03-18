"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Unable to register");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8">
        <h1 className="mb-6 text-3xl font-bold">Create account</h1>
        <div className="grid gap-4">
          <input placeholder="Name" className="rounded-xl px-4 py-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Email" type="email" className="rounded-xl px-4 py-3" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Password" type="password" className="rounded-xl px-4 py-3" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button className="rounded-xl bg-white px-4 py-3 font-semibold text-slate-950">Register</button>
          <Link href="/login" className="text-sm text-slate-300 underline">Already have an account?</Link>
        </div>
      </form>
    </main>
  );
}
