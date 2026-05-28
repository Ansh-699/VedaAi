import mongoose, { Schema, type InferSchemaType } from "mongoose";

const QuestionSchema = new Schema(
  {
    text: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Moderate", "Challenging", "Hard"],
      required: true,
    },
    marks: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const SectionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    instruction: { type: String, default: "" },
    questions: { type: [QuestionSchema], required: true, default: [] },
  },
  { _id: false },
);

const QuestionPaperSchema = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },
    intro: { type: String, default: "" },
    school: { type: String, default: "" },
    subject: { type: String, default: "" },
    class: { type: String, default: "" },
    timeAllowed: { type: String, default: "" },
    maxMarks: { type: Number, default: 0 },
    instructions: { type: String, default: "" },
    sections: { type: [SectionSchema], required: true, default: [] },
    answerKey: { type: [String], default: [] },
    rawModelResponse: { type: String, default: "" },
  },
  { timestamps: true },
);

export type QuestionPaperDoc = InferSchemaType<typeof QuestionPaperSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const QuestionPaper = mongoose.model(
  "QuestionPaper",
  QuestionPaperSchema,
);
