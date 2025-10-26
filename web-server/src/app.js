const path = require('path');
const hbs = require('hbs');
const express = require('express');
const geocode = require('./utils/geocode');
const forecast = require('./utils/predCuaca');

const app = express();
const port = 4000;

// MENDEFINISIKAN PATH U/ KONFIGRUASI EXPRESS
const direktoriPublic = path.join(__dirname, '../public');
const direktoriViews = path.join(__dirname, '../templates/views');
const direktoriPartials = path.join(__dirname, '../templates/partials');

// SETUP HANDLEBARS SEBAGAI VIEW ENGINE
app.set('view engine', 'hbs');
app.set('views', direktoriViews);
hbs.registerPartials(direktoriPartials);

// SETUP DIREKTORI STATIS
app.use(express.static(direktoriPublic));

// HALAMAN UTAMA
app.get('', (req, res) => {
    res.render('index', {
        title: 'Aplikasi Cek Cuaca',
        img: '/img/cuaca.png',
        judul: 'Aplikasi cek cuaca nganggo Express.js',
        nama: 'Florensius Panca gati',
    });
})

// HALAMAN BANTUAN
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
        title: 'Bantuan',
        img: '/img/cuaca.png',
        judul: 'Halaman Bantuan Kawula',
        teksBantuan: 'Ini adalah halaman bantuan jika kamu mengalami kesulitan dalam menggunakan aplikasi ini.',
        nama: 'Florensius Panca gati',
    });
})

// HALAMAN INFO CUACA
app.get('/infocuaca', (req, res) => {
    // VALIDASI QUERY ADDRESS
    if(!req.query.address) {
        return res.send({
            error: 'Kowe kudu nyedhiyakake alamat seng arep di golek i!',
        })
    }
    // NGGOLEK KOORDINAT LATITUDE & LONGITUDE
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if(error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if(error) {
                return res.send({ error })
            }
            res.send({
                predCuaca: dataPrediksi,
                lokasi: location,
                alamat: req.query.address,
            })
        })
    })
    // Contoh respon JSON
    res.send([{
        title: 'Info Cuaca',
        img: '/img/cuaca.png',
        predCuaca: 'meh udyan paleng',
        lokasi: 'Kuto Padhang',
    }]);
})

// HALAMAN TENTANG
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        title: 'Tentang',
        img: '/img/cuaca.png',
        judul: 'Halaman Tentang Kawula',
        nama: 'Florensius Panca gati',
        pekerjaan: 'Sedang Berusaha Mencari Pekerjaan:)',
    });
})

// HALAMAN 404
app.all('/bantuan/{*splat}', (req, res) => {
    res.render('404', {
        title: 'Not Found!!!',
        img: '/img/nf.png',
        rel: 'icon',
        judul: '404',
        nama: 'Florensius Panca gati',
        pesanError: 'Artikel bantuan sing kowe goleki ora ketemu!',
    })
});
app.all('{*splat}', (req, res) => {
    res.render('404', {
        title: 'Not Found!!!',
        img: '/img/nf.png',
        rel: 'icon',
        judul: '404',
        nama: 'Florensius Panca gati',
        pesanError: 'Halaman sing kowe goleki ora ketemu!',
    })
});

// MEMULAI SERVER
app.listen(port, () => {
    console.log(`Server mlaku ing http://localhost:${port}`);
})
