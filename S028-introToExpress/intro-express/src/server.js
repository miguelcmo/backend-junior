const express = require('express')

const app = express()

const PORT = 3000

// "/" ruta barra o ruta raiz 127.0.0.1:3000 -> http://miguel.com
app.get("/", (req, res) => {
    res.send('Bienvenidos a mi aplicación web!')
})

app.get("/api/projects", (req, res) => {
    const projects = [
        {id: 1, name: "Desarrollo de SaaS"},
        {id: 2, name: "App de frutas"}
    ]
    res.json(projects)
})

app.get("/api/tasks", (req, res) => {
    const projects = [
        {id: 1, name: "Crear estructura de datos"},
        {id: 2, name: "Crear migraciones"}
    ]
    res.json(projects)
})

// :id segmento de ruta variable
app.get("/api/projects/:id", (req, res) => {
    const id = req.params.id
    res.json({message: `Buscando proyecto ${id}`})
})

app.get("/projects/consultoria", (req, res) => {
    res.send('Pagina de proyectos de consultoria de la consultora.')
})

app.get("/about", (req, res) => {
    res.send('Pagina de quienes somos de la consultora.')
})

app.get("/users", (req, res) => {
    res.send('Pagina de usuarios de la app.')
})

app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`)
})