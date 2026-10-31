const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { db } = require("../../config/firebase");
const ApiError = require("../../utils/ApiError");

const userRef = (uid) => db.collection("users").doc(uid);
const attemptRef = (uid) => userRef(uid).collection("studyAttempts");
const quizRef = (uid) => userRef(uid).collection("aiQuizzes");
const materialRef = (uid) => userRef(uid).collection("studyMaterials");
const timestamp = (value) => value?.toDate?.() || (value ? new Date(value) : null);

const getOverview = async (req, res, next) => {
  try {
    const [focus, attempts, materials] = await Promise.all([
      db.collection("focusSessions").where("uid", "==", req.user.uid).get(),
      attemptRef(req.user.uid).get(),
      materialRef(req.user.uid).get(),
    ]);
    const completed = focus.docs.map((doc) => doc.data()).filter((session) => session.status === "completed");
    const minutes = Math.floor(completed.reduce((sum, session) => sum + (Number(session.duration) || 0), 0) / 60);
    const accuracy = attempts.size
      ? Math.round(attempts.docs.filter((doc) => doc.data().first_attempt_correct).length / attempts.size * 100)
      : null;
    return res.json({ success: true, data: [
      { label: "Focus time", value: `${Math.floor(minutes / 60)}h ${minutes % 60}m`, hint: "Recorded sessions" },
      { label: "Practice attempts", value: String(attempts.size), hint: "Across your topics" },
      { label: "Study materials", value: String(materials.size), hint: "Uploaded by you" },
      { label: "Practice accuracy", value: accuracy === null ? "—" : `${accuracy}%`, hint: accuracy === null ? "Try your first quiz" : "First attempts" },
    ] });
  } catch (error) { return next(error); }
};

const getWeakTopics = async (req, res, next) => {
  try {
    const [quizzes, attempts] = await Promise.all([quizRef(req.user.uid).get(), attemptRef(req.user.uid).get()]);
    const topics = new Map();
    quizzes.docs.forEach((doc) => {
      const quiz = doc.data();
      if (quiz.topic_id && quiz.topic_name) topics.set(quiz.topic_id, quiz.topic_name);
    });
    const results = [];
    for (const [id, name] of topics) {
      const records = new Map();
      attempts.docs.forEach((doc) => {
        const attempt = doc.data();
        if (attempt.topic_id === id && attempt.quiz_id && !records.has(attempt.quiz_id)) records.set(attempt.quiz_id, attempt);
      });
      const values = [...records.values()];
      const score = values.length ? Math.round(values.filter((item) => item.first_attempt_correct).length / values.length * 100) : 0;
      results.push({ topic: name, score, attempts: values.length });
    }
    results.sort((a, b) => a.score - b.score);
    return res.json({ success: true, data: results });
  } catch (error) { return next(error); }
};

const getDecks = async (req, res, next) => {
  try {
    const [quizzes, reviews] = await Promise.all([
      quizRef(req.user.uid).get(),
      userRef(req.user.uid).collection("cardReviews").get(),
    ]);
    const reviewed = new Set(reviews.docs.map((doc) => doc.data().quizId));
    const groups = new Map();
    quizzes.docs.forEach((doc) => {
      const quiz = doc.data();
      const key = quiz.sourceMaterialId || quiz.topic_id;
      if (!groups.has(key)) groups.set(key, { id: key, title: quiz.topic_name || "Study notes", questions: [] });
      groups.get(key).questions.push(quiz.quiz_id);
    });
    const decks = [...groups.values()].map((group) => ({
      id: group.id,
      title: group.title,
      dueCount: group.questions.filter((id) => !reviewed.has(id)).length,
    }));
    return res.json({ success: true, data: decks });
  } catch (error) { return next(error); }
};

const getDeckCards = async (req, res, next) => {
  try {
    const snapshot = await quizRef(req.user.uid).get();
    const cards = snapshot.docs.map((doc) => doc.data()).filter((quiz) =>
      quiz.sourceMaterialId === req.params.deckId || (!quiz.sourceMaterialId && quiz.topic_id === req.params.deckId)
    ).map((quiz) => ({
      id: quiz.quiz_id,
      front: quiz.question,
      back: `${quiz.options[quiz.correct_index]}\n\n${quiz.explanation}`,
    }));
    return res.json({ success: true, data: cards });
  } catch (error) { return next(error); }
};

const reviewCard = async (req, res, next) => {
  try {
    const rating = req.body?.rating;
    if (!["again", "hard", "good", "easy"].includes(rating)) throw new ApiError(400, "Choose a valid review rating");
    const quiz = await quizRef(req.user.uid).doc(req.params.cardId).get();
    if (!quiz.exists) throw new ApiError(404, "Revision card not found");
    await userRef(req.user.uid).collection("cardReviews").add({ quizId: req.params.cardId, rating, reviewedAt: new Date() });
    return res.json({ success: true, data: { saved: true } });
  } catch (error) { return next(error); }
};

const getMaterials = async (req, res, next) => {
  try {
    const snapshot = await materialRef(req.user.uid).orderBy("createdAt", "desc").get();
    return res.json({ success: true, data: snapshot.docs.map((doc) => {
      const { text, chunks, ...metadata } = doc.data();
      return { id: doc.id, ...metadata, createdAt: timestamp(metadata.createdAt) };
    }) });
  } catch (error) { return next(error); }
};

const uploadMaterial = async (req, res, next) => {
  let temporaryPath;
  try {
    if (!req.file) throw new ApiError(400, "Select a PDF or TXT file to upload");
    const extension = path.extname(req.file.originalname).toLowerCase();
    temporaryPath = path.join(os.tmpdir(), `kyros-${crypto.randomUUID()}${extension}`);
    await fs.writeFile(temporaryPath, req.file.buffer);
    const { extractNotes, chunkNotes } = await import("../../ai/notesProcessor.js");
    const parsed = await extractNotes(temporaryPath);
    const text = parsed.text.slice(0, 50000);
    const chunks = chunkNotes(text);
    const ref = materialRef(req.user.uid).doc();
    const material = {
      filename: parsed.filename,
      fileType: parsed.file_type,
      pages: parsed.pages,
      characters: text.length,
      chunks: chunks.map((chunk) => chunk.text),
      text,
      createdAt: new Date(),
    };
    await ref.set(material);
    const { text: privateText, chunks: privateChunks, ...metadata } = material;
    return res.status(201).json({ success: true, message: "Study material saved", data: { id: ref.id, ...metadata } });
  } catch (error) {
    if (error.code === "ENOENT") error.message = "The uploaded study material could not be processed";
    return next(error);
  } finally {
    if (temporaryPath) await fs.unlink(temporaryPath).catch(() => {});
  }
};

const getCourses = async (req, res, next) => {
  try {
    const snapshot = await db.collection("courseEnrollments").where("studentUid", "==", req.user.uid).get();
    const rows = await Promise.all(snapshot.docs.map(async (enrollment) => {
      const data = enrollment.data();
      const course = data.courseId ? await db.collection("courses").doc(data.courseId).get() : null;
      if (!course?.exists) return null;
      return { id: course.id, ...course.data(), progress: Number(data.progress) || 0 };
    }));
    return res.json({ success: true, data: rows.filter(Boolean) });
  } catch (error) { return next(error); }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const snapshot = await db.collection("focusSessions").where("status", "==", "completed").limit(500).get();
    const totals = new Map();
    snapshot.docs.forEach((doc) => {
      const session = doc.data();
      totals.set(session.uid, (totals.get(session.uid) || 0) + (Number(session.duration) || 0));
    });
    const ordered = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    const entries = await Promise.all(ordered.map(async ([uid, seconds], index) => {
      const profile = await userRef(uid).get();
      const isSelf = uid === req.user.uid;
      return { id: uid, rank: index + 1, name: isSelf ? "You" : profile.data()?.name || "Learner", value: Math.floor(seconds / 60) };
    }));
    return res.json({ success: true, data: entries });
  } catch (error) { return next(error); }
};

const getGroups = async (req, res, next) => {
  try {
    const snapshot = await db.collection("studyGroups").where("memberUids", "array-contains", req.user.uid).get();
    return res.json({ success: true, data: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) });
  } catch (error) { return next(error); }
};

const getNotifications = async (req, res, next) => {
  try {
    const snapshot = await userRef(req.user.uid).collection("notifications").orderBy("createdAt", "desc").limit(50).get();
    return res.json({ success: true, data: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: timestamp(doc.data().createdAt) })) });
  } catch (error) { return next(error); }
};

const markNotificationRead = async (req, res, next) => {
  try {
    const ref = userRef(req.user.uid).collection("notifications").doc(req.params.notificationId);
    const snap = await ref.get();
    if (!snap.exists) throw new ApiError(404, "Notification not found");
    await ref.update({ read: true });
    return res.json({ success: true, data: { id: ref.id, read: true } });
  } catch (error) { return next(error); }
};

const listChats = async (req, res, next) => {
  try {
    const snapshot = await db.collection("chatThreads").where("memberUids", "array-contains", req.user.uid).orderBy("updatedAt", "desc").get();
    const threads = await Promise.all(snapshot.docs.map(async (doc) => {
      const item = doc.data();
      const peerUid = item.memberUids.find((uid) => uid !== req.user.uid);
      const peer = peerUid ? await userRef(peerUid).get() : null;
      return { id: doc.id, name: peer?.data()?.name || item.title || "Study group", detail: item.title || "Learner", lastMessage: item.lastMessage || "Start a conversation", updatedAt: timestamp(item.updatedAt) };
    }));
    return res.json({ success: true, data: threads });
  } catch (error) { return next(error); }
};

const createChat = async (req, res, next) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email || email.length > 254) throw new ApiError(400, "Enter the email address of a registered learner");
    const matches = await db.collection("users").where("email", "==", email).limit(1).get();
    if (matches.empty) throw new ApiError(404, "No learner was found with that email address");
    const peer = matches.docs[0];
    if (peer.id === req.user.uid) throw new ApiError(400, "You cannot start a chat with yourself");
    const members = [req.user.uid, peer.id].sort();
    const id = crypto.createHash("sha256").update(members.join(":" )).digest("hex");
    const ref = db.collection("chatThreads").doc(id);
    await ref.set({ memberUids: members, updatedAt: new Date() }, { merge: true });
    const data = await ref.get();
    return res.status(201).json({ success: true, data: { id, name: peer.data().name || email, detail: "Learner", lastMessage: data.data().lastMessage || "Start a conversation" } });
  } catch (error) { return next(error); }
};

const getChatMessages = async (req, res, next) => {
  try {
    const threadRef = db.collection("chatThreads").doc(req.params.threadId);
    const thread = await threadRef.get();
    if (!thread.exists || !thread.data().memberUids?.includes(req.user.uid)) throw new ApiError(404, "Conversation not found");
    const snapshot = await threadRef.collection("messages").orderBy("createdAt", "asc").limit(200).get();
    return res.json({ success: true, data: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: timestamp(doc.data().createdAt) })) });
  } catch (error) { return next(error); }
};

const sendChatMessage = async (req, res, next) => {
  try {
    const text = String(req.body?.text || "").trim();
    if (!text || text.length > 2000) throw new ApiError(400, "Message must contain 1 to 2,000 characters");
    const threadRef = db.collection("chatThreads").doc(req.params.threadId);
    const thread = await threadRef.get();
    if (!thread.exists || !thread.data().memberUids?.includes(req.user.uid)) throw new ApiError(404, "Conversation not found");
    const message = { senderUid: req.user.uid, text, createdAt: new Date() };
    const messageRef = await threadRef.collection("messages").add(message);
    const updatedAt = new Date();
    await threadRef.update({ lastMessage: text, updatedAt });
    const recipient = thread.data().memberUids.find((uid) => uid !== req.user.uid);
    if (recipient) await userRef(recipient).collection("notifications").add({
      title: "New message",
      description: "You received a message from a study partner.",
      category: "Messages",
      read: false,
      createdAt: updatedAt,
    });
    return res.status(201).json({ success: true, data: { id: messageRef.id, ...message, createdAt: updatedAt } });
  } catch (error) { return next(error); }
};

module.exports = {
  getOverview, getWeakTopics, getDecks, getDeckCards, reviewCard, getMaterials,
  uploadMaterial, getCourses, getLeaderboard, getGroups, getNotifications,
  markNotificationRead, listChats, createChat, getChatMessages, sendChatMessage,
};
