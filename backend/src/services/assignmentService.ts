import { Assignment } from "../models/Assignment.js";
import { QuestionPaper } from "../models/QuestionPaper.js";
import { generationQueue } from "../queue/queues.js";
import type { CreateAssignmentInputT } from "../schemas/assignment.js";
import { redis } from "../config/redis.js";
import { publishProgress } from "../realtime/hub.js";

const CACHE_TTL_SEC = 60 * 5; // 5 minutes

export async function createAssignment(input: CreateAssignmentInputT) {
  const doc = await Assignment.create({
    ...input,
    dueDate: new Date(input.dueDate),
    status: "queued",
  });

  const job = await generationQueue.add(
    "generate",
    { assignmentId: doc._id.toString() },
    {
      attempts: 2,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: 100,
      removeOnFail: 100,
    },
  );

  doc.jobId = job.id ?? null;
  await doc.save();

  await publishProgress({
    type: "queued",
    assignmentId: doc._id.toString(),
  });

  return doc;
}

export async function listAssignments() {
  return Assignment.find().sort({ createdAt: -1 }).limit(100);
}

export async function getAssignment(id: string) {
  const cacheKey = `assignment:${id}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const doc = await Assignment.findById(id).lean();
  if (!doc) return null;
  await redis.setex(cacheKey, CACHE_TTL_SEC, JSON.stringify(doc));
  return doc;
}

export async function getQuestionPaperFor(assignmentId: string) {
  const cacheKey = `paper:${assignmentId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const paper = await QuestionPaper.findOne({ assignmentId }).lean();
  if (!paper) return null;
  await redis.setex(cacheKey, CACHE_TTL_SEC, JSON.stringify(paper));
  return paper;
}

export async function deleteAssignment(id: string) {
  await Assignment.findByIdAndDelete(id);
  await QuestionPaper.deleteMany({ assignmentId: id });
  await redis.del(`assignment:${id}`, `paper:${id}`);
}

export async function regenerate(assignmentId: string) {
  const doc = await Assignment.findById(assignmentId);
  if (!doc) throw new Error("Assignment not found");
  doc.status = "queued";
  doc.error = null;
  await doc.save();
  await QuestionPaper.deleteMany({ assignmentId });
  await redis.del(`paper:${assignmentId}`, `assignment:${assignmentId}`);

  const job = await generationQueue.add(
    "generate",
    { assignmentId },
    { attempts: 2, removeOnComplete: 100, removeOnFail: 100 },
  );
  doc.jobId = job.id ?? null;
  await doc.save();
  await publishProgress({ type: "queued", assignmentId });
  return doc;
}
