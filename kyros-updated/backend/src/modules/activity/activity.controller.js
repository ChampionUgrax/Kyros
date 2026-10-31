const activityService = require("./activity.service");

// Record website activity
const createActivity = async (req, res, next) => {
  try {
    const activity = await activityService.logActivity(
      req.user.uid,
      {
        domain: req.body.domain,
        url: req.body.url,
        title: req.body.title,
        category: req.body.category,
        durationSeconds: req.body.durationSeconds,
        startedAt: req.body.startedAt,
        endedAt: req.body.endedAt,
        source: req.body.source,
      }
    );

    res.status(201).json({
      success: true,
      message: "Activity recorded successfully",
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

// Get activity history
const getHistory = async (req, res, next) => {
  try {
    const activities = await activityService.getActivityHistory(
      req.user.uid
    );

    res.status(200).json({
      success: true,
      message: "Activity history fetched successfully",
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createActivity,
  getHistory,
};