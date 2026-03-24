let projects = [
    {
        id: 1,
        name: "Website design",
        status: "active",
        description: "Diseño de un sitio web responsivo"
    },
    {
        id: 2,
        name: "Mobile App",
        status: "planning",
        description: "Creación de una app de contactos con Flutter"
    }
]

const getProjects = async (req, res) => {

    // Se lanza un error de forma arbitraria para probar el middleware errorHandler
    //throw new Error("Testing error hanlder middleware")
    const projects = await req.app.locals.db.all(
        "SELECT * FROM projects"
    )
    
    res.json(projects)
}

const getProjectById = async (req, res) => {
    const id = parseInt(req.params.id)

    // const project = projects.find(project => project.id === id)
    
    // if(!project) {

    //     return res.status(404).json({ message: "Project not found" })
    // }

    // res.json(project)

    try {
        const project = await req.app.locals.db.get(
            "SELECT * FROM projects WHERE id = ?",
            [id]
        )

        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        res.json(project)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createProject = async (req, res) => {
    const { name, status, description } = req.body

    // const newProject = {
    //     id: projects.length + 1,
    //     name,
    //     status,
    //     description
    // }

    // projects.push(newProject)

    // res.status(201).json(newProject)

    const result = await req.app.locals.db.run(
        "INSERT INTO projects (name, description, status) VALUES (?, ?, ?)",
        [name, description, status] // Parameter binding
    )

    res.status(201).json({
        id: result.lastID,
        name,
        description,
        status
    })
}

const updateProject = async (req, res) => {
    const { id } = req.params
    const { name, description, status } = req.body
    
    try {  
        if(isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID"})
        }

        const result = await req.app.locals.db.run(
            `UPDATE projects
            SET name = ?, description = ?, status = ?
            WHERE id = ?`,
            [name, description, status, id]
        )

        if (result.changes === 0) {
            return res.status(404).json({ message: "Project not found" })
        }
        const updatedProject = await req.app.locals.db.get(
            "SELECT * FROM projects WHERE id = ?",
            [id]
        )

        res.json(updatedProject)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteProject = async (req, res) => {
    const { id } = req.params

    try {
        if(isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID"})
        }

        const result = await req.app.locals.db.run(
            "DELETE FROM projects WHERE id = ?",
            [id]
        )

        if (result.changes === 0) {
            return res.status(404).json({ message: "Project not found" })
        }

        res.status(204).send()
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
}