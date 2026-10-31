
import { sampleQuestions } from "../data/sampleQuestions.js";

// ========================================
// 1. VALIDATE A MOCK QUIZ ANSWER
// ========================================
// Used for questions in sampleQuestions.js.
// Preserves compatibility with existing tests.

export function validateAnswer(quizId, selectedIndex) {
  const quiz = sampleQuestions.find(
    q => q.quiz_id === quizId
  );

  if (!quiz) {
    throw new Error("Quiz not found: " + quizId);
  }

  return validateGeneratedAnswer(quiz, selectedIndex);
}

// ========================================
// 2. VALIDATE A REAL GEMINI QUIZ ANSWER
// ========================================
// The Express backend must retrieve the
// private quiz record from Firestore.
//
// Never accept privateQuiz from the frontend.
//
// Example:
// validateGeneratedAnswer(privateQuiz, 1)

export function validateGeneratedAnswer(
  privateQuiz,
  selectedIndex
) {
  // Validate the private quiz record
  if (
    !privateQuiz ||
    typeof privateQuiz.quiz_id !== "string" ||
    typeof privateQuiz.topic_id !== "string" ||
    !Array.isArray(privateQuiz.options) ||
    privateQuiz.options.length !== 4 ||
    !Number.isInteger(privateQuiz.correct_index) ||
    privateQuiz.correct_index < 0 ||
    privateQuiz.correct_index > 3
  ) {
    throw new Error("Invalid private quiz record");
  }

  // Validate the student's selected answer
  if (
    !Number.isInteger(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex >= privateQuiz.options.length
  ) {
    throw new Error(
      "Invalid answer index. Select a number between 0 and 3."
    );
  }

  // Compare selected answer with the correct index
  const correct =
    selectedIndex === privateQuiz.correct_index;

  // ========================================
  // 3. RETURN FEEDBACK
  // ========================================

  return {
    quiz_id: privateQuiz.quiz_id,
    topic_id: privateQuiz.topic_id,
    correct,

    // Wrong answer -> Socratic hint
    socratic_hint: correct
      ? null
      : privateQuiz.socratic_hint,

    // Correct answer -> Explanation
    explanation: correct
      ? privateQuiz.explanation
      : null
  };
}
