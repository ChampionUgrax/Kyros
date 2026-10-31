const express = require("express");
const multer = require("multer");
const authenticateUser = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const ApiError = require("../../utils/ApiError");
const controller = require("./student.controller");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, done) => {
    if (!/\.(pdf|txt)$/i.test(file.originalname)) return done(new ApiError(415, "Upload a PDF or TXT study file"));
    return done(null, true);
  },
});

router.use(authenticateUser, authorizeRoles("student"));
router.get("/overview", controller.getOverview);
router.get("/weak-topics", controller.getWeakTopics);
router.get("/decks", controller.getDecks);
router.get("/decks/:deckId/cards", controller.getDeckCards);
router.post("/cards/:cardId/review", controller.reviewCard);
router.get("/materials", controller.getMaterials);
router.post("/materials", upload.single("file"), controller.uploadMaterial);
router.get("/courses", controller.getCourses);
router.get("/leaderboard", controller.getLeaderboard);
router.get("/groups", controller.getGroups);
router.get("/notifications", controller.getNotifications);
router.patch("/notifications/:notificationId/read", controller.markNotificationRead);
router.get("/chats", controller.listChats);
router.post("/chats", controller.createChat);
router.get("/chats/:threadId/messages", controller.getChatMessages);
router.post("/chats/:threadId/messages", controller.sendChatMessage);

module.exports = router;
