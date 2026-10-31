const express = require("express");

const router = express.Router();

const parentController = require("./parent.controller");
const authenticateUser = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validateRequest = require("../../middleware/validate.middleware");
const { redeemParentInviteSchema } = require("./parent.validation");

// Students create the code that gives a parent permission to link to them.
router.post(
  "/invites",
  authenticateUser,
  authorizeRoles("student"),
  parentController.createParentInvite
);

// Authentication + parent role required
router.use(authenticateUser, authorizeRoles("parent"));

router.post(
  "/invites/redeem",
  validateRequest(redeemParentInviteSchema),
  parentController.redeemParentInvite
);

// Parent dashboard APIs
router.get("/analytics", parentController.getParentAnalytics);

router.get("/students", parentController.getLinkedStudents);

router.get(
  "/students/:studentUid/focus",
  parentController.getStudentFocusHistory
);

router.get(
  "/students/:studentUid/activity",
  parentController.getStudentActivity
);

module.exports = router;
