const express = require("express")

const app = express()

app.use(express.json())

const projectRoutes = require("./routes/projects.routes")

app.use("/api/projects", projectRoutes)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})