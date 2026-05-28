import PDFDocument from "pdfkit";
import type { QuestionPaperDoc } from "../models/QuestionPaper.js";
import type { Writable } from "node:stream";

export function streamQuestionPaperPdf(
  paper: QuestionPaperDoc,
  out: Writable,
) {
  const doc = new PDFDocument({ size: "A4", margin: 56 });
  doc.pipe(out);

  doc.font("Helvetica-Bold").fontSize(20).text(paper.school, { align: "center" });
  doc.moveDown(0.3);
  doc.font("Helvetica").fontSize(13).text(`Subject: ${paper.subject}`, { align: "center" });
  doc.text(`Class: ${paper.class}`, { align: "center" });
  doc.moveDown(0.6);

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`Time Allowed: ${paper.timeAllowed}`, { continued: true });
  doc
    .font("Helvetica-Bold")
    .text(`        Maximum Marks: ${paper.maxMarks}`, { align: "right" });
  doc.moveDown(0.4);
  doc.font("Helvetica").fontSize(11).text(paper.instructions);
  doc.moveDown(0.5);

  doc.font("Helvetica").fontSize(11).text("Name: ____________________");
  doc.text("Roll Number: ____________________");
  doc.text(`Class: ${paper.class} Section: ____________`);
  doc.moveDown(0.8);

  for (const section of paper.sections) {
    doc.font("Helvetica-Bold").fontSize(14).text(section.title, { align: "center" });
    doc.moveDown(0.3);
    doc.font("Helvetica-Bold").fontSize(12).text(section.subtitle);
    doc
      .font("Helvetica-Oblique")
      .fontSize(11)
      .fillColor("#5e5e5e")
      .text(section.instruction);
    doc.fillColor("#000").moveDown(0.5);
    doc.font("Helvetica").fontSize(11);

    section.questions.forEach((q, i) => {
      doc.text(`${i + 1}. [${q.difficulty}] ${q.text} [${q.marks} Marks]`, {
        align: "left",
      });
      doc.moveDown(0.3);
    });

    doc.moveDown(0.6);
  }

  doc.font("Helvetica-Bold").fontSize(12).text("End of Question Paper");
  doc.moveDown(0.6);

  if (paper.answerKey?.length) {
    doc.font("Helvetica-Bold").fontSize(13).text("Answer Key:");
    doc.moveDown(0.3);
    doc.font("Helvetica").fontSize(11);
    paper.answerKey.forEach((a, i) => {
      doc.text(`${i + 1}. ${a}`);
      doc.moveDown(0.2);
    });
  }

  doc.end();
}
