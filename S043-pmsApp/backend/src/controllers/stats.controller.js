// Controller para estadisticas del dashboard

const getGeneralStats = async (req, res) => {
    const db = req.app.locals.db
    const userId = req.user.id

    // Total de proyectos
    const totalProjects = await db.get("SELECT COUNT(*) as count FROM projects")

    // Total de tasks
    const totalTasks = await db.get("SELECT COUNT(*) as count FROM tasks")

    // Total de usuarios
    const totalUsers = await db.get("SELECT COUNT(*) as count FROM users")

    // Tasks por status
    const tasksByStatus = await db.all(`
        SELECT status, COUNT(*) as count
        FROM tasks
        GROUP BY status
    `)

    // Tasks por prioridad
    const tasksByPriority = await db.all(`
        SELECT priority, COUNT(*) as count
        FROM tasks
        GROUP BY priority
    `)

    // Mis tasks asignadas
    const myTasks = await db.get(
        "SELECT COUNT(*) as count FROM tasks WHERE user_id = ?",
        [userId]
    )

    // Mis proyectos (owner o miembro)
    const myProjects = await db.get(`
        SELECT COUNT(DISTINCT p.id) as count
        FROM projects p
        LEFT JOIN project_members pm ON p.id = pm.project_id
        WHERE p.owner_id = ? OR pm.user_id = ?
    `, [userId, userId])

    // Tasks completadas vs pendientes
    const completedTasks = await db.get(
        "SELECT COUNT(*) as count FROM tasks WHERE status = 'done'"
    )

    // Tasks vencidas (due_date < hoy y status != done)
    const overdueTasks = await db.get(`
        SELECT COUNT(*) as count FROM tasks
        WHERE due_date < datetime('now')
        AND status != 'done'
    `)

    res.json({
        totalProjects: totalProjects.count,
        totalTasks: totalTasks.count,
        totalUsers: totalUsers.count,
        tasksByStatus: tasksByStatus.reduce((acc, row) => {
            acc[row.status] = row.count
            return acc
        }, {}),
        tasksByPriority: tasksByPriority.reduce((acc, row) => {
            acc[row.priority] = row.count
            return acc
        }, {}),
        myTasks: myTasks.count,
        myProjects: myProjects.count,
        completedTasks: completedTasks.count,
        overdueTasks: overdueTasks.count
    })
}

const getProjectStats = async (req, res) => {
    const db = req.app.locals.db
    const projectId = parseInt(req.params.id)

    // Verificar que el proyecto existe
    const project = await db.get(
        "SELECT * FROM projects WHERE id = ?",
        [projectId]
    )

    if (!project) {
        return res.status(404).json({ error: "Proyecto no encontrado" })
    }

    // Total de tasks del proyecto
    const totalTasks = await db.get(
        "SELECT COUNT(*) as count FROM tasks WHERE project_id = ?",
        [projectId]
    )

    // Tasks por status
    const tasksByStatus = await db.all(`
        SELECT status, COUNT(*) as count
        FROM tasks
        WHERE project_id = ?
        GROUP BY status
    `, [projectId])

    // Tasks por prioridad
    const tasksByPriority = await db.all(`
        SELECT priority, COUNT(*) as count
        FROM tasks
        WHERE project_id = ?
        GROUP BY priority
    `, [projectId])

    // Miembros del proyecto
    const totalMembers = await db.get(`
        SELECT COUNT(*) as count FROM (
            SELECT owner_id as user_id FROM projects WHERE id = ?
            UNION
            SELECT user_id FROM project_members WHERE project_id = ?
        )
    `, [projectId, projectId])

    // Tasks por usuario asignado
    const tasksByUser = await db.all(`
        SELECT
            u.id as user_id,
            u.name as user_name,
            COUNT(t.id) as task_count
        FROM tasks t
        JOIN users u ON t.user_id = u.id
        WHERE t.project_id = ?
        GROUP BY t.user_id
    `, [projectId])

    // Tasks completadas
    const completedTasks = await db.get(
        "SELECT COUNT(*) as count FROM tasks WHERE project_id = ? AND status = 'done'",
        [projectId]
    )

    // Tasks vencidas
    const overdueTasks = await db.get(`
        SELECT COUNT(*) as count FROM tasks
        WHERE project_id = ?
        AND due_date < datetime('now')
        AND status != 'done'
    `, [projectId])

    // Comentarios totales en tasks del proyecto
    const totalComments = await db.get(`
        SELECT COUNT(*) as count
        FROM comments c
        JOIN tasks t ON c.task_id = t.id
        WHERE t.project_id = ?
    `, [projectId])

    // Porcentaje de completado
    const completionRate = totalTasks.count > 0
        ? Math.round((completedTasks.count / totalTasks.count) * 100)
        : 0

    res.json({
        project: {
            id: project.id,
            name: project.name,
            status: project.status
        },
        totalTasks: totalTasks.count,
        completedTasks: completedTasks.count,
        completionRate: completionRate,
        overdueTasks: overdueTasks.count,
        totalMembers: totalMembers.count,
        totalComments: totalComments.count,
        tasksByStatus: tasksByStatus.reduce((acc, row) => {
            acc[row.status] = row.count
            return acc
        }, {}),
        tasksByPriority: tasksByPriority.reduce((acc, row) => {
            acc[row.priority] = row.count
            return acc
        }, {}),
        tasksByUser: tasksByUser
    })
}

module.exports = {
    getGeneralStats,
    getProjectStats
}
