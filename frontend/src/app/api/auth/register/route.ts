import { NextResponse } from "next/server";

import { registerUser } from "@/lib/api";
import { setToken } from "@/lib/auth";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const result = await registerUser({
      name: body.name ?? "",
      email: body.email ?? "",
      password: body.password ?? "",
    });

    await setToken(result.token);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao criar conta.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
