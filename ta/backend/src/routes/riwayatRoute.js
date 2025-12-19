const express = require("express");
const router = express.Router();

const riwayatController = require("../controllers/riwayatController.js");
const riwayatAuthMiddleware = require("../middleware/authRiwayatMiddleware.js");
const { upload } = require("../middleware/uploadMiddleware2.js");

// GET riwayat user
router.get("/", riwayatAuthMiddleware, riwayatController.getRiwayat);
router.get("/:id", riwayatAuthMiddleware, riwayatController.getRiwayatById);

// POST tambahkan riwayat
router.post("/add", riwayatAuthMiddleware, upload.single('gambar'), riwayatController.addRiwayat);

// PUT edit riwayat
router.put("/", riwayatAuthMiddleware, upload.single('gambar'), riwayatController.addRiwayat);
router.put("/:id", riwayatAuthMiddleware, upload.single('gambar'), riwayatController.updateRiwayat);

// DELETE hapus riwayat
router.delete("/:id", riwayatAuthMiddleware, riwayatController.deleteRiwayat);

module.exports = router;
