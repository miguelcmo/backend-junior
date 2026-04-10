// Middleware para validar datos de registro y login

const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body

    const errors = []

    // Validar nombre
    if (!name || name.trim().length < 2) {
        errors.push("El nombre debe tener al menos 2 caracteres")
    }

    // Validar email
    if (!email) {
        errors.push("El email es requerido")
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            errors.push("El formato del email es invalido")
        }
    }

    // Validar password
    if (!password) {
        errors.push("La contraseña es requerida")
    } else if (password.length < 6) {
        errors.push("La contraseña debe tener al menos 6 caracteres")
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    next()
}

const validateLogin = (req, res, next) => {
    const { email, password } = req.body

    const errors = []

    if (!email) {
        errors.push("El email es requerido")
    }

    if (!password) {
        errors.push("La contraseña es requerida")
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    next()
}

module.exports = {
    validateRegister,
    validateLogin
}
