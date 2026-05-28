"use client";

import { cn } from "@/lib/cn";
import { ClipboardList, Library, LayoutGrid, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  label: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
    strokeWidth?: number;
  }>;
  matchPrefix?: boolean;
};

const items: Item[] = [
  { label: "Home", href: "/", icon: LayoutGrid },
  {
    label: "Assignments",
    href: "/assignments",
    icon: ClipboardList,
    matchPrefix: true,
  },
  { label: "Library", href: "/library", icon: Library },
  { label: "AI Toolkit", href: "/toolkit", icon: Sparkles },
];

export function MobileBottomNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      className="flex items-center justify-between gap-1 rounded-[28px] px-3 py-3"
      style={{
        background: "#1F1F1F",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.18)",
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.matchPrefix
          ? pathname.startsWith(item.href)
          : pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="relative flex flex-1 flex-col items-center gap-1.5 py-1"
          >
            <Icon
              className={cn(
                "h-[24px] w-[24px]",
                active ? "text-white" : "text-white/55",
              )}
              strokeWidth={active ? 2.4 : 1.8}
            />
            <span
              className={cn(
                "text-[13px] leading-none",
                active
                  ? "font-bold text-white"
                  : "font-medium text-white/55",
              )}
              style={{ letterSpacing: "-0.02em" }}
            >
              {item.label}
            </span>
            {active && (
              <span
                aria-hidden
                className="absolute -top-1 h-1 w-8 rounded-full bg-white"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
