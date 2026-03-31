"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { createApiErrorMessage } from "@/lib/api";
import type { AuthResponse, RegisterPayload } from "@/lib/types";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(data: RegisterPayload): Promise<void> {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as AuthResponse | Record<string, unknown>;

      if (!response.ok) {
        setError(createApiErrorMessage(result, "Não foi possível criar conta."));
        return;
      }

      router.push("/tasks");
      router.refresh();
    } catch {
      setError("Não foi possível conectar com a API.");
    } finally {
      setIsLoading(false);
    }
  }

  return <AuthForm mode="register" onSubmit={handleRegister} isLoading={isLoading} error={error} />;
}
