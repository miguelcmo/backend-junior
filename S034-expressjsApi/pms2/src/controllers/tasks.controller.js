let tasks = [
    {
        id: 1,
        title: "Create API",
        project_id: 1,
        status: "todo"
    },
    {
        id: 2,
        title: "Design database",
        project_id: 1,
        status: "in_progress"
    }
]

const getTasksByProject = (req, res) => {
    const projectId = parseInt(req.params.projectId) // "1" "uno"

    const projectTasks = tasks.filter(
        task => task.project_id === projectId
    )

    res.json(projectTasks)
}

// POST /api/projects/:projectId/tasks
const createTask = (req, res) => {
    const projectId = parseInt(req.params.projectId) // lower camel case primeraSegundaTerceraCuarta

    const { title, status } = req.body

    const newTask = {
        id: tasks.length + 1,
        title,
        status,
        project_id: projectId
    }

    tasks.push(newTask)

    res.status(201).json(newTask) // status code 201 = creado
}

const getTaskById = (req, res) => {
    // recuperar los parametos del endpoint
    const id = parseInt(req.params.id)

    // filtrar, recuperar, buscar a nivel de la entidad que estamos trabajando
    // aca entra la BD
    const task = tasks.find(task => task.id === id)

    // manejo de errores/respuesta del servidor
    if (!task) {
        return res.staus(404).json({message: "Task not found"})
    }

    // respuesta del servidor
    res.json(task)
}

const updateTask = (req, res) => {
    const id = parseInt(req.params.id)

    const task = tasks.find(task => task.id === id)

    if (!task) {
        return res.status(404).json({ message: "Task not found" })
    }

    const { title, status } = req.body

    task.title = title || task.title
    task.status = status || task.status

    res.json(task)
}

const deleteTask = (req, res) => {
    const id = parseInt(req.params.id)

    const index = tasks.findIndex(task => task.id === id)

    if (index === -1) {
        return res.staus(404).json({ message: "Task not found" })
    }

    const deleted = tasks.splice(index, 1)

    res.json({
        message: "Task deleted",
        task: deleted[0]
    })
}

const getCurrentUser = (req, res) => {

  res.json({
    user: req.user
  });

};

module.exports = {
    getTasksByProject,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getCurrentUser
}