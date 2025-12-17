const users = []

//tambahPengguna
const tambahPengguna = ({id, username, room}) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if(!username || !room) {
        return {error: 'Username dan room dibutuhkan!'}
    }

    //check for exisiting user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if (existingUser) {
        return { error: 'Username sudah digunakan!'}
    }

    //store user
    const user = {id, username, room}
    users.push(user)
    return {user}
}

//hapusPengguna
const hapusPengguna = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

//ambilPengguna
const ambilPengguna = (id) => {
    return users.find((user) => user.id === id)
}

//ambilPenggunaDariRoom
const ambilPenggunaDariRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
tambahPengguna,
hapusPengguna,
ambilPengguna,
ambilPenggunaDariRoom
}