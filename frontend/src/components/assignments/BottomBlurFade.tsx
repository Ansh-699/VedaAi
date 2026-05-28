"use client";

import { cn } from "@/lib/cn";

/**
 * Lightweight bottom fade — single layer using a CSS gradient instead of
 * stacked `backdrop-filter: blur()` regions. The progressive blur stack
 * was very expensive on integrated GPUs and could lock up the desktop.
 */
export function BottomBlurFade({
  height = 160,
  position = "absolute",
  className,
}: {
  height?: number;
  position?: "absolute" | "fixed";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none inset-x-0 bottom-0 z-10",
        position === "fixed" ? "fixed" : "absolute",
        className,
      )}
      style={{
        height,
        background:
          "linear-gradient(to bottom, rgba(239,239,239,0) 0%, rgba(239,239,239,0.55) 55%, rgba(239,239,239,0.92) 100%)",
      }}
    />
  );
}
