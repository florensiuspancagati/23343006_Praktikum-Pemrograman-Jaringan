const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const transporter = require("../utils/emailTransporter");

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

    if(!chat) {
      return res.json({
        success: true,
        data: null
      });
    }

    res.json({
      success: true,
      data: {
        chatId: chat._id,
        userId: chat.userId,
        guideId: chat.guideId,
        messages: chat.messages,
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil chat"
    });
  }
};


exports.sendChatRecapEmail = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat tidak ditemukan"
      });
    }

    const user = await User.findById(chat.userId);
    const guide = await User.findById(chat.guideId);

    if (!user || !guide) {
      return res.status(400).json({
        success: false,
        message: "User atau Guide tidak ditemukan"
      });
    }

    const chatText = chat.messages.map((msg, i) => {
      const sender =
        msg.senderRole === "user" ? user.fullname : guide.fullname;

      return `${i + 1}. ${sender}:\n${msg.text}\n`;
    }).join("\n");

    const emailContent = `
      Halo ${user.fullname} dan ${guide.fullname},

      Berikut adalah rekap percakapan Anda di SUMTOUR:

      ==============================
      ${chatText}
      ==============================

      Terima kasih telah menggunakan layanan SUMTOUR.
    `;

    await transporter.sendMail({
      from: `"SUMTOUR" <${process.env.EMAIL_USER}>`,
      to: [user.email, guide.email],
      subject: "Rekap Percakapan SUMTOUR",
      text: emailContent
    });

    res.json({
      success: true,
      chatId: chat._id,
      data: chat.messages
    });

  } catch (err) {
    console.error("❌ Gagal kirim email rekap:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengirim email rekap"
    });
  }
};
