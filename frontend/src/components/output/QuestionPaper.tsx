import type { QuestionPaper } from "@/lib/mock/questionPaper";
import { cn } from "@/lib/cn";

export function QuestionPaperView({
  paper,
  variant = "desktop",
}: {
  paper: QuestionPaper;
  variant?: "desktop" | "mobile";
}) {
  const isMobile = variant === "mobile";
  const inter = "font-[var(--font-inter),system-ui,sans-serif]";

  return (
    <article
      className={cn(
        "flex flex-col rounded-[32px] bg-white text-ink",
        isMobile ? "gap-6 px-4 py-6" : "gap-6 p-8",
      )}
      style={{
        background: isMobile ? "#F6F6F6" : "#FFFFFF",
        letterSpacing: "-0.04em",
        fontFamily:
          "var(--font-inter), ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header className="flex flex-col items-center gap-0 text-center">
        <h1
          className={cn("font-bold leading-[160%]", isMobile ? "text-[20px]" : "text-[32px]")}
          style={{ letterSpacing: "-0.04em" }}
        >
          {paper.school}
        </h1>
        <p className={cn("font-semibold leading-[160%]", isMobile ? "text-[14px]" : "text-[18px]")}>Subject: {paper.subject}</p>
        <p className={cn("font-semibold leading-[160%]", isMobile ? "text-[14px]" : "text-[18px]")}>Class: {paper.class}</p>
      </header>

      {/* Time / Marks */}
      <div className={cn("flex justify-between font-semibold leading-[160%]", isMobile ? "text-[14px]" : "text-[18px]")}
      >
        <p>Time Allowed: {paper.timeAllowed}</p>
        <p>Maximum Marks: {paper.maxMarks}</p>
      </div>

      <p className={cn("font-semibold leading-[160%]", isMobile ? "text-[14px]" : "text-[18px]")}>
        {paper.instructions}
      </p>

      {/* Student info */}
      <div className={cn("flex flex-col font-semibold leading-[160%]", isMobile ? "text-[14px]" : "text-[18px]")}>
        <StudentLine label="Name" />
        <StudentLine label="Roll Number" />
        <StudentLine label={`Class: ${paper.class} Section`} />
      </div>

      {paper.sections.map((section) => (
        <section key={section.id} className="flex flex-col gap-3">
          <h2
            className={cn("text-center font-semibold leading-[160%]", isMobile ? "text-[16px]" : "text-[24px]")}
            style={{ letterSpacing: "-0.04em" }}
          >
            {section.title}
          </h2>

          <div className={cn("flex flex-col font-semibold leading-[160%]", isMobile ? "text-[14px]" : "text-[18px]")}
          >
            <p>{section.subtitle}</p>
            <p className="italic font-normal">{section.instruction}</p>
          </div>

          <ol
            className={cn(
              "flex list-decimal flex-col pl-6 font-normal",
              isMobile
                ? "text-[14px] leading-[150%] gap-2"
                : "text-[16px] leading-[240%] gap-0",
            )}
          >
            {section.questions.map((q) => (
              <li key={q.id} className="pl-1">
                [{q.difficulty}] {q.text} [{q.marks} Marks]
              </li>
            ))}
          </ol>
        </section>
      ))}

      <p className={cn("font-bold leading-[160%]", isMobile ? "text-[14px]" : "text-[18px]")}>
        End of Question Paper
      </p>

      <div className="flex flex-col gap-2">
        <h3 className={cn("font-bold leading-[160%]", isMobile ? "text-[14px]" : "text-[18px]")}>
          Answer Key:
        </h3>
        <ol
          className={cn(
            "flex list-decimal flex-col pl-6 font-normal",
            isMobile
              ? "text-[14px] leading-[150%] gap-2"
              : "text-[16px] leading-[200%] gap-2",
          )}
        >
          {paper.answerKey.map((a, i) => (
            <li key={i} className="whitespace-pre-line pl-1">
              {a}
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

function StudentLine({ label }: { label: string }) {
  return (
    <p>
      {label}:
      <span className="ml-1 inline-block w-32 border-b border-ink/70 align-bottom" />
    </p>
  );
}
