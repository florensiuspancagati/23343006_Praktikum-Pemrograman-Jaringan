const express = require("express");
const router = express.Router();
const guideController = require("../controllers/guideController.js");
const multer = require("multer");
const auth = require("../middleware/authUserMiddleware.js");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const dir = path.join(__dirname, "../../public/images_guide");
      cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan'), false);
    }
  }
});

router.get("/me", auth, guideController.getMyGuideProfile);  
router.get("/all", guideController.getAllGuides);               

// Route berdasarkan userId
router.get("/user/:userId", guideController.getGuideByUserId);  

// Route berdasarkan guideId
router.get("/guide/:id", guideController.getGuideById);         

// Create guide
router.post("/", upload.single("photo"), guideController.createGuide);

// Update guide by userId
router.put("/:id", upload.single("photo"), guideController.updateGuide);

// Delete guide by guideId
router.delete("/:id", guideController.deleteGuide);

// Tambahkan route baru untuk update by guideId
router.put("/update/:id", upload.single("photo"), async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) return res.status(404).json({ error: "Guide not found" });

    // Update guide
    const updatedGuide = await Guide.findByIdAndUpdate(
      req.params.id,
      {
        spesialisasi: req.body.spesialisasi,
        pengalaman: req.body.pengalaman,
        bahasa: req.body.bahasa,
        lokasi: req.body.lokasi,
        ...(req.file && { foto: req.file.filename })
      },
      { new: true }
    );

    // Update user
    await User.findByIdAndUpdate(
      guide.userId,
      {
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone
      }
    );

    res.json({ success: true, data: updatedGuide });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;