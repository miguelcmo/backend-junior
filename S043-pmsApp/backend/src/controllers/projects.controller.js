// let projects = [
//     {
//         id: 1,
//         name: "Website design",
//         status: "active",
//         description: "Diseño de un sitio web responsivo"
//     },
//     {
//         id: 2,
//         name: "Mobile App",
//         status: "planning",
//         description: "Creación de una app de contactos con Flutter"
//     }
// ]

const projectsService = require("../services/projects.service")

const getProjects = async (req, res) => {
    const db = req.app.locals.db

    const projects = await projectsService.getAllProjects(db)
    
    res.json(projects)
}

const getProjectById = async (req, res) => {
    const db = req.app.locals.db

    const id = parseInt(req.params.id)

    const project = await projectsService.getProjectById(db, id)

    if (!project) {
        return res.status(404).json({ message: "Project not found" })
    }

    res.json(project)
}

const createProject = async (req, res) => {
    const db = req.app.locals.db
    const ownerId = req.user.id

    const project = await projectsService.createProject(db, req.body, ownerId)

    res.status(201).json(project)
}

const updateProject = async (req, res) => {
    const db = req.app.locals.db
    const id = parseInt(req.params.id)
    const project = await projectsService.updateProject(db, id, req.body)

    if (!project) {
        return res.status(404).json({ message: "Project not found" })
    }

    res.json(project)
}

const deleteProject = async (req, res) => {
    const db = req.app.locals.db
    const id = parseInt(req.params.id)
    const project = await projectsService.deleteProject(db, id)

    if (!project) {
        return res.status(404).json({ message: "Project not found" })
    }

    res.status(200).json({
        message: "Project deleted succesfully",
        project: project
    })
}


module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
}