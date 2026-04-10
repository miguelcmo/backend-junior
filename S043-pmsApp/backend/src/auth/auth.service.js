const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const SECRET = process.env.JWT_SECRET || "secretkey"

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
        email,
        role: userRole
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

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    }
}

module.exports = {
    registerUser,
    loginUser
}
