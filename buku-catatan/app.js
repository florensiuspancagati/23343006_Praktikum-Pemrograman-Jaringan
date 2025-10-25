// const fs = require('fs')
// // fs.writeFileSync('catatan.txt', 'Konjuk Ing Asma Dalem Hyang Rama, Saha Hyang Putra, Tuwin Hyang Roh Suci')
// // fs.appendFileSync('catatan.txt', '\nRama Kawula Ing Swarga, Asma Dalem Kaluhurna, Kraton Dalem Mugi Rawuha')

// const chalk = require('chalk')
// const validator = require('validator')
// const catatan = require('./catatan.js')
// const pesan = catatan()
// const command = process.argv[2]
// // console.log(pesan)
// // console.log(validator.isURL('https://panca.com'))
// // console.log(chalk.blue(pesan))
// // console.log(chalk.red.italic.bold(pesan))
// // console.log(chalk.green.underline.bold(pesan))
// console.log(process.argv)

// if(command === 'tambah') {
//     console.log('Tambah data catatan')
// } else if(command === 'hapus') {
//     console.log('Hapus data catatan')
// }

const yargs = require('yargs')
const catatan = require('./catatan.js')
const { argv } = require('process')
// yargs.version('10.1.0')

yargs.command({
    command: 'tambah',
    describe: 'Menambahkan catatan baru',
    builder: {
        judul: {
            describe: 'Judul catatan',
            demandOption: true,
            type: 'string'
        },
        isi: {
            describe: 'Isi catatan',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function(argv) {
        catatan.addNote(argv.judul, argv.isi)
    }
})

yargs.command({
    command: 'hapus',
    describe: 'Menghapus catatan',
    builder: {
        judul: {
            describe: 'Judul catatan',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function(argv) {
        catatan.deleteNote(argv.judul)
    }
})

yargs.command({
    command: 'lihat',
    describe: 'Melihat catatan',
    handler: function() {
        catatan.listNote()
    }
})

yargs.parse()