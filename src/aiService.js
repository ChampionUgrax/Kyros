// KYROS AI SERVICE
// Shared AI interface for the Express backend

import { generateMockQuiz } from "./mockQuizGenerator.js";
import { generateQuizFromNotes } from "./quizGenerator.js";
import { validateAnswer } from "./answerValidator.js";
import { recommendStudyPlan } from "./recommendationEngine.js";
import { extractNotes, chunkNotes } from "./notesProcessor.js";

// ========================================
// 1. MOCK QUIZ (FALLBACK)
// ========================================

export function getQuiz(topicId = "os_lru") {
  return generateMockQuiz(topicId);
}

// ========================================
// 2. REAL GEMINI QUIZ FROM TEXT
// ========================================

export async function getAIQuizFromNotes(
  notesText,
  topicId = "os_lru",
  topicName = "LRU Page Replacement"
) {
  return generateQuizFromNotes(
    notesText,
    topicId,
    topicName
  );
}

// ========================================
// 3. REAL GEMINI QUIZ FROM PDF/TXT
// ========================================

export async function getAIQuizFromFile(
  filePath,
  topicId = "os_lru",
  topicName = "LRU Page Replacement"
) {
  const notes = await extractNotes(filePath);

  return getAIQuizFromNotes(
    notes.text,
    topicId,
    topicName
  );
}

// ========================================
// 4. MOCK ANSWER VALIDATION
// ========================================
// For sampleQuestions.js quizzes only.
// AI-generated quizzes require the backend
// to retrieve their private answer records.

export function submitQuizAnswer(quizId, selectedIndex) {
  return validateAnswer(quizId, selectedIndex);
}

// ========================================
// 5. PERSONALIZED STUDY PLAN
// ========================================

export function getStudyPlan(attempts, topics) {
  return recommendStudyPlan(attempts, topics);
}

// ========================================
// 6. NOTES EXTRACTION AND CHUNKING
// ========================================

export async function processStudyMaterial(filePath) {
  const notes = await extractNotes(filePath);
  const chunks = chunkNotes(notes.text);

  return {
    filename: notes.filename,
    file_type: notes.file_type,
    pages: notes.pages,
    characters: notes.characters,
    total_chunks: chunks.length,
    chunks
  };
}