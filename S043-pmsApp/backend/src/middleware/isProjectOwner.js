// Middleware para verificar si el usuario es owner del proyecto o admin

const isProjectOwner = async (req, res, next) => {
    const db = req.app.locals.db
    const projectId = parseInt(req.params.id)
    const userId = req.user.id
    const userRole = req.user.role

    // Admin puede hacer todo
    if (userRole === 'admin') {
        return next()
    }

    // Verificar si el usuario es owner del proyecto
    const project = await db.get(
        "SELECT * FROM projects WHERE id = ?",
        [projectId]
    )

    if (!project) {
        return res.status(404).json({ error: "Proyecto no encontrado" })
    }

    if (project.owner_id !== userId) {
        return res.status(403).json({
            error: "No tienes permiso para modificar este proyecto"
        })
    }

    next()
}

module.exports = isProjectOwner
