const express = require("express")

const router = express.Router()

const {
    getTasksByProject,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require ("../controllers/tasks.controller")

router.get("/projects/:projectId/tasks", getTasksByProject)

router.post("/projects/:projectId/tasks", createTask)

router.get("/tasks/:id", getTaskById)

router.put("/tasks/:id", updateTask)

router.delete("/tasks/:id", deleteTask)

module.exports = router

