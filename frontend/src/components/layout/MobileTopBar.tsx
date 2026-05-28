"use client";

import { Bell, Menu } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { toast } from "@/components/ui/Toaster";

export function MobileTopBar() {
  return (
    <header
      className="flex h-[81px] items-center gap-3 rounded-2xl bg-white px-5 py-[18px]"
      style={{
        boxShadow:
          "0 1px 2px rgba(16,24,40,0.04), 0 4px 12px -6px rgba(16,24,40,0.10)",
      }}
    >
      <Logo />

      <div className="flex-1" />

      {/* Bell */}
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => toast("No new notifications", "info")}
        className="relative grid h-9 w-9 place-items-center rounded-full"
      >
        <Bell className="h-6 w-6 text-ink" strokeWidth={2} />
        <span
          className="absolute right-[5px] top-[5px] h-2 w-2 rounded-full ring-2 ring-white"
          style={{ background: "#FF5623" }}
        />
      </button>

      {/* Avatar */}
      <button
        type="button"
        aria-label="Account"
        onClick={() => toast("Account menu coming soon", "info")}
        className="h-9 w-9 shrink-0 rounded-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/nft.png')",
          backgroundColor: "#F6F6F6",
        }}
      />

      {/* Hamburger */}
      <button
        type="button"
        aria-label="Menu"
        onClick={() => toast("Menu coming soon", "info")}
        className="grid h-9 w-9 place-items-center rounded-full"
      >
        <Menu className="h-6 w-6 text-ink" strokeWidth={2} />
      </button>
    </header>
  );
}
