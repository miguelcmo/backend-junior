const jwt = require("jsonwebtoken")

const SECRET = process.env.JWT_SECRET || "secretkey"

const authenticate = (req, res, next) => {
    const header = req.headers.authorization

    if (!header) {
        return res.status(401).json({ error: "Token requerido" })
    }

    const token = header.split(" ")[1]

    if (!token) {
        return res.status(401).json({ error: "Formato de token invalido" })
    }

    try {
        const decoded = jwt.verify(token, SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ error: "Token invalido o expirado" })
    }
}

module.exports = authenticate
