// importing necessary modules
const express = require('express');   // express framework for building web applications
const cors = require('cors');         // cors to handle cross-origin requests
const connectDB = require('./src/config/mongodb'); // function to connect to MongoDB
const path = require('path');         // path module for handling file paths
const port = 3000;                    // server will run on this port

const app = express();                // create an express application

const userRoutes = require('./src/routes/userRoute');
const verifyAdmin = require('./src/middleware/authAdminMiddleware.js');
const destinasiRoutes = require('./src/routes/destinasiRoute');
const adminRoutes = require('./src/routes/adminRoute');
const riwayatRoutes = require('./src/routes/riwayatRoute');
const guideRoutes = require('./src/routes/guideRoute');

app.use(cors({
    origin: 'http://127.0.0.1:5500', // Sesuai Origin Frontend
    credentials: true,
}));
app.use(express.json());  // 

// connect to mongodb
require("dotenv").config();
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

// main route
app.get('/', (req, res) => {
  res.send('Backend for SUMTOUR is running!');
});

app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`);
});