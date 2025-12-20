// models/Chat.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  senderRole: {
    type: String,
    enum: ["user", "guide"],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    guideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    messages: [messageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
