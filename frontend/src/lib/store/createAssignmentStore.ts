"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DraftQuestionRow = {
  id: string;
  type: string;
  count: number;
  marks: number;
};

type State = {
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  rows: DraftQuestionRow[];
  additionalInstructions: string;
  sourceText: string;

  fileName: string | null;

  isSubmitting: boolean;
  submittedAssignmentId: string | null;
  errors: Record<string, string>;

  /** True after we've shown the "draft restored" toast for the current page load. */
  draftAcknowledged: boolean;

  setField: <K extends keyof State>(key: K, value: State[K]) => void;
  addRow: () => void;
  updateRow: (id: string, patch: Partial<DraftQuestionRow>) => void;
  removeRow: (id: string) => void;
  setFile: (file: { name: string; text?: string } | null) => void;
  reset: () => void;
  validate: () => boolean;
  hasDraft: () => boolean;
  acknowledgeDraft: () => void;
};

const initialRows: DraftQuestionRow[] = [
  { id: "r1", type: "Multiple Choice Questions", count: 4, marks: 1 },
  { id: "r2", type: "Short Questions", count: 3, marks: 2 },
  { id: "r3", type: "Diagram/Graph-Based Questions", count: 5, marks: 5 },
  { id: "r4", type: "Numerical Problems", count: 5, marks: 5 },
];

const blank = {
  title: "",
  subject: "",
  grade: "",
  dueDate: "",
  rows: initialRows,
  additionalInstructions: "",
  sourceText: "",
  fileName: null as string | null,
};

export const useCreateAssignment = create<State>()(
  persist(
    (set, get) => ({
      ...blank,

      isSubmitting: false,
      submittedAssignmentId: null,
      errors: {},
      draftAcknowledged: false,

      setField: (key, value) => set({ [key]: value } as Partial<State>),

      addRow: () =>
        set((s) => ({
          rows: [
            ...s.rows,
            {
              id: `r${Date.now()}`,
              type: "Short Questions",
              count: 1,
              marks: 1,
            },
          ],
        })),

      updateRow: (id, patch) =>
        set((s) => ({
          rows: s.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),

      removeRow: (id) =>
        set((s) => ({ rows: s.rows.filter((r) => r.id !== id) })),

      setFile: (file) =>
        set({
          fileName: file?.name ?? null,
          sourceText: file?.text ?? "",
        }),

      reset: () =>
        set({
          ...blank,
          isSubmitting: false,
          submittedAssignmentId: null,
          errors: {},
          draftAcknowledged: true,
        }),

      acknowledgeDraft: () => set({ draftAcknowledged: true }),

      hasDraft: () => {
        const s = get();
        return Boolean(
          s.title ||
            s.subject ||
            s.grade ||
            s.dueDate ||
            s.additionalInstructions ||
            s.sourceText ||
            s.fileName,
        );
      },

      validate: () => {
        const s = get();
        const errors: Record<string, string> = {};

        if (!s.title.trim()) errors.title = "Title is required";
        else if (s.title.trim().length < 3)
          errors.title = "Title must be at least 3 characters";
        else if (s.title.length > 120)
          errors.title = "Title is too long (max 120)";

        if (!s.dueDate.trim()) {
          errors.dueDate = "Due date is required";
        } else {
          const due = new Date(s.dueDate);
          if (Number.isNaN(due.getTime())) errors.dueDate = "Invalid date";
          else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (due < today) errors.dueDate = "Due date cannot be in the past";
          }
        }

        if (s.rows.length === 0) errors.rows = "Add at least one question type";

        const totalQuestions = s.rows.reduce((sum, r) => sum + r.count, 0);
        const totalMarks = s.rows.reduce((sum, r) => sum + r.count * r.marks, 0);

        if (totalQuestions === 0)
          errors.rows = "Total number of questions must be greater than 0";
        else if (totalQuestions > 200)
          errors.rows = "Total number of questions cannot exceed 200";

        if (totalMarks === 0)
          errors.marks = "Total marks must be greater than 0";

        s.rows.forEach((r) => {
          if (!r.type.trim())
            errors[`row.${r.id}.type`] = "Type is required";
          if (r.count <= 0)
            errors[`row.${r.id}.count`] = "Count must be positive";
          else if (r.count > 100)
            errors[`row.${r.id}.count`] = "Count must be 100 or fewer";
          if (r.marks <= 0)
            errors[`row.${r.id}.marks`] = "Marks must be positive";
          else if (r.marks > 100)
            errors[`row.${r.id}.marks`] = "Marks must be 100 or fewer";
        });

        set({ errors });
        return Object.keys(errors).length === 0;
      },
    }),
    {
      name: "vedai:create-draft",
      // Persist only fillable inputs; volatile UI state stays in memory.
      partialize: (s) => ({
        title: s.title,
        subject: s.subject,
        grade: s.grade,
        dueDate: s.dueDate,
        rows: s.rows,
        additionalInstructions: s.additionalInstructions,
        fileName: s.fileName,
        // sourceText can be huge — we don't persist it. Re-extracting requires
        // the user to re-pick the file.
      }),
    },
  ),
);
