import { NextResponse } from "next/server";

import { loginUser } from "@/lib/api";
import { setToken } from "@/lib/auth";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const result = await loginUser({
      email: body.email ?? "",
      password: body.password ?? "",
    });

    await setToken(result.token);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao fazer login.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
