const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const SECRET = "secretkey"

const registerUser = async (db, data) => {
    const { name, email, password, role } = data

    const userRole = role || 'user'

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await db.run(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, userRole]
    )

    return {
        id: result.lastID,
        name,
        email
    }
}

const loginUser = async (db, data) => {
    const { email, password } = data

    const user = await db.get(
        "SELECT * FROM users WHERE email = ?",
        [email]
    )

    if (!user) return null

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) return null

    const token = jwt.sign(
        { 
            id: user.id, 
            email: user.email,
            role: user.role
        },
        SECRET,
        { expiresIn: "1h" }
    )

    return { token }
}

module.exports = {
    registerUser,
    loginUser
}