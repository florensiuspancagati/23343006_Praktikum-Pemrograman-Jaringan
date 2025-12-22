const express = require("express");
const router = express.Router();
const { getChatsForGuide, getChatDetail, sendChatRecapEmail } = require("../controllers/chatController");
const auth = require("../middleware/authUserMiddleware");

router.get("/guide", auth, getChatsForGuide);
router.get("/detail", auth, getChatDetail);
router.post("/:chatId/send-recap", auth, sendChatRecapEmail);

module.exports = router;
