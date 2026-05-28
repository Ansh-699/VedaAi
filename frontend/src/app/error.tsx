"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <span
          className="grid h-14 w-14 place-items-center rounded-full bg-white"
          style={{ boxShadow: "0 1px 2px rgba(16,24,40,0.06)" }}
        >
          <AlertTriangle
            className="h-6 w-6"
            strokeWidth={2}
            style={{ color: "#DC2626" }}
          />
        </span>
        <h1
          className="text-[22px] font-bold leading-[140%] text-ink"
          style={{ letterSpacing: "-0.04em" }}
        >
          Something went wrong
        </h1>
        <p
          className="text-[14px] leading-[150%] text-ink-muted"
          style={{ letterSpacing: "-0.02em" }}
        >
          {error.message ||
            "An unexpected error occurred. Try again or head back to your assignments."}
        </p>
        {error.digest && (
          <p className="text-[11px] text-ink-disabled">id: {error.digest}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            <RotateCw className="h-4 w-4" strokeWidth={2} />
            Try again
          </button>
          <Link
            href="/assignments"
            className="inline-flex h-11 items-center rounded-full bg-white px-5 text-[14px] font-medium text-ink"
            style={{
              letterSpacing: "-0.02em",
              boxShadow:
                "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
            }}
          >
            Back to Assignments
          </Link>
        </div>
      </div>
    </div>
  );
}
