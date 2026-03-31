import { redirect } from "next/navigation";

import { getTasks } from "@/lib/api";
import { getTokenFromCookies } from "@/lib/auth";

import { TasksClient } from "./tasks-client";

export default async function TasksPage() {
  const token = await getTokenFromCookies();
  if (!token) {
    redirect("/login");
  }

  const initialTasks = await getTasks(token);
  return <TasksClient initialTasks={initialTasks} token={token} />;
}
