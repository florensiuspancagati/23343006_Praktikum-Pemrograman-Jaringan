const jwt = require("jsonwebtoken");

module.exports = function socketAuth(socket, next) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("No token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = {
      id: decoded.userId || decoded.id,
      role: decoded.role,
      nama: decoded.nama || decoded.username
    };

    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
};
