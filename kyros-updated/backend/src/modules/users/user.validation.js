const { z } = require("zod");

const profileName = z.string().trim().min(1, "Name is required").max(100);

const createUserProfileSchema = z.object({
  name: profileName,
  role: z.enum(["student", "teacher", "institute"]).default("student"),
});

const updateUserProfileSchema = z.object({
  name: profileName,
});

module.exports = {
  createUserProfileSchema,
  updateUserProfileSchema,
};
