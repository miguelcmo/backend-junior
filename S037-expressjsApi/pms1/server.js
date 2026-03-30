const express = require("express")

const app = express()

// permitir que el servidor lea el JSON que enviamos a traves de las solicitudes al servidor
app.use(express.json())

const PORT = 3000

const projects = [
    {
        id: 1,
        name: "Website design",
        status: "active" 
    },
    {
        id: 2,
        name: "Mobile App",
        status: "planning"
    }
]

app.get("/", (req, res) => {
    res.send("Project Management System - API")
})

// en las API, http://subdominio.dominio.tld/{rutas de la API}
//             http://api.gestorpro.com -> http://gestorpro.com/api
//             http://api.gestorpro.com/v2
// Hosting tradicional
// -public_html (www)
// --api
// ---v1
// ---v2
app.get("/api", (req, res) => {
    res.json({
        name: "Project Management System - API",
        version: "1.0.0",
        status: "running"
    })
})

// GET /api/projects consultar informacion sobre los proyectos
app.get("/api/projects", (req, res) => {
    res.json(projects)
})

// GET /api/projects/:id consultar informacion sobre un proyecto especifico
// :id es una segmento de ruta variable
app.get("/api/projects/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const project = projects.find(project => project.id === id)
    
    if(!project) {
        // 404 erro code - 
        return res.status(404).json({ message: "Project not found" })
    }

    res.json(project)
})

// POST /api/projects en el cuerpo(body) del mensaje POST va el objeto JSON con los datos name y status
app.post("/api/projects", (req, res) => {
    const { name, status } = req.body

    const newProject = {
        id: projects.length + 1,
        name,
        status
    }

    projects.push(newProject)

    res.status(201).json(newProject)
})

// PUT /api/projects/:id actualiza un recurso/proyecto especifico basado en su id
app.put("/api/projects/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const project = projects.find(project => project.id === id)

    if(!project) {
        return res.status(404).json({ message: "Project not found" })
    }

    const { name, status } = req.body

    project.name = name || project.name
    project.status = status || project.status
    
    res.json(project)
})

// DELETE /api/projects/:id elimina un elemento especifico a partir de su id
app.delete("/api/projects/:id", (req, res) => {
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
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})