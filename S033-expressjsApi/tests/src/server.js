// Request -> se ejecuta el server de forma secuencial -> response
// Request -> instanciar la BD -> logging(MW) -> Routes(projects, tasks, users, comments) -> Error Handler (MW) -> Response

const express = require("express")
const app = express()

app.use(express.json())

const { initDB } = require("./database/db")

// Ejecutar el middleware antes de las rutas
const logger = require("./middleware/logger")
app.use(logger)

// Routes
const authRoutes = require("./auth/auth.routes");
app.use("/api/auth", authRoutes);

const projectRoutes = require("./routes/projects.routes")
app.use("/api/projects", projectRoutes)

const taskRoutes = require("./routes/tasks.routes")
app.use("/api", taskRoutes)

// manejo de errores depues de ejecutar toda nuestra aplicacion
const errorHandler = require("./middleware/errorHandler")
app.use(errorHandler)

const PORT = 3000

initDB().then(database => {
    app.locals.db = database

    console.log("Database ready!")

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}).catch(err => {
    console.error("Error connection database:", err)
})

