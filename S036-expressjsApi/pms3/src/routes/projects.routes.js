/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     description: Creates a new project. Requires authentication and authorization for admin or user roles.
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
 *                 description: Project name
 *               description:
 *                 type: string
 *                 description: Project description
 *               status:
 *                 type: string
 *                 description: Project status
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *       400:
 *         description: Invalid project data
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
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
