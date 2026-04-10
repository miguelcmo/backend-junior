/**
 * @openapi
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *         owner_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
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
const isProjectOwner = require("../middleware/isProjectOwner")

/**
 * @openapi
 * /projects:
 *   get:
 *     summary: Listar todos los proyectos
 *     description: Obtiene la lista de todos los proyectos
 *     tags:
 *       - Projects
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get("/", getProjects)

/**
 * @openapi
 * /projects/{id}:
 *   get:
 *     summary: Obtener proyecto por ID
 *     description: Obtiene un proyecto especifico por su ID
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Detalle del proyecto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Proyecto no encontrado
 */
router.get("/:id", getProjectById)

/**
 * @openapi
 * /projects:
 *   post:
 *     summary: Crear nuevo proyecto
 *     description: Crea un nuevo proyecto. El usuario autenticado sera el owner.
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
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proyecto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: No autorizado
 */
router.post(
    "/",
    authenticate,
    authorize(["admin", "user"]),
    validateProject,
    createProject
)

/**
 * @openapi
 * /projects/{id}:
 *   put:
 *     summary: Actualizar proyecto
 *     description: Actualiza un proyecto existente. Solo el owner o admin puede hacerlo.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
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
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso
 *       404:
 *         description: Proyecto no encontrado
 */
router.put("/:id", authenticate, isProjectOwner, updateProject)

/**
 * @openapi
 * /projects/{id}:
 *   delete:
 *     summary: Eliminar proyecto
 *     description: Elimina un proyecto. Solo el owner o admin puede hacerlo.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete("/:id", authenticate, isProjectOwner, deleteProject)

module.exports = router
