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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    return res.json({
      message: "Login sukses!",
      token,
      user,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
