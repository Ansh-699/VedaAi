import Image from "next/image";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/vedaai.png"
        alt="VedaAI logo"
        width={40}
        height={40}
        priority
        className="h-10 w-10 shrink-0 select-none rounded-[10px]"
        style={{
          filter:
            "drop-shadow(0 4.28px 8.57px rgba(0,0,0,0.20)) drop-shadow(0 8.57px 17.14px rgba(0,0,0,0.10))",
        }}
      />
      <span
        className="text-[28px] font-bold leading-none text-ink"
        style={{ letterSpacing: "-0.06em" }}
      >
        VedaAI
      </span>
    </div>
  );
}
