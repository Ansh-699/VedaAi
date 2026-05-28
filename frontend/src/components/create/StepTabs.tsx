"use client";

import { cn } from "@/lib/cn";

/**
 * Two-segment progress bar. `active` is the 0-indexed segment currently
 * being filled (default 0 = first half black, second half grey).
 */
export function StepTabs({
  active = 0,
  total = 2,
}: {
  active?: number;
  total?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-[3px] flex-1 rounded-full",
            i <= active ? "bg-ink" : "bg-line-soft",
          )}
          style={{
            background: i <= active ? "#181818" : "#E0E0E0",
          }}
        />
      ))}
    </div>
  );
}
