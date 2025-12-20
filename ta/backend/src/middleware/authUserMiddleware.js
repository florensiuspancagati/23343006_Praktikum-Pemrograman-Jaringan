const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  console.log("=== AUTH MIDDLEWARE ===");
  console.log("Endpoint:", req.method, req.originalUrl);
  
  // Ambil token dari Authorization header
  let token = null;
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
    console.log("Token dari Authorization header");
  }
  
  // Juga cek dari cookies (jika ada)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log("Token dari cookies");
  }

  if (!token) {
    console.log("❌ Tidak ada token ditemukan");
    return res.status(401).json({ 
      success: false,
      error: "Akses ditolak. Silakan login terlebih dahulu." 
    });
  }

  console.log("Token ditemukan, length:", token.length);

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token valid, payload:", decoded);
    
    // SIMPAN user data untuk konsisten dengan riwayat controller
    // Gunakan berbagai kemungkinan field name
    req.userId = decoded.userId || decoded.id || decoded._id;
    req.user = {
      _id: decoded.userId || decoded.id || decoded._id,
      userId: decoded.userId || decoded.id || decoded._id,
      nama: decoded.nama || decoded.username,
      username: decoded.username,
      role: decoded.role
    };
    
    // Untuk kompatibilitas dengan riwayat controller
    if (!req.userId) {
      console.warn("⚠️ userId tidak ditemukan di token, menggunakan default");
      req.userId = "unknown_user";
    }
    
    console.log("req.userId:", req.userId);
    console.log("req.user:", req.user);
    
    next();
  } catch (err) {
    console.error("❌ Token verification error:", err.message);
    
    let errorMsg = "Token tidak valid";
    if (err.name === 'TokenExpiredError') {
      errorMsg = "Sesi telah berakhir, silakan login kembali";
    } else if (err.name === 'JsonWebTokenError') {
      errorMsg = "Format token salah";
    }
    
    return res.status(401).json({ 
      success: false,
      error: errorMsg 
    });
  }
};

// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {
//   const token = req.cookies.token;

//   if (!token) return res.status(401).json({ error: "Belum login!" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Token tidak valid!" });
//   }
// };
 