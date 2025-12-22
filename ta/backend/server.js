// importing necessary modules
require("dotenv").config();
const express = require('express');   // express framework for building web applications
const cors = require('cors');         // cors to handle cross-origin requests
const connectDB = require('./src/config/mongodb'); // function to connect to MongoDB
const path = require('path');         // path module for handling file paths
const port = 3000;                    // server will run on this port

const http = require("http");
const { Server } = require("socket.io");

const app = express();                // create an express application
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

require("./src/socket/chatSocket")(io);

const userRoutes = require('./src/routes/userRoute');
const verifyAdmin = require('./src/middleware/authAdminMiddleware.js');
const destinasiRoutes = require('./src/routes/destinasiRoute');
const adminRoutes = require('./src/routes/adminRoute');
const riwayatRoutes = require('./src/routes/riwayatRoute');
const guideRoutes = require('./src/routes/guideRoute');
const chatRoutes = require('./src/routes/chatRoute');
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: 'http://127.0.0.1:5500', // Sesuai Origin Frontend
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// connect to mongodb
connectDB();

// routes
// user dan/atau riwayat
app.use('/users', userRoutes);
app.use('/riwayat', riwayatRoutes);
app.use('/images_riwayat', express.static(path.join(__dirname, './public/images_riwayat')));

// guide
app.use('/guides', guideRoutes);
app.use('/images_guide', express.static(path.join(__dirname, './public/images_guide')));

// destinasi
app.use('/destinasi', destinasiRoutes);
app.use('/images_destinasi', express.static(path.join(__dirname, './public/images_destinasi')));

// admin
app.use('/admin', adminRoutes);
app.get('/admin/data', verifyAdmin, (req, res) => {
  res.json({ message: "Protected admin route: access granted" });
});

// chat
app.use('/chats', chatRoutes);

// main route
app.get('/', (req, res) => {
  res.send('Backend for SUMTOUR is running!');
});

server.listen(port, () => {
    console.log(`Server + Socket is running on: http://localhost:${port}`);
}); 