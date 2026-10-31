import { sampleQuestions } from "../data/sampleQuestions.js";

const ATTEMPTS_KEY = "kyros_ai_demo_attempts";
const TOPICS = sampleQuestions.map(({ topic_id, topic_name }) => ({ id: topic_id, name: topic_name }));

function readAttempts() {
  try {
    const value = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveAttempts(attempts) {
  try { localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts)); }
  catch { /* The practice session still works if browser storage is unavailable. */ }
}

export function getDemoTopics() {
  return TOPICS;
}

export function getDemoQuiz(topicId) {
  const source = sampleQuestions.find((question) => question.topic_id === topicId) || sampleQuestions[0];
  const quizId = globalThis.crypto?.randomUUID?.() || `demo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return { ...source, quiz_id: quizId };
}

export function checkDemoAnswer(quiz, selectedIndex) {
  if (!quiz || !Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex >= quiz.options.length) {
    throw new Error("Choose one of the answer options to continue.");
  }
  const correct = selectedIndex === quiz.correct_index;
  const attempts = readAttempts();
  const updated = [{ quiz_id: quiz.quiz_id, topic_id: quiz.topic_id, first_attempt_correct: correct, created_at: new Date().toISOString() }, ...attempts].slice(0, 200);
  saveAttempts(updated);
  return {
    correct,
    hint: correct ? null : quiz.socratic_hint,
    explanation: correct ? quiz.explanation : null,
    studyPlan: getDemoStudyPlan(updated),
  };
}

export function getDemoStudyPlan(attempts = readAttempts()) {
  const recommendations = TOPICS.map((topic) => {
    const seen = new Map();
    for (const attempt of attempts.filter((item) => item.topic_id === topic.id)) {
      if (typeof attempt.quiz_id === "string" && typeof attempt.first_attempt_correct === "boolean" && !seen.has(attempt.quiz_id)) {
        seen.set(attempt.quiz_id, attempt);
      }
    }
    const records = [...seen.values()];
    const accuracy = records.length ? Math.round(records.filter((item) => item.first_attempt_correct).length / records.length * 100) : null;
    const status = accuracy === null ? "UNASSESSED" : accuracy < 50 ? "CRITICAL" : accuracy <= 80 ? "REVIEW" : "MASTERED";
    const priority = { CRITICAL: 1, REVIEW: 2, UNASSESSED: 3, MASTERED: 4 }[status];
    const recommendation = status === "CRITICAL"
      ? "Review the basics, then try another practice question."
      : status === "REVIEW"
        ? "Keep practising to strengthen your understanding."
        : status === "MASTERED"
          ? "Try a more challenging question or revisit this topic later."
          : "Take a first practice question to check your understanding.";
    return { ...topic, accuracy, attempts: records.length, status, priority, recommendation };
  }).sort((a, b) => a.priority - b.priority || (a.accuracy ?? 0) - (b.accuracy ?? 0));
  return { next_topic: recommendations[0] || null, topics: recommendations };
}
