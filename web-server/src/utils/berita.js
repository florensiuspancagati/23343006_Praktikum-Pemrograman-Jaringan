const request = require('postman-request');

const beritaAPI = (callback) => {
    const url = 'http://api.mediastack.com/v1/news?access_key=38f27d6a0e822cf09a6b57aaa38ea936&categories=business&countries=us,id&limit=5';

    request({ url, json: true }, (error, response) => {
        if (error) {
            callback('Tidak dapat terkoneksi ke layanan berita', undefined);
            console.log(error);
        } else if (!response.body.data || response.body.data.length === 0) {
            callback('Berita tidak ditemukan', undefined);
            console.log(response.body);
        } else {
            callback(undefined, response.body.data);
        }
    });
}

module.exports = beritaAPI;
