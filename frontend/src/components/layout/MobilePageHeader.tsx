"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function MobilePageHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <div className="relative flex items-center gap-3 px-1 py-1">
      <button
        type="button"
        aria-label="Back"
        onClick={() => router.back()}
        className="grid h-12 w-12 place-items-center rounded-full"
        style={{ background: "rgba(255,255,255,0.7)" }}
      >
        <ArrowLeft className="h-6 w-6 text-ink" strokeWidth={2.5} />
      </button>
      <h1
        className="absolute inset-x-0 text-center text-[16px] font-bold text-ink"
        style={{ letterSpacing: "-0.04em" }}
      >
        {title}
      </h1>
    </div>
  );
}
