/**
 * @openapi
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, todo, in_progress, done]
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *         project_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         due_date:
 *           type: string
 *           format: date-time
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
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
    listTasks,
    getMyTasks,
    getMyProjects
} = require ("../controllers/tasks.controller")

const authenticate = require("../middleware/auth")
const validateTask = require("../middleware/validateTaskStatus")
const isProjectMember = require("../middleware/isProjectMember")

/**
 * @openapi
 * /projects/{projectId}/tasks:
 *   get:
 *     summary: Obtener tasks de un proyecto
 *     description: Lista todas las tasks de un proyecto especifico
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Lista de tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get("/projects/:projectId/tasks", getTasksByProject)

/**
 * @openapi
 * /projects/{projectId}/tasks:
 *   post:
 *     summary: Crear task en un proyecto
 *     description: Crea una nueva task dentro de un proyecto. Requiere autenticacion y ser miembro del proyecto.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
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
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, todo, in_progress, done]
 *                 default: pending
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: medium
 *               user_id:
 *                 type: integer
 *                 description: ID del usuario asignado
 *               due_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Task creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No eres miembro del proyecto
 */
router.post("/projects/:projectId/tasks", authenticate, isProjectMember, validateTask, createTask)

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     summary: Obtener task por ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la task
 *     responses:
 *       200:
 *         description: Detalle de la task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task no encontrada
 */
router.get("/tasks/:id", getTaskById)

/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     summary: Actualizar task
 *     description: Actualiza una task existente. Requiere autenticacion.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la task
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, todo, in_progress, done]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               user_id:
 *                 type: integer
 *               due_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Task actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Task no encontrada
 */
router.put("/tasks/:id", authenticate, validateTask, updateTask)

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     summary: Eliminar task
 *     description: Elimina una task. Requiere autenticacion.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la task
 *     responses:
 *       200:
 *         description: Task eliminada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Task no encontrada
 */
router.delete("/tasks/:id", authenticate, deleteTask)

/**
 * @openapi
 * /me:
 *   get:
 *     summary: Obtener usuario actual
 *     description: Retorna la informacion del usuario autenticado
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: No autorizado
 */
router.get("/me", authenticate, getCurrentUser)

/**
 * @openapi
 * /listTasks:
 *   get:
 *     summary: Listar todas las tasks
 *     description: Lista tasks con filtros y paginacion
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, todo, in_progress, done]
 *         description: Filtrar por status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filtrar por prioridad
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numero de pagina
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Tasks por pagina
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: created_at
 *         description: Campo para ordenar
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filtrar por usuario asignado
 *     responses:
 *       200:
 *         description: Lista de tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get("/listTasks", listTasks)

/**
 * @openapi
 * /me/tasks:
 *   get:
 *     summary: Mis tasks asignadas
 *     description: Lista las tasks asignadas al usuario autenticado
 *     tags:
 *       - My Data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, todo, in_progress, done]
 *         description: Filtrar por status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filtrar por prioridad
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de mis tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Task'
 *                   - type: object
 *                     properties:
 *                       project_name:
 *                         type: string
 *       401:
 *         description: No autorizado
 */
router.get("/me/tasks", authenticate, getMyTasks)

/**
 * @openapi
 * /me/projects:
 *   get:
 *     summary: Mis proyectos
 *     description: Lista los proyectos donde soy owner o miembro
 *     tags:
 *       - My Data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mis proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Project'
 *                   - type: object
 *                     properties:
 *                       my_role:
 *                         type: string
 *                         enum: [owner, member]
 *       401:
 *         description: No autorizado
 */
router.get("/me/projects", authenticate, getMyProjects)

module.exports = router
