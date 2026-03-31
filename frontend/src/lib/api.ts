import type { AuthResponse, LoginPayload, RegisterPayload, Task } from "./types";

const API_BASE_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

type ErrorShape = {
  message?: string;
  error?: string;
  errors?: string[];
  details?: string[];
};

export function apiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/")) {
    return `${API_BASE_URL}${path}`;
  }
  return `${API_BASE_URL}/${path}`;
}

export function createApiErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const value = payload as ErrorShape;
  if (Array.isArray(value.errors) && value.errors.length > 0) {
    return value.errors.join(" ");
  }
  if (Array.isArray(value.details) && value.details.length > 0) {
    return value.details.join(" ");
  }
  if (value.message && value.message.length > 0) {
    return value.message;
  }
  if (value.error && value.error.length > 0) {
    return value.error;
  }

  return fallback;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(apiUrl("/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = (await response.json().catch(() => ({}))) as AuthResponse | Record<string, unknown>;
  if (!response.ok) {
    throw new Error(createApiErrorMessage(result, "Falha ao fazer login."));
  }

  return result as AuthResponse;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await fetch(apiUrl("/auth/register"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = (await response.json().catch(() => ({}))) as AuthResponse | Record<string, unknown>;
  if (!response.ok) {
    throw new Error(createApiErrorMessage(result, "Falha ao criar conta."));
  }

  return result as AuthResponse;
}

export async function getTasks(token: string): Promise<Task[]> {
  const response = await fetch(apiUrl("/tasks"), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result = (await response.json().catch(() => [])) as Task[] | Record<string, unknown>;
  if (!response.ok) {
    throw new Error(createApiErrorMessage(result, "Falha ao carregar tarefas."));
  }

  return result as Task[];
}
