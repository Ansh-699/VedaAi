"use client";

import { DownloadIcon } from "@/components/icons/SidebarIcons";

type Props = {
  text: string;
  variant?: "desktop" | "mobile";
  onDownload?: () => void;
  busy?: boolean;
};

export function IntroBanner({
  text,
  variant = "desktop",
  onDownload,
  busy,
}: Props) {
  if (variant === "mobile") {
    return (
      <div
        className="flex flex-col gap-3 rounded-[32px] px-4 py-6"
        style={{
          background: "#303030",
          boxShadow:
            "0 16px 48px rgba(0,0,0,0.12), 0 32px 48px rgba(0,0,0,0.20)",
        }}
      >
        <p
          className="text-[14px] font-bold leading-[120%]"
          style={{ color: "#F0F0F0", letterSpacing: "-0.04em" }}
        >
          {text}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Download as PDF"
            onClick={onDownload}
            disabled={busy || !onDownload}
            className="grid h-9 w-9 place-items-center rounded-full disabled:opacity-50"
            style={{ background: "rgba(246,246,246,0.1)" }}
          >
            <DownloadIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-6 rounded-[32px] px-8 py-6 text-white"
      style={{ background: "rgba(24,24,24,0.8)" }}
    >
      <p
        className="text-[20px] font-bold leading-[140%]"
        style={{ letterSpacing: "-0.04em" }}
      >
        {text}
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDownload}
          disabled={busy || !onDownload}
          className="inline-flex h-11 items-center gap-1 rounded-full bg-white px-6 text-[16px] font-medium text-ink hover:bg-white/95 disabled:opacity-60"
          style={{ letterSpacing: "-0.04em" }}
        >
          <DownloadIcon className="h-5 w-5" />
          Download as PDF
        </button>
      </div>
    </div>
  );
}
