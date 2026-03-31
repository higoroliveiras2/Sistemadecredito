import { Router } from "express";
import { z } from "zod";

import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const tasksRouter = Router();

tasksRouter.use(authMiddleware);

const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório."),
});

const updateTaskSchema = z.object({
  status: z.enum(["todo", "done"]),
});

tasksRouter.get("/", async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  const tasks = await prisma.task.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
  });

  return res.json(tasks);
});

tasksRouter.post("/", async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  const parsed = createTaskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Dados inválidos.",
      errors: parsed.error.issues.map((issue) => issue.message),
    });
  }

  const task = await prisma.task.create({
    data: {
      title: parsed.data.title,
      userId: req.userId,
    },
  });

  return res.status(201).json(task);
});

tasksRouter.put("/:id", async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  const paramsSchema = z.object({
    id: z.uuid("ID da tarefa inválido."),
  });
  const parsedParams = paramsSchema.safeParse(req.params);
  const parsedBody = updateTaskSchema.safeParse(req.body);

  if (!parsedParams.success) {
    return res.status(400).json({
      message: "Parâmetros inválidos.",
      errors: parsedParams.error.issues.map((issue) => issue.message),
    });
  }

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Dados inválidos.",
      errors: parsedBody.error.issues.map((issue) => issue.message),
    });
  }

  const task = await prisma.task.findFirst({
    where: {
      id: parsedParams.data.id,
      userId: req.userId,
    },
  });

  if (!task) {
    return res.status(404).json({ message: "Tarefa não encontrada." });
  }

  const updatedTask = await prisma.task.update({
    where: { id: task.id },
    data: { status: parsedBody.data.status },
  });

  return res.json(updatedTask);
});

tasksRouter.delete("/:id", async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  const paramsSchema = z.object({
    id: z.uuid("ID da tarefa inválido."),
  });
  const parsedParams = paramsSchema.safeParse(req.params);

  if (!parsedParams.success) {
    return res.status(400).json({
      message: "Parâmetros inválidos.",
      errors: parsedParams.error.issues.map((issue) => issue.message),
    });
  }

  const task = await prisma.task.findFirst({
    where: {
      id: parsedParams.data.id,
      userId: req.userId,
    },
  });

  if (!task) {
    return res.status(404).json({ message: "Tarefa não encontrada." });
  }

  await prisma.task.delete({ where: { id: task.id } });

  return res.status(204).send();
});

export { tasksRouter };
