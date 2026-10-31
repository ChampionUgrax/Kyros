const express = require("express");

const router = express.Router();

const activityController = require("./activity.controller");
const authenticateUser = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validateBody = require("../../middleware/validate.middleware");
const { createActivitySchema } = require("./activity.validation");

// Browser activity is recorded only for active student accounts.
router.use(authenticateUser, authorizeRoles("student"));

// Record website activity
router.post("/", validateBody(createActivitySchema), activityController.createActivity);

// Get activity history
router.get("/history", activityController.getHistory);

module.exports = router;
