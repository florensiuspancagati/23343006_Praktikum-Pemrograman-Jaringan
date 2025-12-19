const Riwayat = require("../models/riwayatModel.js");

exports.getRiwayat = async (req, res) => {
  try {
    const riwayat = await Riwayat.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: riwayat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRiwayatById = async (req, res) => {
  try {
    const { id } = req.params;
    const riwayat = await Riwayat.findOne({
      _id: id,
      userId: req.userId
    });

    if (!riwayat) {
      return res.status(404).json({ error: "Riwayat tidak ditemukan" });
    }

    res.json({ success: true, data: riwayat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addRiwayat = async (req, res) => {
  try {
    const { nama, lokasi, deskripsi, tanggal, waktu } = req.body;

    if (!req.file) return res.status(400).json({ error: "Gambar wajib diupload!" });

    const newRiwayat = new Riwayat({
      userId: req.userId,
      nama,
      lokasi,
      deskripsi,
      gambar: req.file.filename,
      tanggal: tanggal || new Date().toLocaleDateString("id-ID"),
      waktu: waktu || new Date().toLocaleTimeString("id-ID"),
    });

    await newRiwayat.save();
    res.status(201).json({ success: true, message: "Destinasi berhasil ditambahkan ke riwayat" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateRiwayat = async (req, res) => {
  try {
    const { id } = req.params;

    const oldRiwayat = await Riwayat.findOne({ _id: id, userId: req.userId });

    if (!oldRiwayat) {
      return res.status(404).json({ error: "Riwayat tidak ditemukan" });
    }

    const { nama, lokasi, deskripsi, tanggal, waktu } = req.body;

    let gambarBaru;
    if (req.file) {
      gambarBaru = req.file.filename;
    } else {
      gambarBaru = oldRiwayat.gambar;
    }

    oldRiwayat.nama = nama;
    oldRiwayat.lokasi = lokasi;
    oldRiwayat.deskripsi = deskripsi;
    oldRiwayat.gambar = gambarBaru;
    oldRiwayat.tanggal = tanggal || oldRiwayat.tanggal;
    oldRiwayat.waktu = waktu || oldRiwayat.waktu;

    await oldRiwayat.save();

    res.json({ success: true, message: "Riwayat berhasil diperbarui" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRiwayat = async (req, res) => {
  try {
    const { id } = req.params;
    await Riwayat.deleteOne({ _id: id, userId: req.userId });
    res.json({ success: true, message: "Riwayat berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
