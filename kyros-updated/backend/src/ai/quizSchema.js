import { z } from "zod";

export const quizSchema = z.object({
  quiz_id: z.string().min(1),
  topic_id: z.string().min(1),
  topic_name: z.string().min(1),
  question: z.string().min(10),
  options: z.array(z.string().min(1)).length(4),
  correct_index: z.number().int().min(0).max(3),
  socratic_hint: z.string().min(5),
  explanation: z.string().min(5)
}).refine(
  q => new Set(q.options.map(x => x.trim().toLowerCase())).size === 4,
  { message: "Options must be unique" }
);

export function validateQuiz(quiz) {
  return quizSchema.parse(quiz);
}
