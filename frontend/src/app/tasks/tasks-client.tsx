"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { Task } from "@/lib/types";

type TasksClientProps = {
  initialTasks: Task[];
  token: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export function TasksClient({ initialTasks, token }: TasksClientProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");

  const filteredTasks = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [filter, tasks]);

  async function createTask() {
    setError(null);
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Informe um título para a tarefa.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: cleanTitle }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data?.message ?? "Não foi possível criar a tarefa.");
      return;
    }

    const newTask = (await response.json()) as Task;
    setTasks((previous) => [newTask, ...previous]);
    setTitle("");
  }

  async function toggleTask(task: Task) {
    setError(null);
    const nextStatus = task.status === "todo" ? "done" : "todo";

    const response = await fetch(`${API_BASE_URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data?.message ?? "Não foi possível atualizar a tarefa.");
      return;
    }

    const updatedTask = (await response.json()) as Task;
    setTasks((previous) =>
      previous.map((item) => (item.id === updatedTask.id ? updatedTask : item)),
    );
  }

  async function removeTask(taskId: string) {
    setError(null);

    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data?.message ?? "Não foi possível remover a tarefa.");
      return;
    }

    setTasks((previous) => previous.filter((task) => task.id !== taskId));
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10">
      <header className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">TaskFlow</h1>
          <p className="text-sm text-zinc-600">Gerencie suas tarefas.</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sair
        </button>
      </header>

      <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Nova tarefa..."
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500"
          />
          <button
            type="button"
            onClick={createTask}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Criar
          </button>
        </div>

        <div className="mt-4 flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-md px-3 py-1 ${
              filter === "all" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setFilter("todo")}
            className={`rounded-md px-3 py-1 ${
              filter === "todo" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"
            }`}
          >
            Pendentes
          </button>
          <button
            type="button"
            onClick={() => setFilter("done")}
            className={`rounded-md px-3 py-1 ${
              filter === "done" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"
            }`}
          >
            Concluídas
          </button>
        </div>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <ul className="mt-4 space-y-2">
          {filteredTasks.length === 0 ? (
            <li className="rounded-md border border-dashed border-zinc-300 p-3 text-sm text-zinc-500">
              Nenhuma tarefa neste filtro.
            </li>
          ) : (
            filteredTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2"
              >
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.status === "done"}
                    onChange={() => toggleTask(task)}
                    className="h-4 w-4"
                  />
                  <span className={task.status === "done" ? "text-zinc-500 line-through" : "text-zinc-800"}>
                    {task.title}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  className="rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  Remover
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}
