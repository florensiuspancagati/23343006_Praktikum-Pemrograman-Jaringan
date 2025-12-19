const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },

  spesialisasi: { type: String, default: "" },
  pengalaman: { type: String, default: "" },
  bahasa: { type: String, default: "" },
  lokasi: { type: String, default: "" },
  foto: { type: String, default: "" },
  

  fullname: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  
  kontak: { type: String, default: "" }
}, {
  timestamps: true 
});

module.exports = mongoose.model("Guide", guideSchema);