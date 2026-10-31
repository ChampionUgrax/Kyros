import { sampleQuestions } from "../data/sampleQuestions.js";
import { validateQuiz } from "./quizSchema.js";

export function generateMockQuiz(topicId = "os_lru") {
  const question = sampleQuestions.find(q => q.topic_id === topicId);

  if (!question) {
    throw new Error("No questions found for topic: " + topicId);
  }

  const quiz = validateQuiz(question);

  const {
    correct_index,
    socratic_hint,
    explanation,
    ...publicQuiz
  } = quiz;

  return publicQuiz;
}
