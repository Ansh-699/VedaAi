"use client";

import { useEffect } from "react";
import { Logo } from "@/components/brand/Logo";
import { avatars } from "@/lib/avatars";
import { cn } from "@/lib/cn";
import { useAssignments } from "@/lib/store/assignmentsStore";
import {
  BookText,
  ClipboardList,
  Home,
  LibraryBig,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
    size?: number;
    strokeWidth?: number;
  }>;
  /** If "assignments", the badge value comes from the live store. */
  badgeKey?: "assignments";
  matchPrefix?: boolean;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "My Groups", href: "/groups", icon: Users },
  {
    label: "Assignments",
    href: "/assignments",
    icon: ClipboardList,
    badgeKey: "assignments",
    matchPrefix: true,
  },
  { label: "AI Teacher's Toolkit", href: "/toolkit", icon: BookText },
  { label: "My Library", href: "/library", icon: LibraryBig },
];

function isActive(pathname: string, item: NavItem) {
  if (item.matchPrefix) return pathname.startsWith(item.href);
  return pathname === item.href;
}

export function Sidebar() {
  const pathname = usePathname() ?? "/";
  const assignmentsCount = useAssignments((s) => s.count);
  const refreshAssignments = useAssignments((s) => s.refresh);

  useEffect(() => {
    refreshAssignments();
  }, [refreshAssignments]);

  return (
    <aside
      className="flex w-[304px] shrink-0 flex-col rounded-[16px] bg-white p-6"
      style={{
        height: "calc(100vh - 24px)",
        boxShadow:
          "0 16px 48px rgba(0,0,0,0.12), 0 32px 48px rgba(0,0,0,0.20)",
      }}
    >
      {/* TOP CLUSTER */}
      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-16">
          <Logo />

          <div
            className="rounded-full p-[3px]"
            style={{ background: "#FD8B67" }}
          >
            <Link
              href="/assignments/new"
              className="relative flex h-[42px] w-full items-center justify-center gap-2 rounded-full text-white"
              style={{
                background: "#181818",
                boxShadow:
                  "inset 0 -1px 3.5px rgba(177,177,177,0.6), inset 0 0 34.5px rgba(255,255,255,0.25)",
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "16px",
                letterSpacing: "-0.04em",
              }}
            >
              <Sparkles
                className="h-[18px] w-[18px]"
                style={{ color: "#FF7A3A" }}
              />
              Create Assignment
            </Link>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex h-[38px] items-center gap-2 rounded-lg px-3 text-[16px]",
                  active
                    ? "bg-surface-muted font-medium text-ink"
                    : "font-normal text-ink-muted hover:bg-surface-muted/60",
                )}
                style={{ letterSpacing: "-0.04em" }}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  strokeWidth={active ? 2 : 1.75}
                />
                <span className="flex-1">{item.label}</span>
                {item.badgeKey === "assignments" &&
                  assignmentsCount !== null &&
                  assignmentsCount > 0 && (
                    <span
                      className="inline-flex h-5 items-center justify-center rounded-full px-2.5 text-[14px] font-semibold leading-none text-white"
                      style={{
                        background: "#FF5623",
                        letterSpacing: "-0.04em",
                        boxShadow: "inset 0 0 32px rgba(255,161,10,0.25)",
                      }}
                    >
                      {assignmentsCount}
                    </span>
                  )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1" />

      {/* BOTTOM CLUSTER */}
      <div className="flex flex-col gap-2">
        <Link
          href="/settings"
          className={cn(
            "flex h-[38px] items-center gap-2 rounded-lg px-3 text-[16px] font-normal",
            pathname === "/settings"
              ? "bg-surface-muted text-ink"
              : "text-ink-muted hover:bg-surface-muted/60",
          )}
          style={{ letterSpacing: "-0.04em" }}
        >
          <Settings className="h-5 w-5" strokeWidth={1.75} />
          <span>Settings</span>
        </Link>

        <div
          className="flex items-center gap-2 rounded-2xl p-3"
          style={{ background: "#E7E7E7" }}
        >
          <div
            className="h-14 w-[59px] shrink-0 rounded-xl bg-cover bg-center"
            style={{
              backgroundImage: `url('${avatars.nft("Delhi Public School Bokaro")}')`,
              backgroundColor: "#FFFFFF",
            }}
            aria-hidden
          />
          <div className="min-w-0">
            <p
              className="truncate text-[16px] font-bold leading-[140%] text-ink"
              style={{ letterSpacing: "-0.04em" }}
            >
              Delhi Public School
            </p>
            <p
              className="truncate text-[14px] font-normal leading-[140%]"
              style={{ color: "#5E5E5E", letterSpacing: "-0.04em" }}
            >
              Bokaro Steel City
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
