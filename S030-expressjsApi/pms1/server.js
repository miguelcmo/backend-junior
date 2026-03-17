const express = require("express")

const app = express()

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

app.get("/api/tasks", (req, res) => {
    res.json(projects)
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})