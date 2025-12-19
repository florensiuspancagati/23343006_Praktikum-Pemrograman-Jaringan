// middleware/riwayatAuthMiddleware.js
const jwt = require("jsonwebtoken");

const riwayatAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token tidak ditemukan" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token tidak valid" });
  }
};

module.exports = riwayatAuthMiddleware; 