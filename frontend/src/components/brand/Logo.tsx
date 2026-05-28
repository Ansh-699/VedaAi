import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-[10px]"
        style={{
          background: "linear-gradient(180deg,#D97726 0%,#C5651F 100%)",
          filter:
            "drop-shadow(0 4.28px 8.57px rgba(0,0,0,0.20)) drop-shadow(0 8.57px 17.14px rgba(0,0,0,0.10))",
        }}
        aria-hidden
      >
        {/* Stylised V with notch */}
        <svg
          width="22"
          height="16"
          viewBox="0 0 22 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0 H4.6 L8.7 9.6 L11 4.4 L13.3 9.6 L17.4 0 H22 L13.6 16 H8.4 L0 0 Z" fill="#FFFFFF" />
        </svg>
      </span>
      <span
        className="text-[28px] font-bold leading-none text-ink"
        style={{ letterSpacing: "-0.06em" }}
      >
        VedaAI
      </span>
    </div>
  );
}
