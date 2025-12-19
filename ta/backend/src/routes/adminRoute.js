const express = require('express');
const router = express.Router();
const Auth = require('../middleware/authAdminMiddleware');
const Destinasi = require('../models/destinasiModel');
const User = require('../models/userModel');

router.get('/stats', Auth, async (req, res) => {
    try {
        const totalDestinasi = await Destinasi.countDocuments();
        const totalUser = await User.countDocuments({ role: 'user' });
        const totalGuide = await User.countDocuments({ role: 'guide' });

        res.status(200).json({
            totalDestinasi,
            totalUser,
            totalGuide
        });
    } catch (err) {
        console.error("Error get admin stats:", err);
        res.status(500).json({ error: "Gagal mengambil statistik" });
    }
});

module.exports = router;
