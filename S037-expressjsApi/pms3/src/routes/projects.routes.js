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

/**
 * @openapi
 * /projects:
 *   post:
 *     summary: Create a new project
 *     description: Crea un nuevo proyecto, requiere autenticación y autorización para roles de administrador "admin" y usuario "user".
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Project created succesfully
 *       400: 
 *         description: Invalid project data
 *       401: 
 *         description: Unauthorized access
 *       404:
 *         description: Forbidden access
 */
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
