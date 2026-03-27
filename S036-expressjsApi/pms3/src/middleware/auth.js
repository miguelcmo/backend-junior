const jwt = require("jsonwebtoken")

const SECRET = "secretkey"

const authenticate = (req, res, next) => {
    const header = req.headers.authorization

    if (!header) {
        return res.status(401).json({ message: "Token required" })
    }
    
    // TOKEN eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJtaWd1ZWxAbWFpbC5jb20iLCJpYXQiOjE3NzQ1NzA1ODEsImV4cCI6MTc3NDU3NDE4MX0.v7EQxKNRJDofHo7DjMtZ7-mBT86uM_eiys9SrTFvT78
    // ["TOKEN", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJtaWd1ZWxAbWFpbC5jb20iLCJpYXQiOjE3NzQ1NzA1ODEsImV4cCI6MTc3NDU3NDE4MX0.v7EQxKNRJDofHo7DjMtZ7-mBT86uM_eiys9SrTFvT78"]
    const token = header.split(" ")[1]

    try {
        const decoded = jwt.verify(token, SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" })
    }
}

module.exports = authenticate