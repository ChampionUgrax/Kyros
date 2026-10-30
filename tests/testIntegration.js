import assert from "node:assert/strict";

import {
  getQuiz,
  submitQuizAnswer,
  getStudyPlan,
  processStudyMaterial
} from "../src/aiService.js";

import { sampleQuestions } from "../data/sampleQuestions.js";

console.log("\n===== KYROS AI INTEGRATION TEST =====");

// TEST 1: Request a quiz
console.log("\n1. Requesting quiz...");

const quiz = getQuiz("os_lru");

assert.equal(quiz.options.length, 4);
assert.equal("correct_index" in quiz, false);

console.log("Quiz generated:", quiz.question);

// Find the correct answer privately
const internalQuiz = sampleQuestions.find(
  q => q.quiz_id === quiz.quiz_id
);

assert.ok(internalQuiz);

const correctIndex = internalQuiz.correct_index;
const wrongIndex = (correctIndex + 1) % 4;

// TEST 2: Submit wrong answer
console.log("\n2. Testing wrong answer...");

const wrongResult = submitQuizAnswer(
  quiz.quiz_id,
  wrongIndex
);

assert.equal(wrongResult.correct, false);
assert.ok(wrongResult.socratic_hint);

console.log("Socratic hint:", wrongResult.socratic_hint);

// TEST 3: Submit correct answer
console.log("\n3. Testing correct answer...");

const correctResult = submitQuizAnswer(
  quiz.quiz_id,
  correctIndex
);

assert.equal(correctResult.correct, true);

console.log("Explanation:", correctResult.explanation);

// TEST 4: Study recommendations
console.log("\n4. Generating study plan...");

const attempts = [
  {
    quiz_id: "q1",
    topic_id: "os_lru",
    first_attempt_correct: false
  },
  {
    quiz_id: "q2",
    topic_id: "os_lru",
    first_attempt_correct: true
  },
  {
    quiz_id: "q3",
    topic_id: "os_lru",
    first_attempt_correct: false
  }
];

const topics = [
  { id: "os_lru", name: "LRU Page Replacement" },
  { id: "os_deadlock", name: "Deadlocks" }
];

const plan = getStudyPlan(attempts, topics);

assert.equal(plan.next_topic.topic_id, "os_lru");

console.log("Next topic:", plan.next_topic.topic_name);

// TEST 5: Process study notes
console.log("\n5. Processing study notes...");

const processed = await processStudyMaterial(
  "data/sampleNotes.txt"
);

assert.ok(processed.total_chunks > 0);

console.log("Total chunks:", processed.total_chunks);

// FINAL
console.log("\n======================================");
console.log("SUCCESS: KYROS AI INTEGRATION TEST PASSED!");
console.log("======================================");