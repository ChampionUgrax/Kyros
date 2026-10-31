const { z } = require("zod");

const optionalText = (maxLength) =>
  z.string().trim().max(maxLength).nullable().optional();

const startFocusSessionSchema = z.object({
  subject: optionalText(120),
  goal: optionalText(500),
});

const endFocusSessionParamsSchema = z.object({
  sessionId: z
    .string()
    .trim()
    .min(1, "Session ID is required")
    .max(128)
    .refine(
      (value) => value !== "." && value !== ".." && !value.includes("/"),
      { message: "Session ID is invalid" }
    ),
});

module.exports = {
  startFocusSessionSchema,
  endFocusSessionParamsSchema,
};
