import { redirect } from "next/navigation";

import { getTokenFromCookies } from "@/lib/auth";

import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
  const token = await getTokenFromCookies();

  if (token) {
    redirect("/tasks");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-12">
      <RegisterForm />
    </main>
  );
}
