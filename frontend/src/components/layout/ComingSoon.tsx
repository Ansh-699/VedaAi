"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { AppShell } from "./AppShell";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobilePageHeader } from "./MobilePageHeader";
import { MobileTopBar } from "./MobileTopBar";

export function ComingSoon({
  title,
  description,
  topbarTitle,
}: {
  title: string;
  description: string;
  topbarTitle: string;
}) {
  const content = (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <span
          className="grid h-14 w-14 place-items-center rounded-full bg-white"
          style={{ boxShadow: "0 1px 2px rgba(16,24,40,0.06)" }}
        >
          <Sparkles className="h-6 w-6 text-brand" strokeWidth={2} />
        </span>
        <h2
          className="text-[22px] font-bold leading-[140%] text-ink"
          style={{ letterSpacing: "-0.04em" }}
        >
          {title}
        </h2>
        <p
          className="text-[15px] leading-[150%] text-ink-muted"
          style={{ letterSpacing: "-0.02em" }}
        >
          {description}
        </p>
        <Link
          href="/assignments"
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-[14px] font-medium text-white hover:opacity-95"
          style={{ letterSpacing: "-0.02em" }}
        >
          Back to Assignments
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <AppShell topbarTitle={topbarTitle}>
        <section className="flex flex-1 items-center justify-center overflow-hidden rounded-[16px] bg-white/40">
          {content}
        </section>
      </AppShell>

      <div className="relative flex min-h-screen flex-col gap-3 p-3 pb-28 md:hidden">
        <MobileTopBar />
        <MobilePageHeader title={topbarTitle} />
        <div className="flex flex-1 items-center justify-center">{content}</div>
        <div className="fixed inset-x-3 bottom-3 z-20">
          <MobileBottomNav />
        </div>
      </div>
    </>
  );
}
