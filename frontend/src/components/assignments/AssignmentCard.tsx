"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical, Trash2, Eye, Download } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { api } from "@/lib/api/client";
import { toast } from "@/components/ui/Toaster";

export type Assignment = {
  id: string;
  title: string;
  assignedOn: string;
  due: string;
};

export function AssignmentCard({
  assignment,
  onDeleted,
  className,
}: {
  assignment: Assignment;
  onDeleted?: (id: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function handleDelete() {
    setOpen(false);
    try {
      await api.deleteAssignment(assignment.id);
      onDeleted?.(assignment.id);
      toast("Assignment deleted", "success");
    } catch (err) {
      toast(`Delete failed: ${(err as Error).message}`, "error");
    }
  }

  function handleDownload() {
    setOpen(false);
    window.open(api.pdfUrl(assignment.id), "_blank");
  }

  return (
    <article
      className={cn(
        "relative flex min-h-[160px] flex-col justify-between gap-8 rounded-2xl bg-white p-6 transition hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_12px_28px_-12px_rgba(16,24,40,0.18)]",
        className,
      )}
      style={{
        boxShadow:
          "0 1px 2px rgba(16,24,40,0.04), 0 8px 24px -16px rgba(16,24,40,0.10)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/assignments/output?id=${assignment.id}`}
          className="text-[20px] font-bold leading-[140%] text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink/50"
          style={{ letterSpacing: "-0.04em" }}
        >
          {assignment.title}
        </Link>

        <div className="relative" ref={ref}>
          <button
            type="button"
            aria-label="More options"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-7 w-7 place-items-center rounded-full text-ink-muted hover:bg-surface-muted"
          >
            <MoreVertical className="h-5 w-5" strokeWidth={2} />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 top-full z-30 mt-1 w-[200px] overflow-hidden rounded-xl bg-white py-1"
              style={{
                boxShadow:
                  "0 4px 12px rgba(16,24,40,0.08), 0 24px 48px -12px rgba(16,24,40,0.18)",
              }}
            >
              <Link
                href={`/assignments/output?id=${assignment.id}`}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] font-medium text-ink hover:bg-surface-muted"
                style={{ letterSpacing: "-0.02em" }}
              >
                <Eye className="h-4 w-4" strokeWidth={2} />
                View Assignment
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={handleDownload}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] font-medium text-ink hover:bg-surface-muted"
                style={{ letterSpacing: "-0.02em" }}
              >
                <Download className="h-4 w-4" strokeWidth={2} />
                Download PDF
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleDelete}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] font-medium hover:bg-red-50"
                style={{ color: "#FF4040", letterSpacing: "-0.02em" }}
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="flex items-center justify-between text-[14px]"
        style={{ letterSpacing: "-0.02em" }}
      >
        <p className="text-ink-muted">
          <span className="font-bold text-ink">Assigned on</span> :{" "}
          {assignment.assignedOn}
        </p>
        <p className="text-ink-muted">
          <span className="font-bold text-ink">Due</span> : {assignment.due}
        </p>
      </div>
    </article>
  );
}
