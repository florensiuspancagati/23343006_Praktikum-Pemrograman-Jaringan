const request = require('postman-request')

const urlCuaca = 'http://api.weatherstack.com/current?access_key=ad3f07c5c5973ebae43e7f47368d68d2&query=-0.8976644584004788, 100.3493652562926'

// request({ url: urlCuaca, json: true }, (error, response) => {
//     console.log('Saat ini suhu diluar mencapai '
//         + response.body.current.temperature
//         + ' derajat celcius. Kemungkinan terjadinya hujan adalah'
//         + response.body.current.precip
//         + '%'
//     )
// })

request({ url: urlCuaca, json: true }, (error, response) => {
    if (error) {
        console.log('Tidak dapat terkoneksi ke layanan cuaca.')
    } else if (response.body.error) {
        console.log('Tidak dapat menemukan lokasi.')
    } else {
        console.log(
            'Saat ini suhu di luar mencapai '
            + response.body.current.temperature
            + '°C. '
            + 'Kemungkinan terjadinya hujan adalah '
            + response.body.current.precip
            + '%. '
            + 'Kondisi cuaca saat ini: '
            + response.body.current.weather_descriptions[0] + '.'
        )
    }
})