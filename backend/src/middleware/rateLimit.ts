import type { RequestHandler } from "express";
import { redis } from "../config/redis.js";

/**
 * Per-IP fixed-window rate limit backed by Redis.
 *
 * INCR a key, set TTL on first hit, reject when count exceeds `max`.
 * Sets standard X-RateLimit-* response headers.
 */
export function rateLimit({
  windowSec,
  max,
  keyPrefix,
}: {
  windowSec: number;
  max: number;
  keyPrefix: string;
}): RequestHandler {
  return async (req, res, next) => {
    const ip =
      (req.headers["x-forwarded-for"] as string | undefined)
        ?.split(",")[0]
        ?.trim() ||
      req.socket.remoteAddress ||
      "unknown";
    const key = `rl:${keyPrefix}:${ip}`;

    try {
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, windowSec);
      const ttl = await redis.ttl(key);

      res.setHeader("X-RateLimit-Limit", String(max));
      res.setHeader(
        "X-RateLimit-Remaining",
        String(Math.max(0, max - count)),
      );
      res.setHeader(
        "X-RateLimit-Reset",
        String(Math.floor(Date.now() / 1000) + (ttl > 0 ? ttl : windowSec)),
      );

      if (count > max) {
        res.setHeader("Retry-After", String(ttl > 0 ? ttl : windowSec));
        return res.status(429).json({
          error: "rate_limited",
          message: `Too many requests. Try again in ${ttl > 0 ? ttl : windowSec}s.`,
        });
      }
      next();
    } catch (err) {
      // If Redis is down, fail open rather than blocking everything.
      console.warn("[rate-limit] redis error, allowing request:", (err as Error).message);
      next();
    }
  };
}
