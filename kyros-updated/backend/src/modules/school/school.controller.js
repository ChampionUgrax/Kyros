
const schoolService = require("./school.service");

// Directly assign a student to the authenticated school admin.
const assignStudent = async (req, res, next) => {
  try {
    const link = await schoolService.assignStudent(
      req.user.uid,
      req.params.studentUid
    );

    return res.status(201).json({
      success: true,
      message: "Student assigned successfully",
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

// Get students linked to the logged-in school admin
const getAllStudents = async (req, res, next) => {
  try {
    const students = await schoolService.getAllStudents(req.user.uid);

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// Get linked student's focus history
const getStudentFocusHistory = async (req, res, next) => {
  try {
    const { studentUid } = req.params;

    const sessions = await schoolService.getStudentFocusHistory(
      req.user.uid,
      studentUid
    );

    return res.status(200).json({
      success: true,
      message: "Student focus history fetched successfully",
      data: sessions,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};

// Get linked student's activity history
const getStudentActivity = async (req, res, next) => {
  try {
    const { studentUid } = req.params;

    const activities = await schoolService.getStudentActivity(
      req.user.uid,
      studentUid
    );

    return res.status(200).json({
      success: true,
      message: "Student activity fetched successfully",
      data: activities,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};


const getSchoolAnalytics = async (req, res, next) => {
  try {
    const analytics = await schoolService.getSchoolAnalytics(req.user.uid);

    return res.status(200).json({
      success: true,
      message: "School analytics fetched successfully",
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};
    
module.exports = {
  assignStudent,
  getAllStudents,
  getStudentFocusHistory,
  getStudentActivity,
  getSchoolAnalytics
};
