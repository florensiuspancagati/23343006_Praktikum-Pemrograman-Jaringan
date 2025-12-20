const mongoose = require("mongoose");

const destinasiSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  lokasi: { type: String, required: true },
  kategori: { 
    type: String, 
    enum: ["Alam", "Budaya", "Kuliner", "Sejarah", "Lainnya"],
    required: true 
  },
  biaya: {
    tiket: { type: Number, default: 0 },
    transportasi: { type: Number, default: 0 },
    makanan: { type: Number, default: 0 }
  },
  deskripsi: { type: String },
  gambar: { type: String },
  latitude: Number,
  longitude: Number,
  komentar: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      nama: {
        type: String,
        default: "Anonim"
      },
      isi: {
        type: String,
        required: true
      },
      tanggal: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Destinasi", destinasiSchema);
