import { Queue } from "bullmq";
import { env } from "../config/env.js";

export const QUEUE_NAMES = {
  generation: "vedai-generation",
  pdf: "vedai-pdf",
} as const;

export type GenerationJobData = {
  assignmentId: string;
};

export type PdfJobData = {
  questionPaperId: string;
};

const connection = {
  url: env.REDIS_URL,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
} as const;

export const generationQueue = new Queue<GenerationJobData, unknown, "generate">(
  QUEUE_NAMES.generation,
  { connection },
);

export const pdfQueue = new Queue<PdfJobData, unknown, "render">(
  QUEUE_NAMES.pdf,
  { connection },
);

export { connection as queueConnection };
