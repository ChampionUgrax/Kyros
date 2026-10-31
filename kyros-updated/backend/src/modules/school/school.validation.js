const { z } = require("zod");

const studentUidParamsSchema = z.object({
  studentUid: z
    .string()
    .trim()
    .min(1, "Student UID is required")
    .max(128)
    .refine(
      (value) => value !== "." && value !== ".." && !value.includes("/"),
      { message: "Student UID is invalid" }
    ),
});

module.exports = {
  studentUidParamsSchema,
};
