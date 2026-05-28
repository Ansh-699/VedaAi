"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

/**
 * Desktop shell: sidebar is fixed (not scrollable with the page), main column scrolls.
 */
export function AppShell({
  topbarTitle,
  children,
}: {
  topbarTitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="hidden h-screen gap-3 overflow-hidden p-3 md:flex">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden">
        <Topbar title={topbarTitle} />
        {children}
      </main>
    </div>
  );
}
