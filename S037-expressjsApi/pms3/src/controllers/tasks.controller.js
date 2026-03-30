const getTasksByProject = async (req, res) => {
    const db = req.app.locals.db;
    const projectId = parseInt(req.params.projectId);

    const tasks = await db.all(
        "SELECT * FROM tasks WHERE project_id = ?",
        [projectId]
    );

    res.json(tasks);
};

// POST /api/projects/:projectId/tasks
const createTask = async (req, res) => {
    const db = req.app.locals.db;
    const projectId = parseInt(req.params.projectId);

    const {
        title,
        description,
        status = "pending",
        priority = "medium",
        user_id,
        due_date
    } = req.body;

    const result = await db.run(
        `INSERT INTO tasks 
        (title, description, status, priority, project_id, user_id, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, description, status, priority, projectId, user_id, due_date]
    );

    const newTask = await db.get(
        "SELECT * FROM tasks WHERE id = ?",
        [result.lastID]
    );

    res.status(201).json(newTask);
};

const getTaskById = async (req, res) => {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id);

    const task = await db.get(
        "SELECT * FROM tasks WHERE id = ?",
        [id]
    );

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
};

const updateTask = async (req, res) => {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id);

    const existingTask = await db.get(
        "SELECT * FROM tasks WHERE id = ?",
        [id]
    );

    if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
    }

    const {
        title,
        description,
        status,
        priority,
        user_id,
        due_date
    } = req.body;

    await db.run(
        `UPDATE tasks SET
            title = ?,
            description = ?,
            status = ?,
            priority = ?,
            user_id = ?,
            due_date = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
            title ?? existingTask.title,
            description ?? existingTask.description,
            status ?? existingTask.status,
            priority ?? existingTask.priority,
            user_id ?? existingTask.user_id,
            due_date ?? existingTask.due_date,
            id
        ]
    );

    const updatedTask = await db.get(
        "SELECT * FROM tasks WHERE id = ?",
        [id]
    );

    res.json(updatedTask);
};

const deleteTask = async (req, res) => {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id);

    const task = await db.get(
        "SELECT * FROM tasks WHERE id = ?",
        [id]
    );

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    await db.run(
        "DELETE FROM tasks WHERE id = ?",
        [id]
    );

    res.json({
        message: "Task deleted",
        task
    });
};

const getCurrentUser = (req, res) => {
    res.json({ user: req.user });
};

// Endpoint para testear las funcionalidades de sort, filter, este endpoint carga por defecto todas las tareas
const listTasks = async (req, res) => {
    const db = req.app.locals.db

    const { status, priority } = req.query
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = ( page -1 ) * limit
    const sort = req.query.sort || 'created_at'

    let query = "SELECT * FROM tasks WHERE 1=1"
    let params = []

    // filtramos columnas de la tabla tasks
    if (status) {
        query += " AND status = ?"
        params.push(status)
    }

    if (priority) {
        query += " AND priority = ?"
        params.push(priority)
    }

    query += ` ORDER BY ${sort} ASC`

    query += " LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const tasks = await db.all(query, params)

    res.json(tasks)
}

module.exports = {
    getTasksByProject,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getCurrentUser,
    listTasks
};