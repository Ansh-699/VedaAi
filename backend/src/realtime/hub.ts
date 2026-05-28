import type { Server } from "node:http";
import { WebSocketServer, type WebSocket } from "ws";
import { redis } from "../config/redis.js";

/**
 * Per-assignment subscription using Redis pub/sub so workers (separate process)
 * can publish progress and the API server forwards to its connected clients.
 */
type Client = {
  ws: WebSocket;
  assignmentId: string;
};

const REDIS_CHANNEL = "vedai:assignment:progress";
const clients = new Set<Client>();

export function attachWebsocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url ?? "", "http://localhost");
    const assignmentId = url.searchParams.get("assignmentId") ?? "";
    if (!assignmentId) {
      ws.close(1008, "assignmentId is required");
      return;
    }
    const client: Client = { ws, assignmentId };
    clients.add(client);
    ws.on("close", () => clients.delete(client));
    ws.send(JSON.stringify({ type: "connected", assignmentId }));
  });

  // Subscribe to redis pub/sub once
  const sub = redis.duplicate();
  sub.subscribe(REDIS_CHANNEL).catch((err) =>
    console.error("[ws] subscribe error", err.message),
  );
  sub.on("message", (_channel, payload) => {
    let msg: { assignmentId: string };
    try {
      msg = JSON.parse(payload);
    } catch {
      return;
    }
    for (const c of clients) {
      if (c.ws.readyState === c.ws.OPEN && c.assignmentId === msg.assignmentId) {
        c.ws.send(payload);
      }
    }
  });

  console.log("[ws] websocket listening on /ws");
}

/**
 * Called by workers / services to broadcast a progress message to subscribers.
 */
export type ProgressEvent = {
  type: "queued" | "processing" | "completed" | "failed";
  assignmentId: string;
  progress?: number;
  resultId?: string;
  error?: string;
};

export async function publishProgress(event: ProgressEvent) {
  await redis.publish(REDIS_CHANNEL, JSON.stringify(event));
}
