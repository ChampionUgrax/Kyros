
const { db } = require("../../config/firebase");
const ApiError = require("../../utils/ApiError");

const FOCUS_COLLECTION = "focusSessions";

// Start a new focus session
const startFocusSession = async (uid, sessionData = {}) => {
  // Check whether the user already has an active session
  const activeSession = await db
    .collection(FOCUS_COLLECTION)
    .where("uid", "==", uid)
    .where("status", "==", "active")
    .limit(1)
    .get();

  if (!activeSession.empty) {
    throw new ApiError(409, "You already have an active focus session");
  }

  const sessionRef = db.collection(FOCUS_COLLECTION).doc();

  const session = {
    sessionId: sessionRef.id,
    uid,
    subject: sessionData.subject || null,
    goal: sessionData.goal || null,
    startedAt: new Date(),
    endedAt: null,
    duration: 0,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await sessionRef.set(session);

  return session;
};

// End an active focus session
const endFocusSession = async (uid, sessionId) => {
  const sessionRef = db.collection(FOCUS_COLLECTION).doc(sessionId);
  const snapshot = await sessionRef.get();

  if (!snapshot.exists) {
    throw new ApiError(404, "Focus session not found");
  }

  const session = snapshot.data();

  if (session.uid !== uid) {
    throw new ApiError(403, "You are not allowed to end this session");
  }

  if (session.status !== "active") {
    throw new ApiError(409, "This focus session has already ended");
  }

  const endedAt = new Date();
  const startedAt = session.startedAt.toDate();

  const duration = Math.floor(
    (endedAt.getTime() - startedAt.getTime()) / 1000
  );

  await sessionRef.update({
    endedAt,
    duration,
    status: "completed",
    updatedAt: new Date(),
  });

  const updatedSnapshot = await sessionRef.get();

  return updatedSnapshot.data();
};

// Get user's focus session history
const getFocusHistory = async (uid) => {
  const snapshot = await db
    .collection(FOCUS_COLLECTION)
    .where("uid", "==", uid)
    .orderBy("startedAt", "desc")
    .get();

  return snapshot.docs.map((doc) => doc.data());
};

// Get user's active focus session
const getActiveFocusSession = async (uid) => {
  const snapshot = await db
    .collection(FOCUS_COLLECTION)
    .where("uid", "==", uid)
    .where("status", "==", "active")
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data();
};

module.exports = {
  startFocusSession,
  endFocusSession,
  getFocusHistory,
  getActiveFocusSession,
};
