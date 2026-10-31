const { db } = require("../../config/firebase");

const ACTIVITY_COLLECTION = "activityLogs";

// Save a website activity event
const logActivity = async (uid, activityData) => {
  const activityRef = db.collection(ACTIVITY_COLLECTION).doc();

  const activity = {
    activityId: activityRef.id,
    uid,

    domain: activityData.domain,
    url: activityData.url || null,
    title: activityData.title || null,

    category: activityData.category || "unclassified",
    durationSeconds: activityData.durationSeconds || 0,

    startedAt: activityData.startedAt
      ? new Date(activityData.startedAt)
      : new Date(),

    endedAt: activityData.endedAt
      ? new Date(activityData.endedAt)
      : null,

    source: activityData.source || "chrome_extension",

    createdAt: new Date(),
  };

  await activityRef.set(activity);

  return activity;
};

// Get a student's activity history
const getActivityHistory = async (uid) => {
  const snapshot = await db
    .collection(ACTIVITY_COLLECTION)
    .where("uid", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return snapshot.docs.map((doc) => doc.data());
};

module.exports = {
  logActivity,
  getActivityHistory,
};