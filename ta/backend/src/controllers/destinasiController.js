const Destinasi = require('../models/destinasiModel.js');

const addDestinasi = async (req, res) => {
    try {
        console.log("=== TAMBAH DESTINASI ===");
        console.log("File upload:", req.file ? "Ya" : "Tidak");
        console.log("URL gambar:", req.body.gambarUrl || "(kosong)");

        const { nama, lokasi, kategori, gambarUrl } = req.body;
        if (!nama || !lokasi || !kategori) {
            return res.status(400).json({ 
                success: false, 
                error: "Nama, lokasi, dan kategori wajib diisi" 
            });
        }

        let gambarPath = '';
        if (gambarUrl && gambarUrl.trim() !== '') {
            gambarPath = gambarUrl.trim();
            console.log("✅ Menggunakan URL gambar");
        } 
        else if (req.file) {
            gambarPath = `/images/${req.file.filename}`;
            console.log("✅ Menggunakan file upload:", req.file.filename);
        }

        const biayaData = {
            tiket: Number(req.body.biaya_tiket) || 0,
            transportasi: Number(req.body.biaya_transportasi) || 0,
            makanan: Number(req.body.biaya_makanan) || 0
        };

        const destinasiBaru = new Destinasi({
            nama: nama.trim(),
            lokasi: lokasi.trim(),
            kategori: kategori.trim(),
            biaya: biayaData,
            deskripsi: req.body.deskripsi ? req.body.deskripsi.trim() : "",
            gambar: gambarPath,
            latitude: req.body.latitude ? Number(req.body.latitude) : null,
            longitude: req.body.longitude ? Number(req.body.longitude) : null
        });

        await destinasiBaru.save();
        
        console.log("✅ Berhasil! ID:", destinasiBaru._id);
        console.log("Gambar:", gambarPath || "(kosong)");

        res.status(201).json({
            success: true,
            message: "Destinasi berhasil ditambahkan",
            data: destinasiBaru
        });
        
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Gagal menambahkan destinasi" 
        });
    }
};

const getAllDestinasi = async (req, res) => {
    try {
        const destinasi = await Destinasi.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: destinasi.length,
            data: destinasi
        });
    } catch (error) {
        console.error("Error get destinasi:", error);
        res.status(500).json({ 
            success: false, 
            error: "Gagal mengambil data destinasi" 
        });
    }
};

const getDestinasiById = async (req, res) => {
    try {
        const destinasi = await Destinasi.findById(req.params.id);
        if (!destinasi) {
            return res.status(404).json({ 
                success: false, 
                error: "Destinasi tidak ditemukan" 
            });
        }
        res.status(200).json({
            success: true,
            data: destinasi
        });
    } catch (error) {
        console.error("Error get destinasi by id:", error);
        res.status(500).json({ 
            success: false, 
            error: "Gagal mengambil data destinasi" 
        });
    }
};

const updateDestinasi = async (req, res) => {
    try {
        const destinasi = await Destinasi.findById(req.params.id);
        if (!destinasi) {
            return res.status(404).json({ 
                success: false, 
                error: "Destinasi tidak ditemukan" 
            });
        }

        destinasi.nama = req.body.nama ? req.body.nama.trim() : destinasi.nama;
        destinasi.lokasi = req.body.lokasi ? req.body.lokasi.trim() : destinasi.lokasi;
        destinasi.kategori = req.body.kategori ? req.body.kategori.trim() : destinasi.kategori;
        destinasi.deskripsi = req.body.deskripsi ? req.body.deskripsi.trim() : destinasi.deskripsi;

        destinasi.biaya = {
            tiket: Number(req.body.biaya_tiket) || destinasi.biaya.tiket || 0,
            transportasi: Number(req.body.biaya_transportasi) || destinasi.biaya.transportasi || 0,
            makanan: Number(req.body.biaya_makanan) || destinasi.biaya.makanan || 0
        };

        destinasi.latitude = req.body.latitude ? Number(req.body.latitude) : destinasi.latitude;
        destinasi.longitude = req.body.longitude ? Number(req.body.longitude) : destinasi.longitude;

        if (req.body.gambarUrl && req.body.gambarUrl.trim() !== '') {
            destinasi.gambar = req.body.gambarUrl.trim();
        } else if (req.file) {
            destinasi.gambar = `/images/${req.file.filename}`;
        }

        await destinasi.save();

        res.status(200).json({
            success: true,
            message: "Destinasi berhasil diupdate",
            data: destinasi
        });

    } catch (error) {
        console.error("Error update destinasi:", error);
        res.status(500).json({ 
            success: false, 
            error: "Gagal mengupdate destinasi" 
        });
    }
};

const deleteDestinasi = async (req, res) => {
    try {
        const destinasi = await Destinasi.findByIdAndDelete(req.params.id);
        
        if (!destinasi) {
            return res.status(404).json({ 
                success: false, 
                error: "Destinasi tidak ditemukan" 
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Destinasi berhasil dihapus"
        });
    } catch (error) {
        console.error("Error delete destinasi:", error);
        res.status(500).json({ 
            success: false, 
            error: "Gagal menghapus destinasi" 
        });
    }
};

module.exports = {
    addDestinasi,
    getAllDestinasi,
    getDestinasiById,
    updateDestinasi,
    deleteDestinasi
};