/**
 * @openapi
 * components:
 *   schemas:
 *     ProjectMember:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         project_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         role:
 *           type: string
 *           enum: [owner, member]
 *         joined_at:
 *           type: string
 *           format: date-time
 *         name:
 *           type: string
 *         email:
 *           type: string
 */

const express = require("express")
const router = express.Router()

const {
    getProjectMembers,
    addProjectMember,
    removeProjectMember
} = require("../controllers/projectMembers.controller")

const authenticate = require("../middleware/auth")
const isProjectOwner = require("../middleware/isProjectOwner")

/**
 * @openapi
 * /projects/{id}/members:
 *   get:
 *     summary: Listar miembros del proyecto
 *     description: Obtiene todos los miembros de un proyecto
 *     tags:
 *       - Project Members
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
 *         description: Lista de miembros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProjectMember'
 *       401:
 *         description: No autorizado
 */
router.get("/:id/members", authenticate, getProjectMembers)

/**
 * @openapi
 * /projects/{id}/members:
 *   post:
 *     summary: Agregar miembro al proyecto
 *     description: Agrega un usuario como miembro del proyecto. Solo el owner o admin puede hacerlo.
 *     tags:
 *       - Project Members
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
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID del usuario a agregar
 *               role:
 *                 type: string
 *                 enum: [member]
 *                 default: member
 *     responses:
 *       201:
 *         description: Miembro agregado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectMember'
 *       400:
 *         description: Usuario ya es miembro o datos invalidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso
 *       404:
 *         description: Usuario o proyecto no encontrado
 */
router.post("/:id/members", authenticate, isProjectOwner, addProjectMember)

/**
 * @openapi
 * /projects/{id}/members/{userId}:
 *   delete:
 *     summary: Remover miembro del proyecto
 *     description: Remueve un usuario del proyecto. Solo el owner o admin puede hacerlo.
 *     tags:
 *       - Project Members
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a remover
 *     responses:
 *       200:
 *         description: Miembro removido
 *       400:
 *         description: No se puede remover al owner
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso
 *       404:
 *         description: Miembro no encontrado
 */
router.delete("/:id/members/:userId", authenticate, isProjectOwner, removeProjectMember)

module.exports = router
