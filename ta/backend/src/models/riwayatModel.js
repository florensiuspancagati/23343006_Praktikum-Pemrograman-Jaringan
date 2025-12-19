const mongoose = require("mongoose");

const riwayatSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  nama: { type: String, required: true },
  lokasi: { type: String, required: true },
  gambar: { type: String, required: true },
  deskripsi: { type: String, required: true },
  tanggal: { type: String },
  waktu: { type: String },

  createdAt: { type: Date, default: Date.now }
}, {timestamps: true});

module.exports = mongoose.model("Riwayat", riwayatSchema);
