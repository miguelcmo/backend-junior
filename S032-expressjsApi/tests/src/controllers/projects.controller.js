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

    // test error middleware
    //throw new Error("Testing error hanlder middleware")
    const projects = await req.app.locals.db.all(
        "SELECT * FROM projects"
    );
    
    res.json(projects)
}

const getProjectById = (req, res) => {
    const id = parseInt(req.params.id)

    const project = projects.find(project => project.id === id)
    
    if(!project) {

        return res.status(404).json({ message: "Project not found" })
    }

    res.json(project)
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
        [name, description, status]
    );

    res.status(201).json({
        id: result.lastID,
        name,
        description,
        status
    });
}

const updateProject = (req, res) => {
    const id = parseInt(req.params.id)
    const project = projects.find(project => project.id === id)

    if(!project) {
        return res.status(404).json({ message: "Project not found" })
    }

    const { name, status, description } = req.body

    project.name = name || project.name
    project.status = status || project.status
    project.description = description || project.description
    
    res.json(project)
}

const deleteProject = (req, res) => {
    const id = parseInt(req.params.id)
    const index = projects.findIndex(project => project.id === id)

    if (index === -1) {
        return res.status(404).json({ message: "Project not found" })
    }

    const deleted = projects.splice(index, 1)

    res.json({
        message: "Project deleted",
        project: deleted[0]
    })
}


module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
}