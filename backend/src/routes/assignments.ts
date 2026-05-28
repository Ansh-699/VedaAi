import { Router } from "express";
import { ZodError } from "zod";
import { CreateAssignmentInput } from "../schemas/assignment.js";
import {
  createAssignment,
  deleteAssignment,
  getAssignment,
  getQuestionPaperFor,
  listAssignments,
  regenerate,
} from "../services/assignmentService.js";
import { rateLimit } from "../middleware/rateLimit.js";

const router = Router();

// Throttle anything that triggers an LLM job.
const generationLimiter = rateLimit({
  keyPrefix: "gen",
  windowSec: 60,
  max: 5, // 5 generations per IP per minute
});

router.get("/", async (_req, res, next) => {
  try {
    const items = await listAssignments();
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.post("/", generationLimiter, async (req, res, next) => {
  try {
    const input = CreateAssignmentInput.parse(req.body);
    const doc = await createAssignment(input);
    res.status(201).json({ assignment: doc });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: "validation", issues: err.issues });
    }
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const doc = await getAssignment(req.params.id);
    if (!doc) return res.status(404).json({ error: "not found" });
    res.json({ assignment: doc });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteAssignment(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/paper", async (req, res, next) => {
  try {
    const paper = await getQuestionPaperFor(req.params.id);
    if (!paper) return res.status(404).json({ error: "not found" });
    res.json({ paper });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/regenerate", generationLimiter, async (req, res, next) => {
  try {
    const doc = await regenerate(req.params.id);
    res.json({ assignment: doc });
  } catch (err) {
    next(err);
  }
});

export default router;
