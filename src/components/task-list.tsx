"use client";

import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
};

type ApiResponse = {
  data: {
    tasks: Task[];
    pagination: {
      page: number;
      totalPages: number;
      totalItems: number;
    };
  };
};

export default function TaskList({ refreshKey }: { refreshKey: number }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  async function fetchTasks() {
    setLoading(true);
    const query = new URLSearchParams({ page: String(page), limit: "5" });
    if (status !== "ALL") query.set("status", status);
    if (search) query.set("search", search);

    const res = await fetch(`/api/tasks?${query.toString()}`);
    const json: ApiResponse = await res.json();
    setTasks(json.data.tasks);
    setTotalPages(json.data.pagination.totalPages);
    setLoading(false);
  }

  useEffect(() => {
    fetchTasks();
  }, [page, status, search, refreshKey]);

  async function deleteTask(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <input
          className="rounded-xl px-4 py-3 md:flex-1"
          placeholder="Search by title"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <select
          className="rounded-xl px-4 py-3"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="ALL">All Status</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      </div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-2xl border border-slate-700 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="mt-2 text-slate-300">{task.description}</p>
                  <p className="mt-2 text-sm text-slate-400">Status: {task.status}</p>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="rounded-xl border border-red-400/30 px-3 py-2 text-sm text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-5 flex items-center justify-between">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="rounded-xl border border-slate-600 px-4 py-2 disabled:opacity-40"
        >
          Prev
        </button>
        <p>
          Page {page} of {totalPages}
        </p>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-xl border border-slate-600 px-4 py-2 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
