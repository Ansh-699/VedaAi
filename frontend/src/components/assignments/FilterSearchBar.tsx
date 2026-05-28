"use client";

import { Search, SlidersHorizontal } from "lucide-react";

export function FilterSearchBar({
  variant = "desktop",
  query,
  onQueryChange,
  onFilterClick,
}: {
  variant?: "desktop" | "mobile";
  query?: string;
  onQueryChange?: (q: string) => void;
  onFilterClick?: () => void;
}) {
  if (variant === "mobile") {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onFilterClick}
          className="flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-[14px] font-medium text-ink"
          style={{
            letterSpacing: "-0.02em",
            boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
          }}
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
          Filter
        </button>
        <label className="flex h-11 flex-1 items-center gap-2 rounded-xl bg-white px-4">
          <Search className="h-4 w-4 text-ink-muted" strokeWidth={2} />
          <input
            type="search"
            value={query ?? ""}
            onChange={(e) => onQueryChange?.(e.target.value)}
            placeholder="Search Name"
            className="flex-1 bg-transparent text-[14px] font-normal text-ink placeholder:text-ink-muted focus:outline-none"
            style={{ letterSpacing: "-0.02em" }}
          />
        </label>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-3">
      <button
        type="button"
        onClick={onFilterClick}
        className="flex items-center gap-2 text-[14px] font-medium text-ink-muted hover:text-ink"
        style={{ letterSpacing: "-0.02em" }}
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
        Filter By
      </button>

      <label className="flex h-9 w-[320px] items-center gap-2 rounded-full bg-surface-soft px-4">
        <Search className="h-4 w-4 text-ink-muted" strokeWidth={2} />
        <input
          type="search"
          value={query ?? ""}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder="Search Assignment"
          className="flex-1 bg-transparent text-[14px] font-normal text-ink placeholder:text-ink-muted focus:outline-none"
          style={{ letterSpacing: "-0.02em" }}
        />
      </label>
    </div>
  );
}
