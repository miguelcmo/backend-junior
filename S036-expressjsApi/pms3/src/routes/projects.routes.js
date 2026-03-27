const express = require("express")

const router = express.Router()

const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require("../controllers/projects.controller")

const authenticate = require("../middleware/auth")

const authorize = require("../middleware/authorize")

const validateProject = require("../middleware/validateProject")

// Read
router.get("/", getProjects)

// Read by Id
router.get("/:id", getProjectById)

// Create
router.post(
    "/", 
    authenticate, 
    authorize(["admin", "user"]),
    validateProject, 
    createProject
)

// Update
router.put("/:id", authenticate, updateProject)

// Delete
router.delete(
    "/:id", 
    authenticate, 
    authorize(["admin"]),
    deleteProject
)

module.exports = router
