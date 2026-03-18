"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
      <Link href="/dashboard" className="text-lg font-semibold">
        Secure Task Manager
      </Link>
      <button
        onClick={logout}
        className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium hover:bg-slate-800"
      >
        Logout
      </button>
    </div>
  );
}
