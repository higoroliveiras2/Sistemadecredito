"use client";

import Link from "next/link";
import { useState } from "react";

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = LoginInput & {
  name: string;
};

type AuthFormProps =
  | {
      mode: "login";
      isLoading: boolean;
      error: string | null;
      onSubmit: (data: LoginInput) => Promise<void>;
    }
  | {
      mode: "register";
      isLoading: boolean;
      error: string | null;
      onSubmit: (data: RegisterInput) => Promise<void>;
    };

export function AuthForm(props: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const isRegister = props.mode === "register";
  const visibleError = localError ?? props.error;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    if (email.trim().length === 0) {
      setLocalError("Email é obrigatório.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (isRegister && name.trim().length < 2) {
      setLocalError("Nome deve ter pelo menos 2 caracteres.");
      return;
    }

    if (isRegister) {
      await props.onSubmit({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      return;
    }

    await props.onSubmit({
      email: email.trim(),
      password,
    });
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-900">
        {isRegister ? "Criar conta" : "Entrar"}
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        {isRegister ? "Cadastre-se para gerenciar suas tarefas." : "Faça login para continuar."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {isRegister ? (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Nome</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none ring-indigo-200 focus:ring"
              placeholder="Seu nome"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none ring-indigo-200 focus:ring"
            placeholder="voce@email.com"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Senha</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none ring-indigo-200 focus:ring"
            placeholder="******"
          />
        </label>

        {visibleError ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {visibleError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={props.isLoading}
          className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {props.isLoading ? "Enviando..." : isRegister ? "Cadastrar" : "Entrar"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        {isRegister ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
        <Link className="font-medium text-indigo-700 hover:underline" href={isRegister ? "/login" : "/register"}>
          {isRegister ? "Entrar" : "Criar conta"}
        </Link>
      </p>
    </div>
  );
}
