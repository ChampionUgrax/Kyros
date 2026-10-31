const express = require("express");
const multer = require("multer");
const ApiError = require("../../utils/ApiError");
const authenticateUser = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const controller = require("./ai.controller");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, done) => {
    const allowed = /\.(pdf|txt)$/i.test(file.originalname);
    if (!allowed) return done(new ApiError(415, "Upload a PDF or TXT study file"));
    return done(null, true);
  },
});

router.use(authenticateUser, authorizeRoles("student"));
router.post("/quizzes", upload.single("file"), controller.createQuiz);
router.post("/quizzes/:quizId/answer", controller.submitAnswer);
router.get("/study-plan", controller.getStudyPlan);

module.exports = router;
