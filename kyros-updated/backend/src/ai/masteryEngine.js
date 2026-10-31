// KYROS - Student Topic Mastery Engine

export function analyzeTopic(attempts, topicId) {
  if (!Array.isArray(attempts)) {
    throw new Error("Attempts must be an array");
  }

  // Select attempts belonging to the requested topic
  const topicAttempts = attempts.filter(
    attempt => attempt.topic_id === topicId
  );

  // Count each question once, using first-attempt accuracy
  const uniqueAttempts = new Map();

  for (const attempt of topicAttempts) {
    if (
      typeof attempt.quiz_id !== "string" ||
      typeof attempt.first_attempt_correct !== "boolean"
    ) {
      throw new Error("Invalid quiz attempt data");
    }

    if (!uniqueAttempts.has(attempt.quiz_id)) {
      uniqueAttempts.set(attempt.quiz_id, attempt);
    }
  }

  const results = [...uniqueAttempts.values()];
  const total = results.length;

  if (total === 0) {
    return {
      topic_id: topicId,
      total_questions: 0,
      correct_answers: 0,
      accuracy: null,
      status: "UNASSESSED",
      recommendation: "Take an initial quiz."
    };
  }

  const correct = results.filter(
    attempt => attempt.first_attempt_correct
  ).length;

  const accuracy = Math.round((correct / total) * 100);

  let status;
  let recommendation;

  if (accuracy < 50) {
    status = "CRITICAL";
    recommendation =
      "Revise this topic and practice easier questions.";
  } else if (accuracy <= 80) {
    status = "REVIEW";
    recommendation =
      "Practice more questions to improve understanding.";
  } else {
    status = "MASTERED";
    recommendation =
      "Try advanced questions or spaced revision.";
  }

  return {
    topic_id: topicId,
    total_questions: total,
    correct_answers: correct,
    accuracy,
    status,
    recommendation,
    provisional: total < 5
  };
}