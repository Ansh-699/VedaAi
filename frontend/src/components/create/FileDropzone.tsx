"use client";

import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { useCreateAssignment } from "@/lib/store/createAssignmentStore";
import { toast } from "@/components/ui/Toaster";
import { extractPdfText } from "@/lib/pdf";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const ACCEPTED = ".pdf,.txt,.md,.json,image/png,image/jpeg";

export function FileDropzone() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setFile = useCreateAssignment((s) => s.setFile);
  const fileName = useCreateAssignment((s) => s.fileName);
  const [busy, setBusy] = useState(false);

  async function handlePick(file: File | null) {
    if (!file) return;
    if (file.size > MAX_BYTES) {
      toast("File too large. Max 10MB.", "error");
      return;
    }
    setBusy(true);
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isText =
      file.type === "text/plain" ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".md") ||
      file.name.endsWith(".json");

    try {
      let text = "";
      if (isPdf) {
        toast(`Extracting text from ${file.name}…`, "loading");
        text = await extractPdfText(file);
        toast.dismiss();
        if (!text)
          toast(
            "Couldn't extract text from PDF (might be scanned/image-only)",
            "info",
          );
      } else if (isText) {
        text = await file.text();
      }
      // For images we keep filename only — backend uses it as a prompt hint.

      setFile({ name: file.name, text });
      const preview = text ? ` (${text.length.toLocaleString()} chars extracted)` : "";
      toast(`Added ${file.name}${preview}`, "success");
    } catch (err) {
      toast.dismiss();
      toast(`Couldn't read file: ${(err as Error).message}`, "error");
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        handlePick(f ?? null);
      }}
      className="flex flex-col items-center justify-center gap-3 rounded-3xl px-6 py-12 text-center"
      style={{
        background: "#EAEAEC",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' rx='24' ry='24' fill='none' stroke='%239B9BA1' stroke-width='1.5' stroke-dasharray='6 6'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <span
        className="grid h-11 w-11 place-items-center rounded-full bg-white"
        style={{ boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}
      >
        <UploadCloud className="h-5 w-5 text-ink" strokeWidth={2} />
      </span>

      {fileName ? (
        <div className="flex items-center gap-2">
          <p
            className="text-[14px] font-medium text-ink"
            style={{ letterSpacing: "-0.02em" }}
          >
            {fileName}
          </p>
          <button
            type="button"
            onClick={clear}
            aria-label="Remove file"
            className="grid h-6 w-6 place-items-center rounded-full text-ink-muted hover:bg-white"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <>
          <p
            className="text-[15px] font-medium text-ink"
            style={{ letterSpacing: "-0.02em" }}
          >
            Choose a file or drag &amp; drop it here
          </p>
          <p
            className="text-[13px] font-normal text-ink-muted"
            style={{ letterSpacing: "-0.02em" }}
          >
            PDF, TXT, JPEG, PNG — up to 10MB
          </p>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => handlePick(e.target.files?.[0] ?? null)}
      />

      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="mt-2 h-10 rounded-full bg-white px-5 text-[14px] font-medium text-ink disabled:opacity-60"
        style={{
          letterSpacing: "-0.02em",
          boxShadow:
            "0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.08)",
        }}
      >
        {busy ? "Reading..." : fileName ? "Replace File" : "Browse Files"}
      </button>
    </div>
  );
}
