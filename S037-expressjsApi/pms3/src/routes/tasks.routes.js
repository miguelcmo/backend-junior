/**
 * @openapi
 * /listTasks:
 *   get:
 *     summary: List all tasks
 *     description: Retrieves a list of all tasks from the system
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Task ID
 *                   title:
 *                     type: string
 *                     description: Task title
 *                   description:
 *                     type: string
 *                     description: Task description
 *                   projectId:
 *                     type: string
 *                     description: Associated project ID
 *                   status:
 *                     type: string
 *                     description: Task status
 *       500:
 *         description: Internal server error
 */
const express = require("express")

const router = express.Router()

const {
    getTasksByProject,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getCurrentUser,
    listTasks
} = require ("../controllers/tasks.controller")

const authenticate = require("../middleware/auth")

router.get("/projects/:projectId/tasks", getTasksByProject)

router.post("/projects/:projectId/tasks", createTask)

router.get("/tasks/:id", getTaskById)

router.put("/tasks/:id", updateTask)

router.delete("/tasks/:id", deleteTask)

router.get("/me", authenticate, getCurrentUser)


router.get("/listTasks", listTasks)

module.exports = router

