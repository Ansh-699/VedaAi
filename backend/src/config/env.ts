import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// Load .env from the monorepo root so backend + worker share config.
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../..");
dotenv.config({ path: path.join(repoRoot, ".env") });
// backend/.env can override.
dotenv.config({ path: path.join(repoRoot, "backend", ".env") });

function need(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (v === undefined) {
    throw new Error(`Missing env var: ${name}`);
  }
  return v;
}

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  MONGODB_URI: need("MONGODB_URI", "mongodb://localhost:27017/vedai"),
  REDIS_URL: need("REDIS_URL", "redis://localhost:6379"),
  AI_PROVIDER: (process.env.AI_PROVIDER ?? "kiro") as "kiro" | "mock",
  KIRO_API_KEY: process.env.KIRO_API_KEY ?? "",
  KIRO_MODEL: process.env.KIRO_MODEL ?? "",
  WORKER_CONCURRENCY: Number(process.env.WORKER_CONCURRENCY ?? 2),
};
