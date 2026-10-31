
const { db } = require("../../config/firebase");
const ApiError = require("../../utils/ApiError");
const { createLinkDocumentId } = require("../../utils/link.utils");

const usersCollection = db.collection("users");
const focusCollection = db.collection("focusSessions");
const activityCollection = db.collection("activityLogs");
const linksCollection = db.collection("schoolStudentLinks");

// Verify that a student is linked to this school admin
const verifyStudentAccess = async (schoolAdminUid, studentUid) => {
  const snapshot = await linksCollection
    .where("schoolAdminUid", "==", schoolAdminUid)
    .where("studentUid", "==", studentUid)
    .limit(1)
    .get();

  return !snapshot.empty;
};

// Assign a verified student to the authenticated school admin.
const assignStudent = async (schoolAdminUid, studentUid) => {
  const studentRef = usersCollection.doc(studentUid);

  return db.runTransaction(async (transaction) => {
    const studentSnapshot = await transaction.get(studentRef);

    if (!studentSnapshot.exists || studentSnapshot.data().role !== "student") {
      throw new ApiError(404, "Student not found");
    }

    const existingLinkSnapshot = await transaction.get(
      linksCollection
        .where("schoolAdminUid", "==", schoolAdminUid)
        .where("studentUid", "==", studentUid)
        .limit(1)
    );

    if (!existingLinkSnapshot.empty) {
      throw new ApiError(409, "Student is already assigned to this school admin");
    }

    const now = new Date();
    const linkRef = linksCollection.doc(
      createLinkDocumentId(schoolAdminUid, studentUid)
    );

    transaction.set(linkRef, {
      schoolAdminUid,
      studentUid,
      createdAt: now,
    });

    return {
      studentUid,
      createdAt: now,
    };
  });
};

// Get only students linked to this school admin
const getAllStudents = async (schoolAdminUid) => {
  const snapshot = await linksCollection
    .where("schoolAdminUid", "==", schoolAdminUid)
    .get();

  const students = [];

  for (const doc of snapshot.docs) {
    const link = doc.data();

    const studentDoc = await usersCollection
      .doc(link.studentUid)
      .get();

    if (studentDoc.exists && studentDoc.data().role === "student") {
      const student = studentDoc.data();

      students.push({
        uid: link.studentUid,
        name: student.name || "",
        email: student.email || "",
        role: student.role,
      });
    }
  }

  return students;
};

// Get linked student's focus history
const getStudentFocusHistory = async (schoolAdminUid, studentUid) => {
  const isLinked = await verifyStudentAccess(schoolAdminUid, studentUid);

  if (!isLinked) {
    const error = new Error("You are not authorized to access this student");
    error.statusCode = 403;
    throw error;
  }

  const studentDoc = await usersCollection.doc(studentUid).get();

  if (!studentDoc.exists || studentDoc.data().role !== "student") {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  const snapshot = await focusCollection
    .where("uid", "==", studentUid)
    .orderBy("startedAt", "desc")
    .limit(50)
    .get();

  return snapshot.docs.map(doc => ({
    sessionId: doc.id,
    ...doc.data()
  }));
};

// Get linked student's activity history
const getStudentActivity = async (schoolAdminUid, studentUid) => {
  const isLinked = await verifyStudentAccess(schoolAdminUid, studentUid);

  if (!isLinked) {
    const error = new Error("You are not authorized to access this student");
    error.statusCode = 403;
    throw error;
  }

  const studentDoc = await usersCollection.doc(studentUid).get();

  if (!studentDoc.exists || studentDoc.data().role !== "student") {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  const snapshot = await activityCollection
    .where("uid", "==", studentUid)
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return snapshot.docs.map(doc => ({
    activityId: doc.id,
    ...doc.data()
  }));
};


const getSchoolAnalytics = async (schoolAdminUid) => {
  // Get only students linked to this school admin
  const students = await getAllStudents(schoolAdminUid);

  const studentUids = students.map(student => student.uid);

  let totalFocusSessions = 0;
  let totalFocusTimeSeconds = 0;
  let completedFocusSessions = 0;
  let totalDistractionTimeSeconds = 0;

  const activityBreakdown = {};

  // Fetch focus and activity data for linked students only
  for (const studentUid of studentUids) {
    const focusSnapshot = await focusCollection
      .where("uid", "==", studentUid)
      .get();

    focusSnapshot.forEach(doc => {
      const session = doc.data();

      totalFocusSessions++;

      if (session.status === "completed") {
        const duration = Number(session.duration) || 0;

        totalFocusTimeSeconds += duration;
        completedFocusSessions++;
      }
    });

    const activitySnapshot = await activityCollection
      .where("uid", "==", studentUid)
      .get();

    activitySnapshot.forEach(doc => {
      const activity = doc.data();

      const category = activity.category || "uncategorized";
      const duration = Number(activity.durationSeconds) || 0;

      activityBreakdown[category] =
        (activityBreakdown[category] || 0) + duration;

      if (category === "distraction") {
        totalDistractionTimeSeconds += duration;
      }
    });
  }

  const averageFocusDurationSeconds =
    completedFocusSessions > 0
      ? Math.round(totalFocusTimeSeconds / completedFocusSessions)
      : 0;

  return {
    totalStudents: students.length,
    totalFocusSessions,
    totalFocusTimeSeconds,
    averageFocusDurationSeconds,
    totalDistractionTimeSeconds,
    activityBreakdown,
  };
};

module.exports = {
  assignStudent,
  getAllStudents,
  getStudentFocusHistory,
  getStudentActivity,
  getSchoolAnalytics
};
