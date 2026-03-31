import bcrypt from "bcrypt";
import { Router } from "express";
import { z } from "zod";

import { signToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";

const authRouter = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Email inválido.").transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres.")
    .max(72, "Senha deve ter no máximo 72 caracteres."),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido.").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Senha é obrigatória."),
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Dados inválidos.",
      errors: parsed.error.issues.map((issue) => issue.message),
    });
  }

  const { name, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return res.status(409).json({ message: "Email já está em uso." });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  const token = signToken(user.id);
  return res.status(201).json({ token, user });
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Dados inválidos.",
      errors: parsed.error.issues.map((issue) => issue.message),
    });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Credenciais inválidas." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Credenciais inválidas." });
  }

  const token = signToken(user.id);
  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

export { authRouter };
