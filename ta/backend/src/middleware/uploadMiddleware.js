const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: '../../public/images_destinasi/',
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) +  path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) cb(null, true);
        else cb(new Error('Hanya file gambar'));
    }
});

const parseFormData = multer().none();

module.exports = { upload, parseFormData };