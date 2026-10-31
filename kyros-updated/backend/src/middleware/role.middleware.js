const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.uid) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const { db } = require("../config/firebase");

      const userDoc = await db
        .collection("users")
        .doc(req.user.uid)
        .get();

      if (!userDoc.exists) {
        return res.status(403).json({
          success: false,
          message: "User profile not found",
        });
      }

      const userData = userDoc.data();

      if (!userData.isActive) {
        return res.status(403).json({
          success: false,
          message: "Account is inactive",
        });
      }

      if (!allowedRoles.includes(userData.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource",
        });
      }

      req.user.role = userData.role;
      next();

    } catch (error) {
      next(error);
    }
  };
};

module.exports = authorizeRoles;