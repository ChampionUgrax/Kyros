const { auth } = require("../config/firebase");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await auth.verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
    };

    next();

  } catch (error) {
    // Distinguish a bad client token from a server-side Firebase Admin
    // credential/configuration failure. The latter must not be reported as
    // an expired user's token.
    const invalidTokenCodes = new Set([
      "auth/argument-error",
      "auth/invalid-id-token",
      "auth/id-token-expired",
      "auth/id-token-revoked",
    ]);
    if (invalidTokenCodes.has(error.code)) {
      return res.status(401).json({
        success: false,
        message: "Your sign-in session is invalid or expired. Please sign in again.",
      });
    }

    if (process.env.NODE_ENV !== "production") {
      console.error("Firebase Admin token verification failed:", error.code || error.message);
    }
    return res.status(503).json({
      success: false,
      message: "The server cannot verify Firebase sign-in right now. Check the Firebase Admin credential file and project ID in backend/.env.",
    });
  }
};

module.exports = authenticateUser;
