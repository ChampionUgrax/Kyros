import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";

// Maximum allowed file size: 10 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ========================================
// 1. CLEAN EXTRACTED TEXT
// ========================================

export function cleanText(text) {
  if (typeof text !== "string") {
    throw new Error("Input must be text");
  }

  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ========================================
// 2. EXTRACT TEXT FROM PDF OR TXT
// ========================================

export async function extractNotes(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  if (![".pdf", ".txt"].includes(extension)) {
    throw new Error("Only PDF and TXT files are supported");
  }

  const fileInfo = await stat(filePath);

  if (fileInfo.size > MAX_FILE_SIZE) {
    throw new Error("File exceeds 10 MB limit");
  }

  let text = "";
  let pages = null;

  if (extension === ".txt") {
    text = await readFile(filePath, "utf8");
  } else {
    const buffer = await readFile(filePath);

    const parser = new PDFParse({
      data: new Uint8Array(buffer)
    });

    try {
      const result = await parser.getText();

      text = result.text;
      pages = result.total;
    } finally {
      await parser.destroy();
    }
  }

  text = cleanText(text);

  if (text.length < 20) {
    throw new Error("Not enough readable text found");
  }

  return {
    filename: path.basename(filePath),
    file_type: extension,
    pages,
    characters: text.length,
    text
  };
}

// ========================================
// 3. SPLIT NOTES INTO SMALL CHUNKS
// ========================================

export function chunkNotes(
  text,
  maxChars = 1200,
  overlap = 150
) {
  if (
    !Number.isInteger(maxChars) ||
    !Number.isInteger(overlap) ||
    maxChars <= 0 ||
    overlap < 0 ||
    overlap >= maxChars
  ) {
    throw new Error("Invalid chunk settings");
  }

  const cleaned = cleanText(text);
  const chunks = [];

  let start = 0;

  while (start < cleaned.length) {
    const end = Math.min(
      start + maxChars,
      cleaned.length
    );

    chunks.push({
      chunk_id: `chunk_${chunks.length + 1}`,
      text: cleaned.slice(start, end),
      start_char: start,
      end_char: end
    });

    if (end === cleaned.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
}