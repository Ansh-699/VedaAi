const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(message: string, public status: number, public body?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let body: unknown = undefined;
    try {
      body = await res.json();
    } catch {
      // ignore
    }
    const apiMessage =
      body && typeof body === "object" && "message" in body
        ? String((body as { message?: unknown }).message ?? "")
        : "";
    const fallback = `Request failed: ${res.status} ${res.statusText}`;
    throw new ApiError(apiMessage || fallback, res.status, body);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type ApiAssignment = {
  _id: string;
  title: string;
  subject?: string;
  grade?: string;
  dueDate: string;
  questionTypes: { type: string; count: number; marks: number }[];
  additionalInstructions?: string;
  status: "pending" | "queued" | "processing" | "completed" | "failed";
  resultId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiQuestionPaper = {
  _id: string;
  assignmentId: string;
  intro: string;
  school: string;
  subject: string;
  class: string;
  timeAllowed: string;
  maxMarks: number;
  instructions: string;
  sections: {
    id: string;
    title: string;
    subtitle: string;
    instruction: string;
    questions: { text: string; difficulty: string; marks: number }[];
  }[];
  answerKey: string[];
};

export const api = {
  baseUrl: BASE,

  listAssignments: () =>
    request<{ items: ApiAssignment[] }>("/api/assignments"),

  getAssignment: (id: string) =>
    request<{ assignment: ApiAssignment }>(`/api/assignments/${id}`),

  createAssignment: (input: {
    title: string;
    subject?: string;
    grade?: string;
    dueDate: string;
    questionTypes: { type: string; count: number; marks: number }[];
    additionalInstructions?: string;
    sourceText?: string;
  }) =>
    request<{ assignment: ApiAssignment }>("/api/assignments", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  deleteAssignment: (id: string) =>
    request<{ ok: true }>(`/api/assignments/${id}`, { method: "DELETE" }),

  getPaper: (assignmentId: string) =>
    request<{ paper: ApiQuestionPaper }>(
      `/api/assignments/${assignmentId}/paper`,
    ),

  regenerate: (assignmentId: string) =>
    request<{ assignment: ApiAssignment }>(
      `/api/assignments/${assignmentId}/regenerate`,
      { method: "POST" },
    ),

  pdfUrl: (assignmentId: string) =>
    `${BASE}/api/assignments/${assignmentId}/pdf`,
};
