const express = require("express")

const app = express()

app.use(express.json())

// Ejecutar el middleware antes de las rutas
const logger = require("./middleware/logger")
app.use(logger)

// uso de rutas de proyectos
const projectRoutes = require("./routes/projects.routes")
app.use("/api/projects", projectRoutes)

// uso de rutas de tereas
const taskRoutes = require("./routes/tasks.routes")
app.use("/api", taskRoutes)

// manejo de errores depues de ejecutar toda nuestra aplicacion
const errorHandler = require("./middleware/errorHandler")
app.use(errorHandler)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})