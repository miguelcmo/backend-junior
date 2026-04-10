// Controller para usuarios

const getUsers = async (req, res) => {
    const db = req.app.locals.db

    // Obtener usuarios sin el password
    const users = await db.all(
        "SELECT id, name, email, role, created_at FROM users"
    )

    res.json(users)
}

const getUserById = async (req, res) => {
    const db = req.app.locals.db
    const id = parseInt(req.params.id)

    const user = await db.get(
        "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
        [id]
    )

    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" })
    }

    res.json(user)
}

module.exports = {
    getUsers,
    getUserById
}
