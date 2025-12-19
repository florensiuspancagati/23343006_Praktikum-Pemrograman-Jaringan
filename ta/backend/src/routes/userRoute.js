const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/userController.js");
const auth =  require('../middleware/authUserMiddleware.js');

router.post("/register", register);
router.post("/login", login);
router.get("/login/auth", auth, (req, res) => {
    res.json({
        message: "User is logged in",
        user: req.user,
    });
});

module.exports = router;