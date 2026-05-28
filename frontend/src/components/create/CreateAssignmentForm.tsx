"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, Mic, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FileDropzone } from "./FileDropzone";
import { QuestionTypeRow } from "./QuestionTypeRow";
import { StepTabs } from "./StepTabs";
import { useCreateAssignment } from "@/lib/store/createAssignmentStore";
import { useSettings } from "@/lib/store/settingsStore";
import { api, ApiError } from "@/lib/api/client";
import { toast } from "@/components/ui/Toaster";

// Module-level guards so StrictMode double-invocation doesn't double-toast.
let draftToastShown = false;
let defaultsSeeded = false;

export function CreateAssignmentForm() {
  const router = useRouter();
  const state = useCreateAssignment();
  const settings = useSettings();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const mountedRef = useRef(false);

  // Seed defaults from Settings on a fresh blank form (once per page load).
  useEffect(() => {
    if (defaultsSeeded) return;
    defaultsSeeded = true;
    if (state.title || state.subject || state.grade) return;
    if (settings.defaultSubject && !state.subject) {
      state.setField("subject", settings.defaultSubject);
    }
    if (settings.defaultGrade && !state.grade) {
      state.setField("grade", settings.defaultGrade);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show "We saved your draft" once per page load if draft exists.
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    if (draftToastShown) return;
    draftToastShown = true;
    if (!state.draftAcknowledged && state.hasDraft()) {
      toast(
        "We saved your draft — pick up where you left off",
        "info",
      );
    }
    state.acknowledgeDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = useMemo(() => {
    const totalQuestions = state.rows.reduce((s, r) => s + r.count, 0);
    const totalMarks = state.rows.reduce((s, r) => s + r.count * r.marks, 0);
    return { totalQuestions, totalMarks };
  }, [state.rows]);

  async function handleSubmit() {
    setSubmitError(null);
    if (!state.validate()) return;
    state.setField("isSubmitting", true);
    try {
      const res = await api.createAssignment({
        title: state.title || "Untitled assignment",
        subject: state.subject,
        grade: state.grade,
        dueDate: new Date(state.dueDate).toISOString(),
        questionTypes: state.rows.map(({ type, count, marks }) => ({
          type,
          count,
          marks,
        })),
        additionalInstructions: state.additionalInstructions,
        sourceText: state.sourceText,
      });
      const id = res.assignment._id;
      state.setField("submittedAssignmentId", id);
      state.reset();
      router.push(`/assignments/output?id=${id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message);
      } else {
        setSubmitError((err as Error).message ?? "Submission failed");
      }
    } finally {
      state.setField("isSubmitting", false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <StepTabs active={0} />

      <section
        className="flex flex-col gap-6 rounded-3xl p-6"
        style={{ background: "#EFEFEF" }}
      >
        <div className="flex flex-col gap-1">
          <h2
            className="text-[18px] font-bold text-ink"
            style={{ letterSpacing: "-0.04em" }}
          >
            Assignment Details
          </h2>
          <p
            className="text-[14px] text-ink-muted"
            style={{ letterSpacing: "-0.02em" }}
          >
            Basic information about your assignment
          </p>
        </div>

        {/* Title (single line, optional but recommended) */}
        <div className="flex flex-col gap-2">
          <label
            className="text-[14px] font-medium text-ink"
            style={{ letterSpacing: "-0.02em" }}
          >
            Title
          </label>
          <div
            className="flex h-12 items-center rounded-full bg-white px-5"
            style={{
              boxShadow:
                "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
            }}
          >
            <input
              value={state.title}
              onChange={(e) => state.setField("title", e.target.value)}
              placeholder="e.g., Quiz on Electricity"
              className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink-muted focus:outline-none"
              style={{ letterSpacing: "-0.02em" }}
            />
          </div>
          {state.errors.title && (
            <p className="text-[12px] text-red-600">{state.errors.title}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <FileDropzone />
          <p
            className="text-center text-[13px] text-ink-muted"
            style={{ letterSpacing: "-0.02em" }}
          >
            Upload images of your preferred document/image
          </p>
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-2">
          <label
            className="text-[14px] font-medium text-ink"
            style={{ letterSpacing: "-0.02em" }}
          >
            Due Date
          </label>
          <div
            className="flex h-12 items-center gap-2 rounded-full bg-white px-5"
            style={{
              boxShadow:
                "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
            }}
          >
            <input
              type="date"
              value={state.dueDate}
              onChange={(e) => state.setField("dueDate", e.target.value)}
              className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink-muted focus:outline-none"
              style={{ letterSpacing: "-0.02em" }}
            />
            <Calendar className="h-4 w-4 text-ink-muted" strokeWidth={2} />
          </div>
          {state.errors.dueDate && (
            <p className="text-[12px] text-red-600">{state.errors.dueDate}</p>
          )}
        </div>

        {/* Question Type */}
        <div className="flex flex-col gap-3">
          <div
            className="grid items-end gap-3 text-[14px] font-medium text-ink"
            style={{
              gridTemplateColumns: "1fr 36px 112px 112px",
              letterSpacing: "-0.02em",
            }}
          >
            <span className="underline decoration-ink/20 underline-offset-4">
              Question Type
            </span>
            <span />
            <span className="text-center">No. of Questions</span>
            <span className="text-center">Marks</span>
          </div>

          {state.rows.map((row) => (
            <QuestionTypeRow
              key={row.id}
              row={row}
              onChange={(next) => state.updateRow(row.id, next)}
              onRemove={() => state.removeRow(row.id)}
            />
          ))}

          <button
            type="button"
            onClick={state.addRow}
            className="mt-1 inline-flex w-fit items-center gap-2 text-[15px] font-medium text-ink"
            style={{ letterSpacing: "-0.02em" }}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white">
              <Plus className="h-5 w-5" strokeWidth={2.4} />
            </span>
            Add Question Type
          </button>

          {(state.errors.rows || state.errors.marks) && (
            <p className="text-[12px] text-red-600">
              {state.errors.rows || state.errors.marks}
            </p>
          )}
        </div>

        {/* Totals */}
        <div
          className="flex flex-col items-end gap-1 text-[14px]"
          style={{ letterSpacing: "-0.02em" }}
        >
          <p>
            <span className="font-bold text-ink">Total Questions</span>
            <span className="text-ink"> : {totals.totalQuestions}</span>
          </p>
          <p>
            <span className="font-bold text-ink">Total Marks</span>
            <span className="text-ink"> : {totals.totalMarks}</span>
          </p>
        </div>

        {/* Additional Info */}
        <div className="flex flex-col gap-2">
          <label
            className="text-[14px] font-medium text-ink"
            style={{ letterSpacing: "-0.02em" }}
          >
            Additional Information (For better output)
          </label>
          <div
            className="relative rounded-2xl bg-white p-4"
            style={{
              boxShadow:
                "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
            }}
          >
            <textarea
              rows={3}
              value={state.additionalInstructions}
              onChange={(e) =>
                state.setField("additionalInstructions", e.target.value)
              }
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              className="w-full resize-none bg-transparent text-[14px] text-ink placeholder:text-ink-muted focus:outline-none"
              style={{ letterSpacing: "-0.02em" }}
            />
            <button
              type="button"
              aria-label="Voice input"
              onClick={() => {
                const SR =
                  (window as unknown as {
                    SpeechRecognition?: unknown;
                    webkitSpeechRecognition?: unknown;
                  }).SpeechRecognition ??
                  (window as unknown as {
                    webkitSpeechRecognition?: unknown;
                  }).webkitSpeechRecognition;
                if (!SR) {
                  toast(
                    "Voice input not supported in this browser",
                    "info",
                  );
                  return;
                }
                type SRType = new () => {
                  lang: string;
                  interimResults: boolean;
                  start: () => void;
                  onresult: (
                    e: { results: { 0: { 0: { transcript: string } } }[] },
                  ) => void;
                  onerror: (e: { error?: string }) => void;
                };
                const rec = new (SR as SRType)();
                rec.lang = "en-US";
                rec.interimResults = false;
                rec.onresult = (e) => {
                  const text =
                    (e.results as unknown as {
                      [k: number]: { [k: number]: { transcript: string } };
                    })[0][0].transcript ?? "";
                  state.setField(
                    "additionalInstructions",
                    `${state.additionalInstructions} ${text}`.trim(),
                  );
                };
                rec.onerror = (e) =>
                  toast(
                    `Voice input error: ${e.error ?? "unknown"}`,
                    "error",
                  );
                rec.start();
                toast("Listening...", "info");
              }}
              className="absolute bottom-3 right-3 grid h-7 w-7 place-items-center rounded-full text-ink-muted hover:bg-surface-muted hover:text-ink"
            >
              <Mic className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>

      {submitError && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-[13px] text-red-700">
          {submitError}
        </p>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/assignments")}
          className="inline-flex h-11 items-center gap-1.5 rounded-full bg-white px-5 text-[14px] font-medium text-ink"
          style={{
            letterSpacing: "-0.02em",
            boxShadow:
              "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
          }}
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Previous
        </button>
        <button
          type="button"
          disabled={state.isSubmitting}
          onClick={handleSubmit}
          className="inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-[14px] font-medium text-white disabled:opacity-60"
          style={{ background: "#181818", letterSpacing: "-0.02em" }}
        >
          {state.isSubmitting ? "Submitting..." : "Next"}{" "}
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
