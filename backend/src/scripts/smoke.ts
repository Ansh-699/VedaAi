/**
 * Connectivity smoke test:
 *   1. Mongo  — connect + ping
 *   2. Redis  — set/get a key
 *   3. Kiro   — invoke `kiro-cli chat --no-interactive` in headless mode
 *
 * Usage:  npm --workspace backend run smoke
 */
import { spawn } from "node:child_process";
import { connectMongo } from "../config/db.js";
import { redis } from "../config/redis.js";
import { env } from "../config/env.js";
import mongoose from "mongoose";

async function checkMongo() {
  await connectMongo();
  await mongoose.connection.db?.admin().ping();
  console.log("✓ mongo ok");
}

async function checkRedis() {
  await redis.set("vedai:smoke", "ok", "EX", 30);
  const v = await redis.get("vedai:smoke");
  if (v !== "ok") throw new Error(`unexpected redis value: ${v}`);
  console.log("✓ redis ok");
}

async function checkKiro() {
  if (!env.KIRO_API_KEY) {
    console.log("- kiro skipped (no key)");
    return;
  }
  const text = await new Promise<string>((resolve, reject) => {
    const child = spawn(
      "kiro-cli",
      ["chat", "--no-interactive", 'Reply with the single word: pong'],
      {
        env: { ...process.env, KIRO_API_KEY: env.KIRO_API_KEY },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    const out: Buffer[] = [];
    const err: Buffer[] = [];
    child.stdout.on("data", (d: Buffer) => out.push(d));
    child.stderr.on("data", (d: Buffer) => err.push(d));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0)
        reject(
          new Error(
            `kiro-cli exited ${code}: ${Buffer.concat(err).toString("utf8")}`,
          ),
        );
      else resolve(Buffer.concat(out).toString("utf8"));
    });
  });
  const summary = text
    .split(/\r?\n/)
    .filter((l) => l.trim() && !/WARNING:|Credits:/.test(l))
    .slice(0, 1)
    .join(" ")
    .slice(0, 80);
  console.log(`✓ kiro ok (response: ${summary})`);
}

async function main() {
  let exit = 0;
  for (const [name, fn] of Object.entries({
    mongo: checkMongo,
    redis: checkRedis,
    kiro: checkKiro,
  })) {
    try {
      await fn();
    } catch (err) {
      console.error(`✗ ${name} failed:`, (err as Error).message);
      exit = 1;
    }
  }
  await mongoose.disconnect();
  redis.disconnect();
  process.exit(exit);
}

main();
