// Controller para miembros de proyecto

const getProjectMembers = async (req, res) => {
    const db = req.app.locals.db
    const projectId = parseInt(req.params.id)

    const members = await db.all(`
        SELECT
            pm.id,
            pm.project_id,
            pm.user_id,
            pm.role,
            pm.joined_at,
            u.name,
            u.email
        FROM project_members pm
        JOIN users u ON pm.user_id = u.id
        WHERE pm.project_id = ?
    `, [projectId])

    res.json(members)
}

const addProjectMember = async (req, res) => {
    const db = req.app.locals.db
    const projectId = parseInt(req.params.id)
    const { user_id, role = 'member' } = req.body

    if (!user_id) {
        return res.status(400).json({ error: "user_id es requerido" })
    }

    // Verificar que el usuario existe
    const user = await db.get("SELECT id FROM users WHERE id = ?", [user_id])
    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" })
    }

    // Verificar que el proyecto existe
    const project = await db.get("SELECT id FROM projects WHERE id = ?", [projectId])
    if (!project) {
        return res.status(404).json({ error: "Proyecto no encontrado" })
    }

    // Verificar si ya es miembro
    const existing = await db.get(
        "SELECT id FROM project_members WHERE project_id = ? AND user_id = ?",
        [projectId, user_id]
    )
    if (existing) {
        return res.status(400).json({ error: "El usuario ya es miembro del proyecto" })
    }

    const result = await db.run(
        "INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)",
        [projectId, user_id, role]
    )

    const member = await db.get(`
        SELECT
            pm.id,
            pm.project_id,
            pm.user_id,
            pm.role,
            pm.joined_at,
            u.name,
            u.email
        FROM project_members pm
        JOIN users u ON pm.user_id = u.id
        WHERE pm.id = ?
    `, [result.lastID])

    res.status(201).json(member)
}

const removeProjectMember = async (req, res) => {
    const db = req.app.locals.db
    const projectId = parseInt(req.params.id)
    const userId = parseInt(req.params.userId)

    // Verificar que el miembro existe
    const member = await db.get(
        "SELECT * FROM project_members WHERE project_id = ? AND user_id = ?",
        [projectId, userId]
    )

    if (!member) {
        return res.status(404).json({ error: "Miembro no encontrado en el proyecto" })
    }

    // No permitir remover al owner del proyecto
    const project = await db.get("SELECT owner_id FROM projects WHERE id = ?", [projectId])
    if (project.owner_id === userId) {
        return res.status(400).json({ error: "No se puede remover al owner del proyecto" })
    }

    await db.run(
        "DELETE FROM project_members WHERE project_id = ? AND user_id = ?",
        [projectId, userId]
    )

    res.json({ message: "Miembro removido del proyecto" })
}

module.exports = {
    getProjectMembers,
    addProjectMember,
    removeProjectMember
}
