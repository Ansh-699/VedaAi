"use client";

import { ChevronDown, Minus, Plus, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type QuestionTypeValue =
  | "Multiple Choice Questions"
  | "Short Questions"
  | "Diagram/Graph-Based Questions"
  | "Numerical Problems"
  | "Long Answer";

export type QuestionRow = {
  id: string;
  type: string;
  count: number;
  marks: number;
};

export function Stepper({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 w-[112px] items-center justify-between rounded-full bg-white px-3",
        className,
      )}
      style={{
        boxShadow:
          "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
      }}
    >
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="text-ink-muted hover:text-ink"
      >
        <Minus className="h-4 w-4" strokeWidth={2.4} />
      </button>
      <span
        className="text-[15px] font-bold text-ink"
        style={{ letterSpacing: "-0.02em" }}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase"
        onClick={() => onChange(value + 1)}
        className="text-ink-muted hover:text-ink"
      >
        <Plus className="h-4 w-4" strokeWidth={2.4} />
      </button>
    </div>
  );
}

export function QuestionTypeRow({
  row,
  onChange,
  onRemove,
}: {
  row: QuestionRow;
  onChange: (next: QuestionRow) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Pill select */}
      <label
        className="flex h-11 flex-1 items-center gap-2 rounded-full bg-white px-5"
        style={{
          boxShadow:
            "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
        }}
      >
        <select
          value={row.type}
          onChange={(e) =>
            onChange({ ...row, type: e.target.value })
          }
          className="flex-1 appearance-none bg-transparent text-[14px] text-ink focus:outline-none"
          style={{ letterSpacing: "-0.02em" }}
        >
          <option>Multiple Choice Questions</option>
          <option>Short Questions</option>
          <option>Diagram/Graph-Based Questions</option>
          <option>Numerical Problems</option>
          <option>Long Answer</option>
        </select>
        <ChevronDown className="h-4 w-4 text-ink-muted" strokeWidth={2} />
      </label>

      <button
        type="button"
        aria-label="Remove"
        onClick={onRemove}
        className="grid h-9 w-9 shrink-0 place-items-center text-ink-muted hover:text-ink"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>

      <Stepper
        value={row.count}
        onChange={(v) => onChange({ ...row, count: v })}
      />
      <Stepper
        value={row.marks}
        onChange={(v) => onChange({ ...row, marks: v })}
      />
    </div>
  );
}
