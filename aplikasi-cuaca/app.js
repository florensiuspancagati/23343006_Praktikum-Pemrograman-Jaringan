const request = require('postman-request')

const lokasi = 'Padang Barat'

// MAPBOX
const geocodeURL =
  'https://api.mapbox.com/geocoding/v5/mapbox.places/'+encodeURIComponent(lokasi)+'.json?access_token=pk.eyJ1IjoiZmxvcmVuc2l1cyIsImEiOiJjbWg3c3c5YzcwcTdyMnhwdTVreW1qdXRsIn0.LmgVCoaMP5r1SRvnvVggrQ&limit=1'

request({ url: geocodeURL, json: true }, (error, response) => {
  if (error) {
    return console.log('Tidak dapat terkoneksi ke layanan Mapbox.')
  } else if (response.body.features.length === 0) {
    return console.log('Lokasi tidak ditemukan. Coba cari lokasi lain.')
  }

  const data = response.body.features[0]
  const latitude = data.center[1]
  const longitude = data.center[0]
  const place_name = data.place_name
  const place_type = data.place_type[0]

  console.log(`Koordinat lokasi anda adalah ${latitude}, ${longitude}`)
  console.log(`Data yang anda cari adalah: ${lokasi}`)
  console.log(`Data yang ditemukan adalah: ${place_name}`)
  console.log(`Tipe lokasi adalah: ${place_type}`)

  // WEATHERSTACK
  const weatherURL =
    `http://api.weatherstack.com/current?access_key=ad3f07c5c5973ebae43e7f47368d68d2&query=${latitude},${longitude}`

  request({ url: weatherURL, json: true }, (error, response) => {
    if (error) {
      return console.log('Tidak dapat terkoneksi ke layanan Weatherstack.')
    } else if (response.body.error) {
      return console.log('Tidak dapat menemukan data cuaca. Coba lokasi lain.')
    }

    const current = response.body.current
    const suhu = current.temperature
    const hujan = current.precip
    const deskripsi = current.weather_descriptions[0]

    console.log(`Saat ini suhu di ${lokasi} mencapai ${suhu} derajat celcius.`)
    console.log(`Kemungkinan terjadinya hujan adalah ${hujan}%`)
    console.log(`Deskripsi cuaca: ${deskripsi}`)
  })
})
