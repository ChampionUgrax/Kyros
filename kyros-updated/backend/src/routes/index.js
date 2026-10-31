const express = require("express");

const router = express.Router();

const userRoutes = require("../modules/users/user.routes");
const focusRoutes = require("../modules/focus/focus.routes");
const activityRoutes = require("../modules/activity/activity.routes");
const parentRoutes = require("../modules/parent/parent.routes");
const schoolRoutes = require("../modules/school/school.routes");
const aiRoutes = require("../modules/ai/ai.routes");
const studentRoutes = require("../modules/student/student.routes");


// User APIs
router.use("/users", userRoutes);

// Focus Session APIs
router.use("/focus", focusRoutes);

// Activity Tracking APIs
router.use("/activity", activityRoutes);


router.use("/parent", parentRoutes);

// School APIs
router.use("/school", schoolRoutes);

// Notes-based AI quizzes and personalized recommendations
router.use("/ai", aiRoutes);
router.use("/student", studentRoutes);

module.exports = router;
