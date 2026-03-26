const express = require("express")

const router = express.Router()

const {
    getTasksByProject,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getCurrentUser
} = require ("../controllers/tasks.controller")

const authenticate = require("../middleware/auth")

router.get("/projects/:projectId/tasks", getTasksByProject)

router.post("/projects/:projectId/tasks", createTask)

router.get("/tasks/:id", getTaskById)

router.put("/tasks/:id", updateTask)

router.delete("/tasks/:id", deleteTask)

router.get("/me", authenticate, getCurrentUser)

module.exports = router

