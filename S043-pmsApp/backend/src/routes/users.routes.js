/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, user]
 *         created_at:
 *           type: string
 *           format: date-time
 */

const express = require("express")
const router = express.Router()

const { getUsers, getUserById } = require("../controllers/users.controller")
const authenticate = require("../middleware/auth")

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Listar usuarios
 *     description: Obtiene la lista de todos los usuarios (sin passwords). Requiere autenticacion.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 */
router.get("/", authenticate, getUsers)

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     description: Obtiene un usuario especifico por su ID. Requiere autenticacion.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Detalle del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", authenticate, getUserById)

module.exports = router
