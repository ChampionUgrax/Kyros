const { z } = require("zod");

const optionalText = (maxLength) =>
  z.string().trim().max(maxLength).nullable().optional();

const timestampInput = z
  .union([z.string(), z.number(), z.date()])
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "Must be a valid timestamp",
  })
  .nullable()
  .optional();

const createActivitySchema = z.object({
  domain: z
    .string()
    .trim()
    .min(1, "Domain is required")
    .max(253)
    .refine((value) => !/\s/.test(value), {
      message: "Domain must not contain whitespace",
    }),
  url: optionalText(2048),
  title: optionalText(500),
  category: optionalText(64),
  durationSeconds: z
    .number()
    .finite()
    .int()
    .nonnegative()
    .max(86400)
    .nullable()
    .optional(),
  startedAt: timestampInput,
  endedAt: timestampInput,
  source: optionalText(64),
});

module.exports = {
  createActivitySchema,
};
