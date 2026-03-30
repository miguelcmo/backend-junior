const authService = require("./auth.service")

const register = async (req, res) => {
    const db = req.app.locals.db
    
    const user = await authService.registerUser(
        db,
        req.body
    )

    res.status(201).json(user)
}

const login = async (req, res) => {
    const db = req.app.locals.db
    
    const result = await authService.loginUser(
        db,
        req.body
    )
    
    if (!result) {
    return res.status(401).json({ message: "Invalid Credentials" })
    }

    res.json(result)
}

module.exports = {
    register,
    login
}