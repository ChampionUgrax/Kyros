const path = require("node:path");
const { db } = require("../../config/firebase");
const ApiError = require("../../utils/ApiError");

const userRef = (uid) => db.collection("users").doc(uid);
const importAi = () => import("../../ai/aiService.js");

function getAiFailure(error) {
  const status = Number(error?.status || error?.statusCode || error?.response?.status);
  const code = String(error?.code || error?.status || "").toLowerCase();
  const message = String(error?.message || "").toLowerCase();

  if (message.includes("gemini_api_key") || message.includes("api key not valid") || message.includes("invalid api key")) {
    return new ApiError(503, "AI setup is incomplete. Check GEMINI_API_KEY in backend/.env, then restart the backend.");
  }
  if (status === 429 || code.includes("resource_exhausted") || message.includes("quota") || message.includes("rate limit")) {
    return new ApiError(503, "The AI service has reached its current usage limit. Check the Gemini API quota and try again later.");
  }
  if (status === 404 || code.includes("not_found") || message.includes("model not found") || message.includes("not supported for generatecontent")) {
    return new ApiError(503, "The configured Gemini model is unavailable for this API key. Check GEMINI_MODEL in backend/.env.");
  }
  if (status === 401 || status === 403 || code.includes("unauthenticated") || code.includes("permission_denied") || message.includes("permission denied")) {
    return new ApiError(503, "Gemini rejected the server API key or its permissions. Check GEMINI_API_KEY and the enabled Gemini API project.");
  }
  if (message.includes("at least 80 characters") || message.includes("not enough readable text")) {
    return new ApiError(422, "This file has too little readable text. Upload a text-based PDF or TXT file with at least 80 characters.");
  }
  if (message.includes("invalid json") || message.includes("validation failed") || error?.name === "ZodError") {
    return new ApiError(502, "The AI could not create a valid practice question from this file. Try again or upload different notes.");
  }
  return new ApiError(502, "AI question generation failed. Check the backend terminal for the diagnostic message, then try again.");
}

async function readNotes(req) {
  if (req.file) {
    const extension = path.extname(req.file.originalname).toLowerCase();
    if (extension === ".txt") return req.file.buffer.toString("utf8");
    if (extension !== ".pdf") throw new ApiError(415, "Upload a PDF or TXT study file");

    try {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: new Uint8Array(req.file.buffer) });
      try {
        const result = await parser.getText();
        return result.text || "";
      } finally {
        await parser.destroy();
      }
    } catch (error) {
      console.error("Study PDF text extraction failed:", error.code || error.message);
      throw new ApiError(422, "This PDF could not be read. Try a text-based PDF or upload a TXT file.");
    }
  }
  return typeof req.body.notesText === "string" ? req.body.notesText : "";
}

const createQuiz = async (req, res, next) => {
  try {
    const notesText = await readNotes(req);
    if (notesText.trim().length < 80) {
      throw new ApiError(422, "Add at least 80 characters of readable study notes before generating a question.");
    }
    const topicId = String(req.body.topicId || "study-notes").trim().slice(0, 80);
    const topicName = String(req.body.topicName || req.file?.originalname || "Study notes").trim().slice(0, 120);
    const { getAIQuizFromNotes } = await importAi();
    const { publicQuiz, privateQuiz } = await getAIQuizFromNotes(notesText, topicId, topicName);

    try {
      await userRef(req.user.uid).collection("aiQuizzes").doc(privateQuiz.quiz_id).set({
        ...privateQuiz,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Saving generated quiz failed:", error.code || error.message);
      throw new ApiError(503, "The question was generated but could not be saved. Check the Firebase Admin and Firestore configuration.");
    }

    return res.status(201).json({
      success: true,
      message: "Practice question created",
      data: publicQuiz,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    console.error("AI quiz generation failed:", error.code || error.status || error.message);
    return next(getAiFailure(error));
  }
};

const submitAnswer = async (req, res, next) => {
  try {
    const selectedIndex = req.body?.selectedIndex;
    if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex > 3) {
      throw new ApiError(400, "Choose one of the four answer options");
    }

    const quizRef = userRef(req.user.uid).collection("aiQuizzes").doc(req.params.quizId);
    const quizSnapshot = await quizRef.get();
    if (!quizSnapshot.exists) throw new ApiError(404, "Practice question not found");

    const quiz = quizSnapshot.data();
    const { validateGeneratedAnswer } = await import("../../ai/answerValidator.js");
    const result = validateGeneratedAnswer(quiz, selectedIndex);
    const attempt = {
      quiz_id: quiz.quiz_id,
      topic_id: quiz.topic_id,
      first_attempt_correct: result.correct,
      selected_index: selectedIndex,
      createdAt: new Date(),
    };
    await userRef(req.user.uid).collection("studyAttempts").add(attempt);

    const [quizList, attemptList] = await Promise.all([
      userRef(req.user.uid).collection("aiQuizzes").get(),
      userRef(req.user.uid).collection("studyAttempts").get(),
    ]);
    const topics = [...new Map(quizList.docs.map((doc) => {
      const item = doc.data();
      return [item.topic_id, { id: item.topic_id, name: item.topic_name }];
    })).values()];
    const attempts = attemptList.docs.map((doc) => doc.data());
    const { recommendStudyPlan } = await import("../../ai/recommendationEngine.js");
    const studyPlan = recommendStudyPlan(attempts, topics);

    return res.status(200).json({
      success: true,
      data: { ...result, correctIndex: quiz.correct_index, studyPlan },
    });
  } catch (error) {
    return next(error);
  }
};

const getStudyPlan = async (req, res, next) => {
  try {
    const [quizList, attemptList] = await Promise.all([
      userRef(req.user.uid).collection("aiQuizzes").get(),
      userRef(req.user.uid).collection("studyAttempts").get(),
    ]);
    const topics = [...new Map(quizList.docs.map((doc) => {
      const item = doc.data();
      return [item.topic_id, { id: item.topic_id, name: item.topic_name }];
    })).values()];
    const attempts = attemptList.docs.map((doc) => doc.data());
    const { recommendStudyPlan } = await import("../../ai/recommendationEngine.js");
    return res.json({ success: true, data: recommendStudyPlan(attempts, topics) });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createQuiz, submitAnswer, getStudyPlan };
