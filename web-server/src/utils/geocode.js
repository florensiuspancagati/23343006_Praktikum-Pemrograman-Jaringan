const request = require('postman-request')

const geocode = (address, callback) => {
    const url ='https://api.mapbox.com/geocoding/v5/mapbox.places/' + 
    encodeURIComponent(address) +'.json?access_token=pk.eyJ1IjoiZmxvcmVuc2l1cyIsImEiOiJjbWg3c3c5YzcwcTdyMnhwdTVreW1qdXRsIn0.LmgVCoaMP5r1SRvnvVggrQ'
    + '&limit=1&country=id&postcode'

    request({ url: url, json: true}, (error, response) => {
        if (error){
            callback('Tidak dapat terkoneksi ke layanan', undefined)
        } else if (response.body.features.length === 0){
            callback('Tidak dapat menemukan lokasi. Lakukan pencarian lokasi yang lain', undefined)
        } else {
            callback(undefined, {
                latitude : response.body.features[0].center[1],
                longitude : response.body.features[0].center[0],
                location : response.body.features[0].place_name
            })
        }
    })
}

module.exports = geocode
