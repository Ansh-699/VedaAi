import { cn } from "@/lib/cn";

function Bar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-gradient-to-r from-[#EFEFEF] via-[#F7F7F7] to-[#EFEFEF] bg-[length:200%_100%]",
        "animate-[shimmer_1.6s_linear_infinite]",
        className,
      )}
    />
  );
}

export function QuestionPaperSkeleton({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const isMobile = variant === "mobile";

  return (
    <article
      className={cn(
        "flex flex-col rounded-[32px]",
        isMobile ? "gap-5 px-4 py-6" : "gap-6 p-8",
      )}
      style={{ background: isMobile ? "#F6F6F6" : "#FFFFFF" }}
      aria-busy="true"
      aria-live="polite"
    >
      {/* Header */}
      <header className="flex flex-col items-center gap-3">
        <Bar className={cn("h-7", isMobile ? "w-3/4" : "w-1/2")} />
        <Bar className={cn("h-4", isMobile ? "w-1/2" : "w-1/3")} />
        <Bar className={cn("h-4", isMobile ? "w-1/3" : "w-1/4")} />
      </header>

      {/* Time / Marks */}
      <div className="flex justify-between gap-6">
        <Bar className="h-4 w-1/3" />
        <Bar className="h-4 w-1/4" />
      </div>

      <Bar className="h-4 w-2/3" />

      {/* Student info */}
      <div className="flex flex-col gap-2">
        <Bar className="h-4 w-1/2" />
        <Bar className="h-4 w-1/2" />
        <Bar className="h-4 w-1/2" />
      </div>

      {/* Section A */}
      <div className="flex flex-col items-center gap-4">
        <Bar className="h-5 w-32" />
      </div>

      <div className="flex flex-col gap-2">
        <Bar className="h-4 w-1/2" />
        <Bar className="h-4 w-2/3" />
      </div>

      <ol className="flex flex-col gap-3 pl-6">
        {Array.from({ length: isMobile ? 5 : 8 }).map((_, i) => (
          <li key={i} className="flex flex-col gap-2">
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-11/12" />
          </li>
        ))}
      </ol>

      <p
        className="mt-2 text-center text-[13px] text-ink-muted"
        style={{ letterSpacing: "-0.02em" }}
      >
        Generating your question paper…
      </p>
    </article>
  );
}
