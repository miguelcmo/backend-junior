// Cargar variables de entorno
require('dotenv').config()

// Request -> se ejecuta el server de forma secuencial -> response
// Request -> instanciar la BD -> logging(MW) -> Routes(projects, tasks, users, comments) -> Error Handler (MW) -> Response

const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())

const { initDB } = require("./database/db")

// Ejecutar el middleware antes de las rutas
const logger = require("./middleware/logger")
app.use(logger)

// Routes
const authRoutes = require("./auth/auth.routes")
app.use("/api/auth", authRoutes)

const projectRoutes = require("./routes/projects.routes")
app.use("/api/projects", projectRoutes)

const projectMembersRoutes = require("./routes/projectMembers.routes")
app.use("/api/projects", projectMembersRoutes)

const taskRoutes = require("./routes/tasks.routes")
app.use("/api", taskRoutes)

const userRoutes = require("./routes/users.routes")
app.use("/api/users", userRoutes)

const commentsRoutes = require("./routes/comments.routes")
app.use("/api", commentsRoutes)

const logsRoutes = require("./routes/logs.routes")
app.use("/api/logs", logsRoutes)

const statsRoutes = require("./routes/stats.routes")
app.use("/api/stats", statsRoutes)

const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("./docs/swagger")
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Root route to indicate server is running
app.get("/", (req, res) => {
    res.send("Server is running!")
})

// manejo de errores depues de ejecutar toda nuestra aplicacion
const errorHandler = require("./middleware/errorHandler")
app.use(errorHandler)

const PORT = process.env.PORT || 3000

// levantar el servidor
initDB().then(database => {
    app.locals.db = database

    console.log("Database ready!")

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
        console.log(`API Docs on http://localhost:${PORT}/api/docs`)
    })
}).catch(err => {
    console.error("Error connection database:", err)
})

