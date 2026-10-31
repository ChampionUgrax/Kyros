
import { analyzeTopic } from "./masteryEngine.js";

// Lower number means higher study priority
const PRIORITY = {
  CRITICAL: 1,
  REVIEW: 2,
  UNASSESSED: 3,
  MASTERED: 4
};

const DIFFICULTY = {
  CRITICAL: "easy",
  REVIEW: "medium",
  UNASSESSED: "easy",
  MASTERED: "hard"
};

export function recommendStudyPlan(attempts, topics) {
  if (!Array.isArray(attempts) || !Array.isArray(topics)) {
    throw new Error("Attempts and topics must be arrays");
  }

  const recommendations = topics.map(topic => {
    if (!topic.id || !topic.name) {
      throw new Error("Each topic needs an id and name");
    }

    const mastery = analyzeTopic(attempts, topic.id);

    return {
      topic_id: topic.id,
      topic_name: topic.name,
      accuracy: mastery.accuracy,
      total_questions: mastery.total_questions,
      status: mastery.status,
      provisional: mastery.provisional ?? true,
      priority: PRIORITY[mastery.status],
      suggested_difficulty: DIFFICULTY[mastery.status],
      recommendation: mastery.recommendation
    };
  });

  // Prioritize weaker topics
  recommendations.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    return (a.accuracy ?? 0) - (b.accuracy ?? 0);
  });

  const next = recommendations[0] ?? null;

  return {
    next_topic: next
      ? {
          topic_id: next.topic_id,
          topic_name: next.topic_name,
          suggested_difficulty: next.suggested_difficulty,
          reason: next.recommendation
        }
      : null,
    topics: recommendations
  };
}
