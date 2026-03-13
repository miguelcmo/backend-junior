const express = require('express')
const app = express()
const PORT = 3000

app.get("/", (req, res) => {
    res.send('Bienvenidos a mi aplicación de proyectos!')
})

app.get("/api/v1/projects", (req, res) => {
    res.send("Hola estamos en la pagina de proyectos")
})

app.get("/api/v1/users", (req, res) => {
    res.send("Hola estamos en la pagina de users")
})

app.get("/api/v1/tasks", (req, res) => {
    res.send("Hola estamos en la pagina de tasks")
})

app.get("/api/v1/comments", (req, res) => {
    res.send("Hola estamos en la pagina de comentarios")
})

app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`)
})