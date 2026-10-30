
import assert from "node:assert/strict";
import { extractNotes, chunkNotes } from "../src/notesProcessor.js";

console.log("\n===== KYROS NOTES PROCESSING TEST =====");

try {
  // Use your existing sampleNotes.txt
  const notes = await extractNotes("data/sampleNotes.txt");

  console.log("\n1. Document successfully loaded");
  console.log("Filename:", notes.filename);
  console.log("Characters:", notes.characters);

  assert.ok(notes.text.length >= 20);

  // Split extracted text into chunks
  const chunks = chunkNotes(notes.text);

  console.log("\n2. Text chunking successful");
  console.log("Total chunks:", chunks.length);

  for (const chunk of chunks) {
    console.log(`\n${chunk.chunk_id}:`);
    console.log(chunk.text);
  }

  assert.ok(chunks.length > 0);

  console.log("\n3. All validations passed");
  console.log("SUCCESS: KYROS NOTES PROCESSOR WORKING!");

} catch (error) {
  console.error("\nTEST FAILED:", error.message);
  process.exitCode = 1;
}
