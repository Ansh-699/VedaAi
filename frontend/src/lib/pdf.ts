"use client";

/**
 * Client-side PDF text extraction using Mozilla pdf.js.
 * Returns concatenated text from every page, capped at MAX_CHARS so the
 * downstream prompt stays under reasonable size.
 */
const MAX_CHARS = 12_000;

let workerInited = false;

async function ensureWorker() {
  if (workerInited) return;
  const pdfjs = await import("pdfjs-dist");
  // pdf.js ships its worker as an ESM module — use new URL() so the bundler
  // emits it as a separate worker chunk.
  const workerUrl = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  workerInited = true;
}

export async function extractPdfText(file: File): Promise<string> {
  await ensureWorker();
  const pdfjs = await import("pdfjs-dist");

  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;

  const parts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((it) => ("str" in it ? (it as { str: string }).str : ""))
      .join(" ");
    parts.push(pageText);
    if (parts.join("\n").length > MAX_CHARS) break;
  }

  await doc.destroy();
  return parts.join("\n\n").slice(0, MAX_CHARS).trim();
}
