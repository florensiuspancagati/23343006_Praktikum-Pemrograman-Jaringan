const express = require("express");
const router = express.Router();
const { getChatsForGuide, getChatDetail } = require("../controllers/chatController");
const auth = require("../middleware/authUserMiddleware");

router.get("/guide", auth, getChatsForGuide);
router.get("/detail", auth, getChatDetail);

module.exports = router;
