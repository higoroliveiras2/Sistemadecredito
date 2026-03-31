"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import type { AuthResponse, LoginPayload } from "@/lib/types";
import { createApiErrorMessage } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(payload: LoginPayload): Promise<void> {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as AuthResponse | Record<string, unknown>;
      if (!response.ok) {
        setError(createApiErrorMessage(data, "Falha ao fazer login."));
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

  return <AuthForm mode="login" onSubmit={handleSubmit} isLoading={isLoading} error={error} />;
}
