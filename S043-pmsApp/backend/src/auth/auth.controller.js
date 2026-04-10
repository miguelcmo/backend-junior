const authService = require("./auth.service")

const register = async (req, res) => {
    const db = req.app.locals.db

    try {
        // Verificar si el email ya existe
        const existingUser = await db.get(
            "SELECT id FROM users WHERE email = ?",
            [req.body.email]
        )

        if (existingUser) {
            return res.status(400).json({
                error: "El email ya esta registrado"
            })
        }

        const user = await authService.registerUser(db, req.body)
        res.status(201).json(user)

    } catch (err) {
        res.status(500).json({
            error: "Error al registrar usuario"
        })
    }
}

const login = async (req, res) => {
    const db = req.app.locals.db

    try {
        const result = await authService.loginUser(db, req.body)

        if (!result) {
            return res.status(401).json({
                error: "Credenciales invalidas"
            })
        }

        res.json(result)

    } catch (err) {
        res.status(500).json({
            error: "Error al iniciar sesion"
        })
    }
}

module.exports = {
    register,
    login
}
