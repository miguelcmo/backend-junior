/**
 * @openapi
 * components:
 *   schemas:
 *     GeneralStats:
 *       type: object
 *       properties:
 *         totalProjects:
 *           type: integer
 *         totalTasks:
 *           type: integer
 *         totalUsers:
 *           type: integer
 *         tasksByStatus:
 *           type: object
 *           additionalProperties:
 *             type: integer
 *         tasksByPriority:
 *           type: object
 *           additionalProperties:
 *             type: integer
 *         myTasks:
 *           type: integer
 *         myProjects:
 *           type: integer
 *         completedTasks:
 *           type: integer
 *         overdueTasks:
 *           type: integer
 *     ProjectStats:
 *       type: object
 *       properties:
 *         project:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             status:
 *               type: string
 *         totalTasks:
 *           type: integer
 *         completedTasks:
 *           type: integer
 *         completionRate:
 *           type: integer
 *           description: Porcentaje de tareas completadas
 *         overdueTasks:
 *           type: integer
 *         totalMembers:
 *           type: integer
 *         totalComments:
 *           type: integer
 *         tasksByStatus:
 *           type: object
 *         tasksByPriority:
 *           type: object
 *         tasksByUser:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_name:
 *                 type: string
 *               task_count:
 *                 type: integer
 */

const express = require("express")
const router = express.Router()

const { getGeneralStats, getProjectStats } = require("../controllers/stats.controller")
const authenticate = require("../middleware/auth")

/**
 * @openapi
 * /stats:
 *   get:
 *     summary: Estadisticas generales
 *     description: Obtiene estadisticas generales del sistema y del usuario actual
 *     tags:
 *       - Stats
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadisticas generales
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeneralStats'
 *       401:
 *         description: No autorizado
 */
router.get("/", authenticate, getGeneralStats)

/**
 * @openapi
 * /stats/projects/{id}:
 *   get:
 *     summary: Estadisticas de un proyecto
 *     description: Obtiene estadisticas detalladas de un proyecto especifico
 *     tags:
 *       - Stats
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
 *         description: Estadisticas del proyecto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectStats'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no encontrado
 */
router.get("/projects/:id", authenticate, getProjectStats)

module.exports = router
