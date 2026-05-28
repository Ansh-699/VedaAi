"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

export function MobileFab({ href = "/assignments/new" }: { href?: string }) {
  return (
    <Link
      href={href}
      aria-label="Create assignment"
      className="grid h-12 w-12 place-items-center rounded-full bg-white"
      style={{
        boxShadow:
          "0 1px 2px rgba(16,24,40,0.06), 0 8px 20px -6px rgba(16,24,40,0.18)",
      }}
    >
      <Plus className="h-6 w-6" strokeWidth={2.4} style={{ color: "#FF5623" }} />
    </Link>
  );
}
