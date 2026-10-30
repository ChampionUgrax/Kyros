export const sampleQuestions = [
  {
    quiz_id: "os_001",
    topic_id: "os_lru",
    topic_name: "LRU Page Replacement",
    question: "Which page does LRU replace?",
    options: [
      "The most recently used page",
      "The least recently used page",
      "The largest memory page",
      "The most frequently used page"
    ],
    correct_index: 1,
    socratic_hint: "Consider which page has gone longest without access.",
    explanation: "LRU removes the least recently accessed page."
  },
  {
    quiz_id: "os_002",
    topic_id: "os_deadlock",
    topic_name: "Deadlocks",
    question: "Which condition is necessary for deadlock?",
    options: [
      "Resource preemption",
      "Circular wait",
      "Unlimited resources",
      "No resource sharing"
    ],
    correct_index: 1,
    socratic_hint: "Think about processes waiting on each other.",
    explanation: "Circular wait is one of the necessary deadlock conditions."
  }
];
