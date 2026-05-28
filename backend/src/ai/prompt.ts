import type { AssignmentDoc } from "../models/Assignment.js";

export type PromptInput = Pick<
  AssignmentDoc,
  | "title"
  | "subject"
  | "grade"
  | "dueDate"
  | "questionTypes"
  | "additionalInstructions"
  | "sourceText"
>;

export function buildPrompt(input: PromptInput): { system: string; user: string } {
  const totalQuestions = input.questionTypes.reduce(
    (sum, qt) => sum + qt.count,
    0,
  );
  const totalMarks = input.questionTypes.reduce(
    (sum, qt) => sum + qt.count * qt.marks,
    0,
  );

  const breakdown = input.questionTypes
    .map((qt) => `- ${qt.count} ${qt.type} questions (${qt.marks} marks each)`)
    .join("\n");

  const system = [
    "You are an expert teacher who creates structured exam question papers.",
    "When the user provides source material (a document), every question MUST be grounded in that material.",
    "Always return ONLY a valid JSON object that matches the requested schema.",
    "Do not include markdown fences, prose, or commentary outside the JSON.",
  ].join(" ");

  const user = `Create a question paper for the assignment titled "${input.title}".

Subject: ${input.subject || "General"}
Class/Grade: ${input.grade || "Not specified"}
Total questions: ${totalQuestions}
Total marks: ${totalMarks}

Question type breakdown:
${breakdown}

Additional instructions:
${input.additionalInstructions || "None"}

${
  input.sourceText
    ? `IMPORTANT — Source material the questions MUST be based on:
The teacher uploaded the following document. Every question you generate MUST be grounded in the facts, concepts, names, dates, formulas, and ideas in this document. Do not introduce content that is not present or directly inferable from this material. If the document is too short for the requested number of questions, you may rephrase or vary the questions but they must still relate to this content.

<<< DOCUMENT START >>>
${input.sourceText.slice(0, 8000)}
<<< DOCUMENT END >>>
`
    : ""
}

Return STRICT JSON in this shape:
{
  "intro": "Brief introduction shown above the paper",
  "school": "Default school name (e.g., Delhi Public School)",
  "subject": "${input.subject || "Subject"}",
  "class": "${input.grade || "Class"}",
  "timeAllowed": "e.g., 45 minutes",
  "maxMarks": ${totalMarks},
  "instructions": "All questions are compulsory unless stated otherwise.",
  "sections": [
    {
      "id": "A",
      "title": "Section A",
      "subtitle": "Section title (e.g., Short Answer Questions)",
      "instruction": "Attempt all questions. Each question carries N marks",
      "questions": [
        { "text": "...", "difficulty": "Easy|Moderate|Challenging", "marks": N }
      ]
    }
  ],
  "answerKey": ["Answer 1...", "Answer 2..."]
}

Group questions into Sections (A, B, ...). Mix difficulties (Easy/Moderate/Challenging). Each question must include "difficulty" and "marks". The total number of questions across all sections must equal ${totalQuestions}.`;

  return { system, user };
}
