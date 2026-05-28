import { z } from "zod";

export const QuestionTypeInput = z.object({
  type: z.string().min(1, "Question type is required"),
  count: z.number().int().positive("Count must be positive"),
  marks: z.number().int().positive("Marks must be positive"),
});

export const CreateAssignmentInput = z.object({
  title: z.string().trim().min(1, "Title is required"),
  subject: z.string().optional().default(""),
  grade: z.string().optional().default(""),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine((s) => !Number.isNaN(Date.parse(s)), "Invalid date"),
  questionTypes: z
    .array(QuestionTypeInput)
    .min(1, "At least one question type is required"),
  additionalInstructions: z.string().optional().default(""),
  sourceText: z.string().optional().default(""),
});

export type CreateAssignmentInputT = z.infer<typeof CreateAssignmentInput>;
