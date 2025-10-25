const fs = require('fs')
const chalk = require('chalk')

const importNote = function () {
    return 'Ini Catatan FPG...'
}
const addNote = function (judul, isi) {
    const catatan = loadNote()
    const catatanGanda = catatan.filter(function (note) {
        return note.judul === judul
    })
    
    if (catatanGanda.length === 0) {
        catatan.push({
            judul: judul,
            isi: isi
        })
        saveNote(catatan)
        console.log('Catatan baru ditambahkan!')
    } else {
        console.log('Judul catatan telah dipakai')
    }
}


const deleteNote = function (judul) {
    const catatan = loadNote()
    const catatanUntukDisimpan = catatan.filter(function (note) {
        return note.judul !== judul
    })
    if(catatan.length > catatanUntukDisimpan.length) {
        console.log(chalk.green.inverse('Catatan dihapus!'))
        saveNote(catatanUntukDisimpan)
    } else {
        console.log(chalk.red.inverse('Catatan tidak ditemukan!'))
    }
}



const listNote = function () {
    const catatan = loadNote()
    if (catatan.length === 0) {
        console.log(chalk.red.inverse('Tidak ada catatan yang tersimpan.'))
    } else {
        console.log(chalk.cyan.bold('📚 Daftar Catatan:'))
        catatan.forEach((note, index) => {
            console.log(chalk.yellow(`${index + 1}. ${note.judul}`))
            console.log(chalk.white(`   ${note.isi}\n`))
        })
    }
}



const saveNote = function (catatan) {
    const dataJSON = JSON.stringify(catatan)
    fs.writeFileSync('catatan.json', dataJSON)
}
const loadNote = function () {
    try {
        const dataBuffer = fs.readFileSync('catatan.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}
module.exports = {
    importNote: importNote,
    addNote: addNote,
    deleteNote: deleteNote,
    listNote: listNote
}

