const Guide = require("../models/guideModel.js");
const User = require("../models/userModel.js");

exports.getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find().populate("userId", "fullname email phone username");
    res.json({ success: true, data: guides });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getGuideByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    if (user.role !== "guide") {
      return res.status(400).json({ message: "User ini bukan guide" });
    }

    let guide = await Guide.findOne({ userId });

    if (!guide) {
      guide = await Guide.create({
        userId,
        kontak: user.phone,
      });
    }

    const merged = {
      _id: guide._id,
      userId: user._id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      spesialisasi: guide.spesialisasi || "",
      pengalaman: guide.pengalaman || "",
      kontak: guide.kontak || user.phone,
      foto: guide.foto || "",
      bahasa: guide.bahasa || "",
      lokasi: guide.lokasi || ""
    };

    res.json({ success: true, data: merged });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id).populate("userId");

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide tidak ditemukan"
      });
    }

    res.json({ success: true, data: guide });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyGuideProfile = async (req, res) => {
  try {
    const guide = await Guide.findOne({ userId: req.user.id });

    if (!guide) return res.status(404).json({
      success: false,
      message: "Profil guide belum dibuat"
    });

    res.json({ success: true, data: guide });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createGuide = async (req, res) => {
  try {
    const newGuide = new Guide({
      userId: req.body.userId,
      spesialisasi: req.body.spesialisasi,
      pengalaman: req.body.pengalaman,
      kontak: req.body.kontak,
      foto: req.file ? req.file.filename : null,
      ...req.body
    });

    await newGuide.save();

    res.json({ success: true, message: "Guide berhasil dibuat", data: newGuide });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateGuide = async (req, res) => {
  try {
    const userId = req.params.id;
    
    console.log("=== UPDATE GUIDE ===");
    console.log("User ID:", userId);
    console.log("Body Data:", req.body);
    console.log("File:", req.file ? req.file.filename : "No file");
    console.log("====================");

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }
    
    if (user.role !== "guide") {
      return res.status(400).json({
        success: false,
        message: "User ini bukan guide"
      });
    }

    const existingGuide = await Guide.findOne({ userId });
    const userUpdates = {};
    let userUpdated = false;
    
    if (req.body.fullname && req.body.fullname !== user.fullname) {
      userUpdates.fullname = req.body.fullname;
      userUpdated = true;
    }
    
    if (req.body.email && req.body.email !== user.email) {
      userUpdates.email = req.body.email;
      userUpdated = true;
    }
    
    if (req.body.phone && req.body.phone !== user.phone) {
      userUpdates.phone = req.body.phone;
      userUpdated = true;
    }
    
    if (userUpdated) {
      await User.findByIdAndUpdate(userId, userUpdates);
      console.log("✅ Updated user data:", userUpdates);
    }

    const guideUpdates = {};
    let guideUpdated = false;
    
    if (req.body.spesialisasi !== undefined && req.body.spesialisasi !== existingGuide?.spesialisasi) {
      guideUpdates.spesialisasi = req.body.spesialisasi;
      guideUpdated = true;
    }
    
    if (req.body.pengalaman !== undefined && req.body.pengalaman !== existingGuide?.pengalaman) {
      guideUpdates.pengalaman = req.body.pengalaman;
      guideUpdated = true;
    }
    
    if (req.body.bahasa !== undefined && req.body.bahasa !== existingGuide?.bahasa) {
      guideUpdates.bahasa = req.body.bahasa;
      guideUpdated = true;
    }
    
    if (req.body.lokasi !== undefined && req.body.lokasi !== existingGuide?.lokasi) {
      guideUpdates.lokasi = req.body.lokasi;
      guideUpdated = true;
    }
    
    if (req.body.phone && req.body.phone !== existingGuide?.kontak) {
      guideUpdates.kontak = req.body.phone;
      guideUpdated = true;
    }
    
    if (req.body.fullname && req.body.fullname !== existingGuide?.fullname) {
      guideUpdates.fullname = req.body.fullname;
      guideUpdated = true;
    }
    
    if (req.body.email && req.body.email !== existingGuide?.email) {
      guideUpdates.email = req.body.email;
      guideUpdated = true;
    }
    
    if (req.body.phone && req.body.phone !== existingGuide?.phone) {
      guideUpdates.phone = req.body.phone;
      guideUpdated = true;
    }
    
    if (req.file) {
      guideUpdates.foto = req.file.filename;
      guideUpdated = true;
    }

    let result;
    
    if (guideUpdated) {
      result = await Guide.findOneAndUpdate(
        { userId: userId },
        guideUpdates,
        { new: true }
      );
      console.log("✅ Updated guide data:", guideUpdates);
    } else {
      result = await Guide.findOne({ userId });
      console.log("ℹ️ No guide updates needed");
    }

    res.json({
      success: true,
      message: guideUpdated || userUpdated 
        ? "Profil guide berhasil diperbarui" 
        : "Tidak ada perubahan data",
      data: {
        guide: result,
        user: {
          _id: user._id,
          fullname: userUpdates.fullname || user.fullname,
          email: userUpdates.email || user.email,
          phone: userUpdates.phone || user.phone
        }
      }
    });

  } catch (err) {
    console.error("❌ Error updateGuide:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message,
      detail: "Check server console for more details"
    });
  }
};

exports.deleteGuide = async (req, res) => {
  try {
    const deleted = await Guide.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ success: false, error: "Guide tidak ditemukan" });

    res.json({ success: true, message: "Guide berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
