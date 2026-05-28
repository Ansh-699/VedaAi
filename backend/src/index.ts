import http from "node:http";
import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { connectMongo } from "./config/db.js";
import { redis } from "./config/redis.js";
import { attachWebsocket } from "./realtime/hub.js";
import assignmentsRouter from "./routes/assignments.js";
import pdfRouter from "./routes/pdf.js";

async function main() {
  await connectMongo();
  await redis.ping();

  const app = express();
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "5mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/assignments", assignmentsRouter);
  app.use("/api/assignments", pdfRouter);

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error("[error]", err);
    res
      .status(500)
      .json({ error: "internal", message: err.message ?? "Server error" });
  };
  app.use(errorHandler);

  const server = http.createServer(app);
  attachWebsocket(server);

  server.listen(env.PORT, () => {
    console.log(`[api] http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
