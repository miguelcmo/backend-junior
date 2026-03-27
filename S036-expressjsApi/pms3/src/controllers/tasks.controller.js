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

module.exports = {
    getTasksByProject,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getCurrentUser,
    listTasks
};