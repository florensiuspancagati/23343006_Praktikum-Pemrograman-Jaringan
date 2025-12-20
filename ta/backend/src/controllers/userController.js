const User = require("../models/userModel.js");
const Guide = require("../models/guideModel.js");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { fullname, email, phone, username, password, role } = req.body;

    const newUser = new User({
      fullname,
      email,
      phone,
      username,
      password,
      role,
      createdAt: new Date(),
    });

    await newUser.save();

    if (role === "guide") {
      try {
        await Guide.create({
          userId: newUser._id,
          spesialisasi: "",
          pengalaman: "",
          bahasa: "",
          lokasi: "",
          foto: "",
          fullname: fullname,
          email: email,
          phone: phone,
          kontak: phone,
          rating: 0
        });
        console.log(`✅ Guide document created for user: ${newUser._id}`);
      } catch (guideError) {
        console.error("❌ Error creating guide document:", guideError);
      }
    }

    return res.json({
      message: "Registrasi sukses!",
      user: newUser
    });

  } catch (error) {
    console.error("❌ Register error:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const user = await User.findOne({ username, role });
    if (!user)
      return res.status(400).json({ error: "User tidak ditemukan!" });

    if (password !== user.password)
      return res.status(400).json({ error: "Password salah!" });

    // PERBAIKAN: Tambahkan lebih banyak data di token
    const token = jwt.sign(
      { 
        userId: user._id,      // Gunakan userId bukan id
        id: user._id,          // Jaga kompatibilitas
        username: user.username,
        nama: user.nama || user.username,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }     // Tambahkan expiry
    );

    // PERBAIKAN: Response format yang konsisten
    return res.json({
      success: true,           // Tambahkan success flag
      message: "Login sukses!",
      token: token,
      user: {
        _id: user._id,
        username: user.username,
        nama: user.nama || user.username,
        role: user.role
      }
    });

  } catch (err) {
    return res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};