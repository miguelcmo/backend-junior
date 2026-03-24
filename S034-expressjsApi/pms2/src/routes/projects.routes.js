const express = require("express")

const router = express.Router()

const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require("../controllers/projects.controller")

const validateProject = require("../middleware/validateProject")

// Read
router.get("/", getProjects)

// Read by Id
router.get("/:id", getProjectById)

// Create
router.post("/", validateProject, createProject)

// Update
router.put("/:id", updateProject)

// Delete
router.delete("/:id", deleteProject)

module.exports = router
