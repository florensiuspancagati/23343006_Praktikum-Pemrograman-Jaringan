const fs = require('fs')

// const buku = {
//     judul: 'Belajar Node.js',
//     penulis: 'Florensius Panca Gati',
// }

// const bookJSON = JSON.stringify(buku)
// fs.writeFileSync('1-buku.json', bookJSON)

const dataBuffer = fs.readFileSync('1-buku.json')
const dataJSON = dataBuffer.toString()
const buku = JSON.parse(dataJSON)
console.log(buku.judul)

