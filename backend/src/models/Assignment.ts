import mongoose, { Schema, type InferSchemaType } from "mongoose";

const QuestionTypeSchema = new Schema(
  {
    type: { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    marks: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const AssignmentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, default: "" },
    grade: { type: String, default: "" },
    dueDate: { type: Date, required: true },
    questionTypes: { type: [QuestionTypeSchema], required: true, default: [] },
    additionalInstructions: { type: String, default: "" },
    sourceText: { type: String, default: "" },
    fileMeta: {
      filename: String,
      mimeType: String,
      size: Number,
    },
    status: {
      type: String,
      enum: ["pending", "queued", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },
    jobId: { type: String, default: null },
    resultId: { type: Schema.Types.ObjectId, ref: "QuestionPaper", default: null },
    error: { type: String, default: null },
  },
  { timestamps: true },
);

export type AssignmentDoc = InferSchemaType<typeof AssignmentSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Assignment = mongoose.model("Assignment", AssignmentSchema);
