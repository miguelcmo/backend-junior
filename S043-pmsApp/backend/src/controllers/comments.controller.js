// Controller para comentarios en tasks

const getCommentsByTask = async (req, res) => {
    const db = req.app.locals.db
    const taskId = parseInt(req.params.id)

    // Verificar que la task existe
    const task = await db.get("SELECT id FROM tasks WHERE id = ?", [taskId])
    if (!task) {
        return res.status(404).json({ error: "Task no encontrada" })
    }

    const comments = await db.all(`
        SELECT
            c.id,
            c.task_id,
            c.user_id,
            c.content,
            c.created_at,
            u.name as user_name,
            u.email as user_email
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.task_id = ?
        ORDER BY c.created_at ASC
    `, [taskId])

    res.json(comments)
}

const createComment = async (req, res) => {
    const db = req.app.locals.db
    const taskId = parseInt(req.params.id)
    const userId = req.user.id
    const { content } = req.body

    if (!content || content.trim() === '') {
        return res.status(400).json({ error: "El contenido es requerido" })
    }

    // Verificar que la task existe
    const task = await db.get("SELECT id FROM tasks WHERE id = ?", [taskId])
    if (!task) {
        return res.status(404).json({ error: "Task no encontrada" })
    }

    const result = await db.run(
        "INSERT INTO comments (task_id, user_id, content) VALUES (?, ?, ?)",
        [taskId, userId, content.trim()]
    )

    const comment = await db.get(`
        SELECT
            c.id,
            c.task_id,
            c.user_id,
            c.content,
            c.created_at,
            u.name as user_name,
            u.email as user_email
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = ?
    `, [result.lastID])

    res.status(201).json(comment)
}

const deleteComment = async (req, res) => {
    const db = req.app.locals.db
    const commentId = parseInt(req.params.commentId)
    const userId = req.user.id
    const userRole = req.user.role

    const comment = await db.get(
        "SELECT * FROM comments WHERE id = ?",
        [commentId]
    )

    if (!comment) {
        return res.status(404).json({ error: "Comentario no encontrado" })
    }

    // Solo el autor o admin puede eliminar
    if (comment.user_id !== userId && userRole !== 'admin') {
        return res.status(403).json({
            error: "No tienes permiso para eliminar este comentario"
        })
    }

    await db.run("DELETE FROM comments WHERE id = ?", [commentId])

    res.json({ message: "Comentario eliminado" })
}

module.exports = {
    getCommentsByTask,
    createComment,
    deleteComment
}
