
const focusService = require("./focus.service");

// Start focus session
const startSession = async (req, res, next) => {
  try {
    const session = await focusService.startFocusSession(
      req.user.uid,
      {
        subject: req.body.subject,
        goal: req.body.goal,
      }
    );

    res.status(201).json({
      success: true,
      message: "Focus session started successfully",
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// End focus session
const endSession = async (req, res, next) => {
  try {
    const session = await focusService.endFocusSession(
      req.user.uid,
      req.params.sessionId
    );

    res.status(200).json({
      success: true,
      message: "Focus session ended successfully",
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// Get focus session history
const getHistory = async (req, res, next) => {
  try {
    const sessions = await focusService.getFocusHistory(
      req.user.uid
    );

    res.status(200).json({
      success: true,
      message: "Focus history fetched successfully",
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

// Get active focus session
const getActiveSession = async (req, res, next) => {
  try {
    const session = await focusService.getActiveFocusSession(
      req.user.uid
    );

    res.status(200).json({
      success: true,
      message: "Active focus session fetched successfully",
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startSession,
  endSession,
  getHistory,
  getActiveSession,
};
