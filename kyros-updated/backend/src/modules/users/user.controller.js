
const userService = require("./user.service");

// Create user profile
const createUser = async (req, res, next) => {
  try {
    const uid = req.user.uid;

    const user = await userService.createUserProfile(uid, {
      name: req.body.name,
      email: req.user.email,
      role: req.body.role,
    });

    res.status(201).json({
      success: true,
      message: "User profile created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Get logged-in user's profile
const getMyProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.uid);

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update logged-in user's profile
const updateMyProfile = async (req, res, next) => {
  try {
    const user = await userService.updateUserProfile(
      req.user.uid,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getMyProfile,
  updateMyProfile,
};
