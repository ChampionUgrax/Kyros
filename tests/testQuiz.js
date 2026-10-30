
import assert from "node:assert/strict";

import { sampleQuestions } from "../data/sampleQuestions.js";
import { generateMockQuiz } from "../src/mockQuizGenerator.js";
import { validateAnswer } from "../src/answerValidator.js";
import { validateQuiz } from "../src/quizSchema.js";
import { analyzeTopic } from "../src/masteryEngine.js";
import { recommendStudyPlan } from "../src/recommendationEngine.js";

// ==========================================
// TEST 1: QUIZ GENERATION & VALIDATION
// ==========================================

console.log("\n===== KYROS AI QUIZ TEST =====");

for (const question of sampleQuestions) {
  validateQuiz(question);
}

// Test one public quiz per available topic
const topicIds = [...new Set(
  sampleQuestions.map(q => q.topic_id)
)];

for (const topicId of topicIds) {
  const quiz = generateMockQuiz(topicId);

  const internalQuiz = sampleQuestions.find(
    q => q.quiz_id === quiz.quiz_id
  );

  assert.ok(internalQuiz);
  assert.equal(quiz.options.length, 4);
  assert.equal("correct_index" in quiz, false);
  assert.equal("explanation" in quiz, false);
  assert.equal("socratic_hint" in quiz, false);

  const wrongIndex =
    (internalQuiz.correct_index + 1) % 4;

  const wrongResult = validateAnswer(
    quiz.quiz_id,
    wrongIndex
  );

  assert.equal(wrongResult.correct, false);
  assert.ok(wrongResult.socratic_hint);

  const correctResult = validateAnswer(
    quiz.quiz_id,
    internalQuiz.correct_index
  );

  assert.equal(correctResult.correct, true);
  assert.ok(correctResult.explanation);

  console.log("PASS:", quiz.quiz_id);
}

// ==========================================
// TEST 2: MASTERY ENGINE
// ==========================================

console.log("\n===== MASTERY ENGINE TEST =====");

const attempts = [
  {
    quiz_id: "q1",
    topic_id: "os_lru",
    first_attempt_correct: true
  },
  {
    quiz_id: "q2",
    topic_id: "os_lru",
    first_attempt_correct: false
  },
  {
    quiz_id: "q3",
    topic_id: "os_lru",
    first_attempt_correct: false
  },
  {
    quiz_id: "q4",
    topic_id: "os_lru",
    first_attempt_correct: true
  },
  {
    quiz_id: "q5",
    topic_id: "os_lru",
    first_attempt_correct: false
  }
];

const mastery = analyzeTopic(attempts, "os_lru");

assert.equal(mastery.accuracy, 40);
assert.equal(mastery.status, "CRITICAL");
assert.equal(mastery.total_questions, 5);

console.log("Mastery result:", mastery);
console.log("PASS: Mastery engine");

// ==========================================
// TEST 3: UNASSESSED TOPICS
// ==========================================

console.log("\n===== UNASSESSED TOPIC TEST =====");

const unassessed = analyzeTopic(
  attempts,
  "os_unknown"
);

assert.equal(unassessed.accuracy, null);
assert.equal(unassessed.status, "UNASSESSED");

console.log("PASS: Unassessed topic handling");

// ==========================================
// TEST 4: PERSONALIZED RECOMMENDATIONS
// ==========================================

console.log("\n===== RECOMMENDATION ENGINE TEST =====");

const allAttempts = [
  ...attempts,

  // CPU Scheduling: 50%
  {
    quiz_id: "cpu_1",
    topic_id: "os_cpu",
    first_attempt_correct: true
  },
  {
    quiz_id: "cpu_2",
    topic_id: "os_cpu",
    first_attempt_correct: false
  },

  // Deadlocks: 100%
  {
    quiz_id: "dead_1",
    topic_id: "os_deadlock",
    first_attempt_correct: true
  },
  {
    quiz_id: "dead_2",
    topic_id: "os_deadlock",
    first_attempt_correct: true
  }
];

const topics = [
  { id: "os_lru", name: "LRU Page Replacement" },
  { id: "os_cpu", name: "CPU Scheduling" },
  { id: "os_deadlock", name: "Deadlocks" },
  { id: "os_paging", name: "Paging" }
];

const plan = recommendStudyPlan(
  allAttempts,
  topics
);

assert.equal(plan.topics.length, 4);
assert.equal(plan.next_topic.topic_id, "os_lru");

assert.equal(plan.topics[0].status, "CRITICAL");
assert.equal(plan.topics[1].status, "REVIEW");
assert.equal(plan.topics[2].status, "UNASSESSED");
assert.equal(plan.topics[3].status, "MASTERED");

console.log(
  "Recommended study plan:",
  JSON.stringify(plan, null, 2)
);

console.log("PASS: Recommendation engine");

// ==========================================
// FINAL RESULT
// ==========================================

console.log("\n======================================");
console.log("SUCCESS: ALL KYROS AI TESTS PASSED!");
console.log("======================================");
