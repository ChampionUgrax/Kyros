const express = require("express");

const router = express.Router();

const schoolController = require("./school.controller");
const authenticateUser = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validateRequest = require("../../middleware/validate.middleware");
const { studentUidParamsSchema } = require("./school.validation");

// Only authenticated school admins can access these routes
router.use(authenticateUser, authorizeRoles("school_admin", "institute"));

// Get all students
router.get("/students", schoolController.getAllStudents);

// Assign a student directly by Firebase UID.
router.post(
  "/students/:studentUid",
  validateRequest(studentUidParamsSchema, "params"),
  schoolController.assignStudent
);

// Get student's focus history
router.get(
  "/students/:studentUid/focus",
  schoolController.getStudentFocusHistory
);

// Get student's activity history
router.get(
  "/students/:studentUid/activity",
  schoolController.getStudentActivity
);

router.get("/analytics", schoolController.getSchoolAnalytics);

module.exports = router;
