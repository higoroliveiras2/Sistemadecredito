import "dotenv/config";
import cors from "cors";
import express from "express";

import { authRouter } from "./routes/auth";
import { tasksRouter } from "./routes/tasks";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRouter);
app.use("/tasks", tasksRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  return res.status(500).json({ message: "Erro interno do servidor." });
});

const port = Number(process.env.PORT ?? 3333);
app.listen(port, () => {
  console.log(`TaskFlow API running on port ${port}`);
});
