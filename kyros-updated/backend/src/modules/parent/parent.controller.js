
const parentService = require("./parent.service");

// Create a one-time parent-pairing code for the authenticated student.
const createParentInvite = async (req, res, next) => {
  try {
    const invite = await parentService.createParentInvite(req.user.uid);

    return res.status(201).json({
      success: true,
      message: "Parent invite created successfully",
      data: invite,
    });
  } catch (error) {
    next(error);
  }
};

// Redeem a student-generated pairing code as the authenticated parent.
const redeemParentInvite = async (req, res, next) => {
  try {
    const link = await parentService.redeemParentInvite(
      req.user.uid,
      req.body.code,
      req.body.relationship
    );

    return res.status(201).json({
      success: true,
      message: "Student linked successfully",
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

// Get all linked students
const getLinkedStudents = async (req, res, next) => {
  try {
    const students = await parentService.getLinkedStudents(
      req.user.uid
    );

    res.status(200).json({
      success: true,
      message: "Linked students fetched successfully",
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// Get student's focus history
const getStudentFocusHistory = async (req, res, next) => {
  try {
    const { studentUid } = req.params;

    const sessions = await parentService.getStudentFocusHistory(
      req.user.uid,
      studentUid
    );

    res.status(200).json({
      success: true,
      message: "Student focus history fetched successfully",
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

// Get student's website activity
const getStudentActivity = async (req, res, next) => {
  try {
    const { studentUid } = req.params;

    const activities = await parentService.getStudentActivity(
      req.user.uid,
      studentUid
    );

    res.status(200).json({
      success: true,
      message: "Student activity fetched successfully",
      data: activities
    });
  } catch (error) {
    next(error);
  }
};


const getParentAnalytics = async (req, res, next) => {
  try {
    const analytics = await parentService.getParentAnalytics(req.user.uid);

    return res.status(200).json({
      success: true,
      message: "Parent analytics fetched successfully",
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createParentInvite,
  redeemParentInvite,
  getLinkedStudents,
  getStudentFocusHistory,
  getStudentActivity,
  getParentAnalytics
};
