const socketAuth = require("../middleware/authSocketMiddleware");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);
 
    // JOIN ROOM
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`📥 Socket ${socket.id} join room ${roomId}`);
    });

    // KIRIM PESAN
    socket.on("send_message", (data) => {
      /*
        data = {
          roomId,
          senderId,
          receiverId,
          message
        }
      */ 

      console.log("💬 Pesan diterima:", data);

      io.to(data.roomId).emit("receive_message", {
        ...data,
        createdAt: new Date()
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};
