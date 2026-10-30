import { sampleQuestions } from "../data/sampleQuestions.js";

export function validateAnswer(quizId, selectedIndex) {
  const quiz = sampleQuestions.find(q => q.quiz_id === quizId);

  if (!quiz) {
    throw new Error("Quiz not found: " + quizId);
  }

  if (!Number.isInteger(selectedIndex) ||
      selectedIndex < 0 ||
      selectedIndex >= quiz.options.length) {
    throw new Error("Invalid answer index");
  }

  const correct = selectedIndex === quiz.correct_index;

  return {
    quiz_id: quizId,
    topic_id: quiz.topic_id,
    correct,
    socratic_hint: correct ? null : quiz.socratic_hint,
    explanation: correct ? quiz.explanation : null
  };
}
