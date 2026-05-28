import { z } from "zod";

const Difficulty = z.enum(["Easy", "Moderate", "Challenging", "Hard"]);

/**
 * Permissive question schema — `marks` is allowed to be 0 / missing /
 * non-numeric strings; we coerce + clamp later in `normalizeQuestionPaper`
 * so a single weird question doesn't fail the whole job.
 */
const Question = z.object({
  text: z.string().min(1),
  difficulty: Difficulty.catch("Moderate"),
  marks: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .default(0),
});

const Section = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional().default(""),
  instruction: z.string().optional().default(""),
  questions: z.array(Question).min(1),
});

export const QuestionPaperSchema = z.object({
  intro: z.string().optional().default(""),
  school: z.string().optional().default(""),
  subject: z.string().optional().default(""),
  class: z.string().optional().default(""),
  timeAllowed: z.string().optional().default(""),
  maxMarks: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .default(0),
  instructions: z.string().optional().default(""),
  sections: z.array(Section).min(1),
  answerKey: z.array(z.string()).optional().default([]),
});

export type ParsedQuestionPaperRaw = z.infer<typeof QuestionPaperSchema>;

export type Difficulty = z.infer<typeof Difficulty>;

export type ParsedQuestionPaper = {
  intro: string;
  school: string;
  subject: string;
  class: string;
  timeAllowed: string;
  maxMarks: number;
  instructions: string;
  sections: {
    id: string;
    title: string;
    subtitle: string;
    instruction: string;
    questions: {
      text: string;
      difficulty: Difficulty;
      marks: number;
    }[];
  }[];
  answerKey: string[];
};

function toPositiveInt(value: unknown, fallback = 1): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    const v = Math.round(value);
    return v > 0 ? v : fallback;
  }
  if (typeof value === "string") {
    const n = parseInt(value, 10);
    if (!Number.isNaN(n) && n > 0) return n;
  }
  return fallback;
}

/**
 * Take the loose Zod-parsed shape and produce strict, useable data.
 * - Drops sections with zero valid questions.
 * - Coerces `marks` strings/zeros to positive integers (default 1).
 * - Recomputes `maxMarks` if the model omitted/under-reported it.
 */
function normalizeQuestionPaper(
  raw: ParsedQuestionPaperRaw,
): ParsedQuestionPaper {
  const sections = raw.sections
    .map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      instruction: s.instruction,
      questions: s.questions
        .filter((q) => q.text.trim().length > 0)
        .map((q) => ({
          text: q.text.trim(),
          difficulty: q.difficulty as Difficulty,
          marks: toPositiveInt(q.marks, 1),
        })),
    }))
    .filter((s) => s.questions.length > 0);

  const totalFromQuestions = sections.reduce(
    (sum, s) => sum + s.questions.reduce((qs, q) => qs + q.marks, 0),
    0,
  );
  const reported = toPositiveInt(raw.maxMarks, 0);
  const maxMarks = reported > 0 ? reported : totalFromQuestions;

  return {
    intro: raw.intro,
    school: raw.school,
    subject: raw.subject,
    class: raw.class,
    timeAllowed: raw.timeAllowed,
    maxMarks,
    instructions: raw.instructions,
    sections,
    answerKey: raw.answerKey,
  };
}

/**
 * Robust JSON extraction: handles raw JSON, fenced blocks, or trailing prose.
 */
export function parseModelResponse(raw: string): ParsedQuestionPaper {
  const cleaned = stripFences(raw).trim();
  const candidate = extractJsonObject(cleaned);
  if (!candidate) {
    throw new Error("No JSON object found in model response");
  }
  const parsed = JSON.parse(candidate);
  const result = QuestionPaperSchema.parse(parsed);
  return normalizeQuestionPaper(result);
}

function stripFences(s: string): string {
  return s
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function extractJsonObject(s: string): string | null {
  const start = s.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return s.slice(start, i + 1);
    }
  }
  return null;
}
