const User = require('../models/userModel');
const Destinasi = require('../models/destinasiModels');
const Guide = require('../models/guideModel');

const getStats = async (req, res) => {
    try {
        const totalUser = await User.countDocuments();
        const totalDestinasi = await Destinasi.countDocuments();
        const totalGuide = await Guide.countDocuments();

        res.json({ totalUser, totalDestinasi, totalGuide });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gagal mengambil data statistik" });
    }
};
 
module.exports = { getStats };
