// Middleware para verificar si el usuario es miembro del proyecto

const isProjectMember = async (req, res, next) => {
    const db = req.app.locals.db
    const projectId = parseInt(req.params.projectId || req.params.id)
    const userId = req.user.id
    const userRole = req.user.role

    // Admin puede acceder a todo
    if (userRole === 'admin') {
        return next()
    }

    // Verificar si el proyecto existe
    const project = await db.get(
        "SELECT * FROM projects WHERE id = ?",
        [projectId]
    )

    if (!project) {
        return res.status(404).json({ error: "Proyecto no encontrado" })
    }

    // El owner siempre es miembro
    if (project.owner_id === userId) {
        return next()
    }

    // Verificar si es miembro
    const member = await db.get(
        "SELECT * FROM project_members WHERE project_id = ? AND user_id = ?",
        [projectId, userId]
    )

    if (!member) {
        return res.status(403).json({
            error: "No eres miembro de este proyecto"
        })
    }

    next()
}

module.exports = isProjectMember
