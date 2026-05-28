"use client";

import { useEffect, useState } from "react";

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:4000/ws";

export type ProgressEvent =
  | { type: "connected"; assignmentId: string }
  | { type: "queued"; assignmentId: string }
  | { type: "processing"; assignmentId: string; progress?: number }
  | { type: "completed"; assignmentId: string; resultId: string }
  | { type: "failed"; assignmentId: string; error: string }
  | { type: "disconnected"; assignmentId: string };

/**
 * Subscribe to a single assignment's lifecycle. Auto-reconnects with
 * exponential backoff (1s → 2s → 4s … capped at 15s) so the UI doesn't
 * get stuck if the API restarts during dev.
 */
export function useAssignmentSocket(assignmentId: string | null) {
  const [event, setEvent] = useState<ProgressEvent | null>(null);

  useEffect(() => {
    if (!assignmentId) return;

    let ws: WebSocket | null = null;
    let cancelled = false;
    let attempt = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const url = `${WS_BASE}?assignmentId=${encodeURIComponent(assignmentId)}`;

    function connect() {
      if (cancelled) return;
      try {
        ws = new WebSocket(url);
      } catch {
        scheduleReconnect();
        return;
      }
      ws.onopen = () => {
        attempt = 0; // reset backoff on a clean connection
      };
      ws.onmessage = (e) => {
        if (cancelled) return;
        try {
          setEvent(JSON.parse(e.data) as ProgressEvent);
        } catch {
          /* ignore malformed frames */
        }
      };
      ws.onclose = () => {
        if (cancelled) return;
        setEvent({ type: "disconnected", assignmentId: assignmentId ?? "" });
        scheduleReconnect();
      };
      ws.onerror = () => {
        // onclose will fire next; let it handle reconnect
      };
    }

    function scheduleReconnect() {
      if (cancelled) return;
      const delay = Math.min(15_000, 1000 * 2 ** attempt);
      attempt++;
      reconnectTimer = setTimeout(connect, delay);
    }

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [assignmentId]);

  return event;
}
