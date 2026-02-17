const bcrypt = require('bcryptjs');

const users = [
    {
        id: 1,
        email: "admin@example.com",
        password: bcrypt.hashSync("password123", 10),
        role: "admin"
    }
];

module.exports = users;