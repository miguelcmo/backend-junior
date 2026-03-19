const express = require("express")

const app = express()

app.use(express.json())

const logger = require("./middleware/logger")
app.use(logger)

const projectRoutes = require("./routes/projects.routes")
app.use("/api/projects", projectRoutes)

const taskRoutes = require("./routes/tasks.routes")
app.use("/api", taskRoutes)

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})