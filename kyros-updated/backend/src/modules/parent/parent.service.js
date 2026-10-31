
const { db } = require("../../config/firebase");
const ApiError = require("../../utils/ApiError");
const {
  createLinkDocumentId,
  generateInviteCode,
  hashValue,
} = require("../../utils/link.utils");

const linksCollection = db.collection("parentStudentLinks");
const invitesCollection = db.collection("parentInviteCodes");
const usersCollection = db.collection("users");
const focusCollection = db.collection("focusSessions");
const activityCollection = db.collection("activityLogs");
const PARENT_INVITE_TTL_MS = 15 * 60 * 1000;

// Get students linked to the authenticated parent
const getLinkedStudents = async (parentUid) => {
  const snapshot = await linksCollection
    .where("parentUid", "==", parentUid)
    .get();

  const students = [];

  for (const doc of snapshot.docs) {
    const link = doc.data();

    const studentDoc = await usersCollection
      .doc(link.studentUid)
      .get();

    if (studentDoc.exists) {
      const student = studentDoc.data();

      students.push({
        uid: link.studentUid,
        name: student.name || "",
        email: student.email || "",
        role: student.role || "student",
        relationship: link.relationship || "parent"
      });
    }
  }

  return students;
};

// Verify that parent is linked to student
const verifyStudentAccess = async (parentUid, studentUid) => {
  const snapshot = await linksCollection
    .where("parentUid", "==", parentUid)
    .where("studentUid", "==", studentUid)
    .limit(1)
    .get();

  return !snapshot.empty;
};

// Students create a single-use code that a parent can redeem.
const createParentInvite = async (studentUid) => {
  const code = generateInviteCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + PARENT_INVITE_TTL_MS);

  await invitesCollection.doc(hashValue(code)).set({
    studentUid,
    createdAt: now,
    expiresAt,
    redeemedAt: null,
    redeemedByParentUid: null,
  });

  return { code, expiresAt };
};

// Redeem a student-generated invite and create a parent-student link.
const redeemParentInvite = async (parentUid, code, relationship = "parent") => {
  const inviteRef = invitesCollection.doc(hashValue(code));

  return db.runTransaction(async (transaction) => {
    const inviteSnapshot = await transaction.get(inviteRef);

    if (!inviteSnapshot.exists) {
      throw new ApiError(404, "Invite code not found");
    }

    const invite = inviteSnapshot.data();
    const expiresAt =
      typeof invite.expiresAt?.toDate === "function"
        ? invite.expiresAt.toDate()
        : new Date(invite.expiresAt);
    const now = new Date();

    if (Number.isNaN(expiresAt.getTime()) || expiresAt <= now) {
      throw new ApiError(410, "Invite code has expired");
    }

    if (invite.redeemedAt) {
      throw new ApiError(409, "Invite code has already been redeemed");
    }

    const studentRef = usersCollection.doc(invite.studentUid);
    const studentSnapshot = await transaction.get(studentRef);

    if (!studentSnapshot.exists || studentSnapshot.data().role !== "student") {
      throw new ApiError(404, "Student not found");
    }

    const existingLinkSnapshot = await transaction.get(
      linksCollection
        .where("parentUid", "==", parentUid)
        .where("studentUid", "==", invite.studentUid)
        .limit(1)
    );

    if (!existingLinkSnapshot.empty) {
      throw new ApiError(409, "Parent is already linked to this student");
    }

    const linkRef = linksCollection.doc(
      createLinkDocumentId(parentUid, invite.studentUid)
    );

    transaction.set(linkRef, {
      parentUid,
      studentUid: invite.studentUid,
      relationship,
      createdAt: now,
    });
    transaction.update(inviteRef, {
      redeemedAt: now,
      redeemedByParentUid: parentUid,
    });

    return {
      studentUid: invite.studentUid,
      relationship,
      createdAt: now,
    };
  });
};

// Get student's focus history
const getStudentFocusHistory = async (parentUid, studentUid) => {
  const isLinked = await verifyStudentAccess(parentUid, studentUid);

  if (!isLinked) {
    const error = new Error("You are not authorized to access this student");
    error.statusCode = 403;
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

// Get student's website activity
const getStudentActivity = async (parentUid, studentUid) => {
  const isLinked = await verifyStudentAccess(parentUid, studentUid);

  if (!isLinked) {
    const error = new Error("You are not authorized to access this student");
    error.statusCode = 403;
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


const getParentAnalytics = async (parentUid) => {
  // Get only students linked to this parent
  const students = await getLinkedStudents(parentUid);

  let totalFocusSessions = 0;
  let totalFocusTimeSeconds = 0;
  let completedFocusSessions = 0;
  let totalDistractionTimeSeconds = 0;

  const activityBreakdown = {};
  const childrenAnalytics = [];

  for (const student of students) {
    const studentUid = student.uid;

    // Fetch focus sessions
    const focusSnapshot = await focusCollection
      .where("uid", "==", studentUid)
      .get();

    let childFocusSessions = 0;
    let childFocusTimeSeconds = 0;

    focusSnapshot.forEach(doc => {
      const session = doc.data();

      childFocusSessions++;
      totalFocusSessions++;

      if (session.status === "completed") {
        const duration = Number(session.duration) || 0;

        childFocusTimeSeconds += duration;
        totalFocusTimeSeconds += duration;
        completedFocusSessions++;
      }
    });

    // Fetch activity records
    const activitySnapshot = await activityCollection
      .where("uid", "==", studentUid)
      .get();

    let childDistractionTimeSeconds = 0;

    activitySnapshot.forEach(doc => {
      const activity = doc.data();

      const category = activity.category || "uncategorized";
      const duration = Number(activity.durationSeconds) || 0;

      activityBreakdown[category] =
        (activityBreakdown[category] || 0) + duration;

      if (category === "distraction") {
        totalDistractionTimeSeconds += duration;
        childDistractionTimeSeconds += duration;
      }
    });

    childrenAnalytics.push({
      uid: studentUid,
      name: student.name,
      totalFocusSessions: childFocusSessions,
      totalFocusTimeSeconds: childFocusTimeSeconds,
      distractionTimeSeconds: childDistractionTimeSeconds,
    });
  }

  return {
    totalChildren: students.length,
    totalFocusSessions,
    totalFocusTimeSeconds,
    averageFocusDurationSeconds:
      completedFocusSessions > 0
        ? Math.round(totalFocusTimeSeconds / completedFocusSessions)
        : 0,
    totalDistractionTimeSeconds,
    activityBreakdown,
    childrenAnalytics,
  };
};

// Export services
module.exports = {
  getLinkedStudents,
  verifyStudentAccess,
  createParentInvite,
  redeemParentInvite,
  getStudentFocusHistory,
  getStudentActivity,
  getParentAnalytics
};
