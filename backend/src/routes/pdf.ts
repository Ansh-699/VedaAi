import { Router } from "express";
import { QuestionPaper } from "../models/QuestionPaper.js";
import { streamQuestionPaperPdf } from "../services/pdfService.js";

const router = Router();

router.get("/:assignmentId/pdf", async (req, res, next) => {
  try {
    const paper = await QuestionPaper.findOne({
      assignmentId: req.params.assignmentId,
    });
    if (!paper) return res.status(404).json({ error: "not found" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="question-paper-${paper._id}.pdf"`,
    );
    streamQuestionPaperPdf(paper, res);
  } catch (err) {
    next(err);
  }
});

export default router;
