import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("taskflow_token")?.value;

  if (token) {
    redirect("/tasks");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-12">
      <LoginForm />
    </main>
  );
}
