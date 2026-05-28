export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: "#22C55E" }}
        />
        <h1
          className="text-[20px] font-bold leading-[140%] text-ink"
          style={{ letterSpacing: "-0.04em" }}
        >
          {title}
        </h1>
      </div>
      {subtitle && (
        <p
          className="pl-4 text-[14px] font-normal text-ink-muted"
          style={{ letterSpacing: "-0.02em" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
