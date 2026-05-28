"use client";

import { ArrowLeft, Bell, ChevronDown, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import { avatars } from "@/lib/avatars";
import { toast } from "@/components/ui/Toaster";

export function Topbar({ title }: { title: string }) {
  const router = useRouter();

  return (
    <header
      className="flex h-14 items-center gap-3 rounded-[16px] pl-6 pr-3"
      style={{ background: "rgba(255,255,255,0.85)" }}
    >
      <button
        type="button"
        aria-label="Back"
        onClick={() => router.back()}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white"
      >
        <ArrowLeft className="h-5 w-5 text-ink" strokeWidth={2} />
      </button>

      <div className="flex items-center gap-2 text-ink-disabled">
        <LayoutGrid className="h-5 w-5" strokeWidth={2} />
        <span
          className="text-[16px] font-semibold"
          style={{ letterSpacing: "-0.04em" }}
        >
          {title}
        </span>
      </div>

      <div className="flex-1" />

      <button
        type="button"
        aria-label="Notifications"
        onClick={() => toast("No new notifications", "info")}
        className="relative grid h-9 w-9 place-items-center rounded-full bg-surface-soft hover:bg-surface-muted"
      >
        <Bell className="h-[22px] w-[22px] text-ink" strokeWidth={2} />
        <span
          className="absolute right-[7px] top-[6px] h-2 w-2 rounded-full"
          style={{ background: "#FF5623" }}
        />
      </button>

      <button
        type="button"
        onClick={() => toast("Account menu coming soon", "info")}
        className="flex h-11 items-center gap-2 rounded-[12px] bg-white pl-1 pr-3 hover:bg-surface-soft"
        style={{
          boxShadow:
            "0 1px 2px rgba(16,24,40,0.05), 0 4px 12px -4px rgba(16,24,40,0.10)",
        }}
      >
        <span
          className="h-8 w-8 shrink-0 rounded-full bg-cover bg-center"
          style={{
            backgroundImage: `url('${avatars.user("John Doe")}')`,
            backgroundColor: "#F6F6F6",
          }}
          aria-hidden
        />
        <span
          className="text-[16px] font-semibold text-ink"
          style={{ letterSpacing: "-0.04em" }}
        >
          John Doe
        </span>
        <ChevronDown className="h-4 w-4 text-ink" strokeWidth={2} />
      </button>
    </header>
  );
}
