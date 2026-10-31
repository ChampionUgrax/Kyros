const express = require("express");

const router = express.Router();

const focusController = require("./focus.controller");
const authenticateUser = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validateBody = require("../../middleware/validate.middleware");
const {
  startFocusSessionSchema,
  endFocusSessionParamsSchema,
} = require("./focus.validation");

// Focus sessions belong to active student accounts only.
router.use(authenticateUser, authorizeRoles("student"));

// Start a new focus session
router.post(
  "/start",
  validateBody(startFocusSessionSchema),
  focusController.startSession
);

// End an existing focus session
router.patch(
  "/:sessionId/end",
  validateBody(endFocusSessionParamsSchema, "params"),
  focusController.endSession
);

// Get focus session history
router.get("/history", focusController.getHistory);

// Get currently active focus session
router.get("/active", focusController.getActiveSession);

module.exports = router;
