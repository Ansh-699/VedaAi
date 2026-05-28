import { Plus } from "lucide-react";
import Link from "next/link";

export function CreateAssignmentPill({
  href = "/assignments/new",
}: {
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-[46px] items-center gap-1.5 rounded-full px-6 text-[16px] font-medium text-white transition hover:opacity-95"
      style={{
        background: "#181818",
        letterSpacing: "-0.04em",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.10), 0 12px 24px -8px rgba(0,0,0,0.25)",
      }}
    >
      <Plus className="h-5 w-5" strokeWidth={2} />
      Create Assignment
    </Link>
  );
}
