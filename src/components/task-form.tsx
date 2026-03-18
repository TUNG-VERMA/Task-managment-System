"use client";

import { FormEvent, useState } from "react";

type Props = {
  onSaved: () => void;
};

export default function TaskForm({ onSaved }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Unable to create task");
      return;
    }

    setTitle("");
    setDescription("");
    setStatus("OPEN");
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <h2 className="mb-4 text-xl font-semibold">Create Task</h2>
      <div className="grid gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="rounded-xl px-4 py-3"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          className="min-h-28 rounded-xl px-4 py-3"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl px-4 py-3"
        >
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button disabled={loading} className="rounded-xl bg-white px-4 py-3 font-semibold text-slate-950">
          {loading ? "Saving..." : "Save Task"}
        </button>
      </div>
    </form>
  );
}
