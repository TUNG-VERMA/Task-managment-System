"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import TaskForm from "@/components/task-form";
import TaskList from "@/components/task-list";

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <Navbar />
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <TaskForm onSaved={() => setRefreshKey((k) => k + 1)} />
          <TaskList refreshKey={refreshKey} />
        </div>
      </div>
    </main>
  );
}
