const { z } = require("zod");

const redeemParentInviteSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]{24,128}$/, "Invite code is invalid"),
  relationship: z.string().trim().min(1).max(64).optional(),
});

module.exports = {
  redeemParentInviteSchema,
};
