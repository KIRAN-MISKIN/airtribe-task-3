const { role } = require('../data/inMemoryStore')

const assignRole = (email) => {
    const check = email.split("@")
    if (check[1] === "event.in") {
        return "admin"
    }
    return role
}

module.exports = { assignRole }
