import IORedis, { type RedisOptions } from "ioredis";
import { env } from "./env.js";

const baseOptions: RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

export function createRedis() {
  return new IORedis(env.REDIS_URL, baseOptions);
}

// Single shared connection for caching/pubsub
export const redis = createRedis();

redis.on("connect", () => console.log("[redis] connected"));
redis.on("error", (err) => console.error("[redis] error", err.message));
