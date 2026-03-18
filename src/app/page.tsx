import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-16">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-700 p-10 shadow-2xl">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Secure Task Management App</h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          JWT auth with HTTP-only cookies, PostgreSQL via Prisma, encrypted task descriptions,
          pagination, filtering, search, and protected frontend routes.
        </p>
        <div className="mt-8 flex gap-4">
          <Link className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950" href="/register">
            Get Started
          </Link>
          <Link className="rounded-xl border border-slate-600 px-5 py-3 font-semibold" href="/login">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
