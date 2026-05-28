"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IntroBanner } from "@/components/output/IntroBanner";
import { QuestionPaperView } from "@/components/output/QuestionPaper";
import { QuestionPaperSkeleton } from "@/components/output/QuestionPaperSkeleton";
import { AppShell } from "@/components/layout/AppShell";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MobilePageHeader } from "@/components/layout/MobilePageHeader";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { mockQuestionPaper, type QuestionPaper } from "@/lib/mock/questionPaper";
import { api, ApiError, type ApiQuestionPaper } from "@/lib/api/client";
import { useAssignmentSocket } from "@/lib/api/useAssignmentSocket";
import { toast } from "@/components/ui/Toaster";

type Status = "loading" | "generating" | "ready" | "error" | "demo";

function adapt(p: ApiQuestionPaper): QuestionPaper {
  return {
    intro: p.intro,
    school: p.school,
    subject: p.subject,
    class: p.class,
    timeAllowed: p.timeAllowed,
    maxMarks: p.maxMarks,
    instructions: p.instructions,
    sections: p.sections.map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      instruction: s.instruction,
      questions: s.questions.map((q, i) => ({
        id: `${s.id}-q${i}`,
        text: q.text,
        difficulty:
          q.difficulty as QuestionPaper["sections"][number]["questions"][number]["difficulty"],
        marks: q.marks,
      })),
    })),
    answerKey: p.answerKey,
  };
}

function OutputBody() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [status, setStatus] = useState<Status>(id ? "loading" : "demo");
  const [error, setError] = useState<string | null>(null);

  const event = useAssignmentSocket(id);

  const fetchPaper = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.getPaper(id);
      setPaper(adapt(res.paper));
      setStatus("ready");
      setError(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        // Paper not yet created — assignment is still being generated.
        setStatus("generating");
      } else {
        setStatus("error");
        setError((err as Error).message);
      }
    }
  }, [id]);

  // Initial fetch
  useEffect(() => {
    if (!id) {
      // No id means we're showing the demo state (e.g. visited route directly).
      setPaper(mockQuestionPaper);
      setStatus("demo");
      return;
    }
    fetchPaper();
  }, [id, fetchPaper]);

  // React to socket events
  useEffect(() => {
    if (!id || !event) return;
    if (event.type === "completed") {
      fetchPaper();
      toast("Question paper ready", "success");
    } else if (event.type === "processing" || event.type === "queued") {
      setStatus("generating");
    } else if (event.type === "failed") {
      setStatus("error");
      setError(event.error);
      toast(`Generation failed: ${event.error}`, "error");
    }
  }, [event, id, fetchPaper]);

  function handleDownload() {
    if (!id || status !== "ready") {
      toast("Paper isn't ready yet", "info");
      return;
    }
    window.open(api.pdfUrl(id), "_blank");
  }

  async function handleRegenerate() {
    if (!id) return;
    try {
      await api.regenerate(id);
      setStatus("generating");
      setPaper(null);
      toast("Regeneration queued", "loading");
    } catch (err) {
      toast(`Regenerate failed: ${(err as Error).message}`, "error");
    }
  }

  const intro = useMemo(() => {
    if (status === "generating" || status === "loading")
      return "Generating your customized question paper. This usually takes 5–20 seconds…";
    if (status === "error" && error) return `Generation failed: ${error}.`;
    return paper?.intro ?? "";
  }, [status, error, paper?.intro]);

  const showSkeleton = status === "loading" || status === "generating" || !paper;
  const busy = status === "loading" || status === "generating";

  return (
    <>
      {/* Desktop */}
      <AppShell topbarTitle="Create New">
        <section className="flex-1 overflow-y-auto rounded-[16px]">
          <div
            className="flex flex-col gap-3 rounded-[32px] p-5"
            style={{ background: "#5E5E5E" }}
          >
            <IntroBanner
              text={intro}
              onDownload={status === "ready" ? handleDownload : undefined}
              onRegenerate={id ? handleRegenerate : undefined}
              busy={busy}
            />
            {showSkeleton ? (
              <QuestionPaperSkeleton />
            ) : (
              <QuestionPaperView paper={paper} />
            )}
          </div>
        </section>
      </AppShell>

      {/* Mobile */}
      <div className="relative flex min-h-screen flex-col gap-3 p-3 pb-28 md:hidden">
        <MobileTopBar />
        <MobilePageHeader title="Create New" />
        <div className="flex flex-col gap-3 rounded-[40px] bg-white p-2.5">
          <IntroBanner
            text={intro}
            variant="mobile"
            onDownload={status === "ready" ? handleDownload : undefined}
            onRegenerate={id ? handleRegenerate : undefined}
            busy={busy}
          />
          {showSkeleton ? (
            <QuestionPaperSkeleton variant="mobile" />
          ) : (
            <QuestionPaperView paper={paper} variant="mobile" />
          )}
        </div>
        <div className="h-24" />
        <div className="fixed inset-x-3 bottom-3 z-20">
          <MobileBottomNav />
        </div>
      </div>
    </>
  );
}

export default function OutputPage() {
  return (
    <Suspense>
      <OutputBody />
    </Suspense>
  );
}
