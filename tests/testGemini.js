import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { MODEL } from "../src/gemini.js";
import { generateQuizFromNotes } from "../src/quizGenerator.js";

console.log("\n===== KYROS REAL GEMINI TEST =====");

try {
  console.log("Gemini model:", MODEL);

  // Read your existing working sample notes
  const notesText = await readFile(
    new URL("../data/sampleNotes.txt", import.meta.url),
    "utf8"
  );

  console.log("Notes loaded:", notesText.length, "characters");

  // Call Gemini to generate a real MCQ
  const { publicQuiz, privateQuiz } =
    await generateQuizFromNotes(
      notesText,
      "os_lru",
      "LRU Page Replacement"
    );

  // Verify the public quiz
  assert.equal(publicQuiz.options.length, 4);
  assert.ok(publicQuiz.question);

  // Ensure the answer key is not exposed
  assert.equal("correct_index" in publicQuiz, false);
  assert.equal("socratic_hint" in publicQuiz, false);
  assert.equal("explanation" in publicQuiz, false);

  // Verify private answer information
  assert.ok(Number.isInteger(privateQuiz.correct_index));
  assert.ok(privateQuiz.socratic_hint);
  assert.ok(privateQuiz.explanation);

  console.log("\n===== GENERATED AI QUESTION =====");
  console.log("Question:", publicQuiz.question);

  publicQuiz.options.forEach((option, index) => {
    console.log(`${index + 1}. ${option}`);
  });

  console.log("\nSocratic hint:", privateQuiz.socratic_hint);
  console.log("Explanation:", privateQuiz.explanation);

  console.log("\nSUCCESS: KYROS REAL GEMINI QUIZ WORKING!");
} catch (error) {
  console.error("\nGEMINI TEST FAILED");

  const key = process.env.GEMINI_API_KEY || "";
  const message = String(error.message || error);

  console.error(
    key ? message.replaceAll(key, "[REDACTED]") : message
  );

  if (error.cause?.code) {
    console.error("Cause:", error.cause.code);
  }

  process.exitCode = 1;
}