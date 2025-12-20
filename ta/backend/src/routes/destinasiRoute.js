const express = require('express');
const router = express.Router();
const destinasiController = require('../controllers/destinasiController.js');
const adminAuth = require('../middleware/authAdminMiddleware.js');
const userAuth = require('../middleware/authUserMiddleware');
const { upload } = require('../middleware/uploadMiddleware.js');
const authUserMiddleware = require('../middleware/authUserMiddleware');

router.post('/add', adminAuth, upload.single('gambar'), destinasiController.addDestinasi);
router.get('/all', adminAuth, destinasiController.getAllDestinasi);
router.get('/:id', adminAuth, destinasiController.getDestinasiById);
router.put('/:id', adminAuth, upload.single('gambar'), destinasiController.updateDestinasi);
router.delete('/:id', adminAuth, destinasiController.deleteDestinasi);


router.get('/public/all', destinasiController.getAllDestinasi);
router.get('/public/:id', destinasiController.getDestinasiById);
router.post('/:id/komentar', authUserMiddleware, destinasiController.addComment);

module.exports = router;