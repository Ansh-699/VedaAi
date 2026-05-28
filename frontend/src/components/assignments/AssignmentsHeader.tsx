export function AssignmentsHeader() {
  return (
    <div
      className="flex flex-col gap-1 rounded-2xl px-6 py-4"
      style={{ background: "#EFEFEF" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: "#22C55E" }}
        />
        <h1
          className="text-[20px] font-bold leading-[140%] text-ink"
          style={{ letterSpacing: "-0.04em" }}
        >
          Assignments
        </h1>
      </div>
      <p
        className="pl-4 text-[14px] font-normal text-ink-muted"
        style={{ letterSpacing: "-0.02em" }}
      >
        Manage and create assignments for your classes.
      </p>
    </div>
  );
}
