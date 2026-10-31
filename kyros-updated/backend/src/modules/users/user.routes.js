
const express = require("express");

const router = express.Router();

const userController = require("./user.controller");
const authenticateUser = require("../../middleware/auth.middleware");
const validateBody = require("../../middleware/validate.middleware");
const {
  createUserProfileSchema,
  updateUserProfileSchema,
} = require("./user.validation");

// All routes require Firebase authentication

// Create a learner, teacher, or institute profile for the signed-in Firebase user.
router.post(
  "/",
  authenticateUser,
  validateBody(createUserProfileSchema),
  userController.createUser
);

// Get logged-in user's profile
router.get(
  "/me",
  authenticateUser,
  userController.getMyProfile
);

// Update logged-in user's profile
router.patch(
  "/me",
  authenticateUser,
  validateBody(updateUserProfileSchema),
  userController.updateMyProfile
);

module.exports = router;
