"use client";

import { cn } from "@/lib/cn";

const steps = ["Assignment Details", "Question Configuration", "Review"];

export function StepTabs({ active = 0 }: { active?: number }) {
  return (
    <div className="flex items-center gap-0 border-b border-line-soft">
      {steps.map((label, i) => {
        const isActive = i === active;
        return (
          <div
            key={label}
            className={cn(
              "relative flex-1 px-4 py-3 text-center text-[14px] font-medium transition",
              isActive ? "text-ink" : "text-ink-muted",
            )}
            style={{ letterSpacing: "-0.02em" }}
          >
            <span className="hidden">{label}</span>
            {isActive && (
              <span
                className="absolute inset-x-0 -bottom-px h-[3px] rounded-full"
                style={{ background: "#FF5623" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
