const socketAuth = require("../middleware/authSocketMiddleware");
const Chat = require("../models/chatModel.js");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);
 
    // JOIN ROOM
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`📥 Socket ${socket.id} join room ${roomId}`);
    });

    // KIRIM PESAN
    socket.on("send_message", async (data) => {
      try {
        /*
          data = {
            roomId,
            senderId,
            receiverId,
            role,        // "user" | "guide"
            message
          }
        */

        console.log("💬 Pesan diterima:", data);

        const { senderId, receiverId, role, message, senderName } = data;

        // Tentukan siapa user & guide
        const userId = role === "user" ? senderId : receiverId;
        const guideId = role === "guide" ? senderId : receiverId;

        // Cari chat existing
        let chat = await Chat.findOne({ userId, guideId });

        // Kalau belum ada → buat baru
        if (!chat) {
          chat = await Chat.create({
            userId,
            guideId,
            messages: []
          });
        }

        // Simpan pesan
        chat.messages.push({
          senderId,
          senderName: senderName,
          senderRole: role,
          text: message
        });
        console.log("DEBUG MESSAGE:", chat.messages[chat.messages.length - 1]);

        await chat.save();

        console.log("💾 Chat tersimpan ke DB");

        // Kirim realtime ke room
        io.to(data.roomId).emit("receive_message", {
          senderId,
          senderName,
          text: message,
          senderRole: role,
          createdAt: new Date()
        });

      } catch (err) {
        console.error("❌ Gagal simpan chat:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};
