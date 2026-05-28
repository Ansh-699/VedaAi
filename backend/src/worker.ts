import { Worker } from "bullmq";
import { connectMongo } from "./config/db.js";
import { redis } from "./config/redis.js";
import { Assignment } from "./models/Assignment.js";
import { QuestionPaper } from "./models/QuestionPaper.js";
import { QUEUE_NAMES, type GenerationJobData, queueConnection } from "./queue/queues.js";
import { buildPrompt } from "./ai/prompt.js";
import { getProvider } from "./ai/provider.js";
import { parseModelResponse } from "./ai/parser.js";
import { publishProgress } from "./realtime/hub.js";

async function main() {
  await connectMongo();

  const provider = getProvider();

  const worker = new Worker<GenerationJobData, unknown, "generate">(
    QUEUE_NAMES.generation,
    async (job) => {
      const { assignmentId } = job.data;
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) throw new Error(`Assignment ${assignmentId} not found`);

      assignment.status = "processing";
      await assignment.save();
      await publishProgress({
        type: "processing",
        assignmentId,
        progress: 10,
      });

      const { system, user } = buildPrompt(assignment);
      let raw = "";
      try {
        raw = await provider.generate({ system, user });
      } catch (err) {
        throw new Error(
          `LLM call failed: ${(err as Error).message ?? "unknown error"}`,
        );
      }
      await publishProgress({
        type: "processing",
        assignmentId,
        progress: 70,
      });

      const parsed = parseModelResponse(raw);

      const paper = await QuestionPaper.create({
        assignmentId,
        ...parsed,
        rawModelResponse: raw,
      });

      assignment.status = "completed";
      assignment.resultId = paper._id;
      assignment.error = null;
      await assignment.save();

      // Bust cached entries
      await redis.del(`assignment:${assignmentId}`, `paper:${assignmentId}`);

      await publishProgress({
        type: "completed",
        assignmentId,
        progress: 100,
        resultId: paper._id.toString(),
      });

      return { paperId: paper._id.toString() };
    },
    {
      connection: queueConnection,
      concurrency: Number(process.env.WORKER_CONCURRENCY ?? 2),
    },
  );

  worker.on("failed", async (job, err) => {
    console.error("[worker] job failed", job?.id, err.message);
    if (job?.data?.assignmentId) {
      await Assignment.findByIdAndUpdate(job.data.assignmentId, {
        status: "failed",
        error: err.message,
      });
      await publishProgress({
        type: "failed",
        assignmentId: job.data.assignmentId,
        error: err.message,
      });
    }
  });

  console.log("[worker] generation worker started");
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
