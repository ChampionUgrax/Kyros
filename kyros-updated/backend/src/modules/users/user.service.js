const { db } = require("../../config/firebase");
const ApiError = require("../../utils/ApiError");

const USERS_COLLECTION = "users";

// Create user profile
const createUserProfile = async (uid, userData) => {
  const userRef = db.collection(USERS_COLLECTION).doc(uid);

  const existingUser = await userRef.get();

  if (existingUser.exists) {
    throw new ApiError(409, "User profile already exists");
  }

  const userProfile = {
    uid,
    name: userData.name,
    email: userData.email,
    role: userData.role || "student",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await userRef.set(userProfile);

  return userProfile;
};

// Get user profile
const getUserById = async (uid) => {
  const userRef = db.collection(USERS_COLLECTION).doc(uid);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    throw new ApiError(404, "User not found");
  }

  return snapshot.data();
};

// Update user profile
const updateUserProfile = async (uid, updates) => {
  const allowedFields = ["name"];

  const filteredUpdates = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  }

  if (Object.keys(filteredUpdates).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  filteredUpdates.updatedAt = new Date();

  const userRef = db.collection(USERS_COLLECTION).doc(uid);
  const existingUser = await userRef.get();

  if (!existingUser.exists) {
    throw new ApiError(404, "User not found");
  }

  await userRef.update(filteredUpdates);

  const updatedUser = await userRef.get();

  return updatedUser.data();
};

module.exports = {
  createUserProfile,
  getUserById,
  updateUserProfile,
};
