const Chat = require("../models/chatModel.js");

exports.getChatsForGuide = async (req, res) => {
  try {
    const chats = await Chat.find({
      guideId: req.userId
    })
      .populate("userId", "fullname username")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: chats
    });
  } catch (err) {
    console.error("❌ Gagal ambil chat guide:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil chat"
    });
  }
};

// controllers/chatController.js
exports.getChatDetail = async (req, res) => {
  try {
    const { userId, guideId } = req.query;

    const chat = await Chat.findOne({ userId, guideId });

    res.json({
      success: true,
      data: chat ? chat.messages : []
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil chat"
    });
  }
};
