/**
 * @openapi
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         task_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         content:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         user_name:
 *           type: string
 *         user_email:
 *           type: string
 */

const express = require("express")
const router = express.Router()

const {
    getCommentsByTask,
    createComment,
    deleteComment
} = require("../controllers/comments.controller")

const authenticate = require("../middleware/auth")

/**
 * @openapi
 * /tasks/{id}/comments:
 *   get:
 *     summary: Listar comentarios de una task
 *     description: Obtiene todos los comentarios de una task
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la task
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Task no encontrada
 */
router.get("/tasks/:id/comments", getCommentsByTask)

/**
 * @openapi
 * /tasks/{id}/comments:
 *   post:
 *     summary: Agregar comentario a una task
 *     description: Crea un nuevo comentario en una task. Requiere autenticacion.
 *     tags:
 *       - Comments
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Contenido del comentario
 *     responses:
 *       201:
 *         description: Comentario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Contenido requerido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Task no encontrada
 */
router.post("/tasks/:id/comments", authenticate, createComment)

/**
 * @openapi
 * /comments/{commentId}:
 *   delete:
 *     summary: Eliminar comentario
 *     description: Elimina un comentario. Solo el autor o admin puede hacerlo.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario eliminado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso
 *       404:
 *         description: Comentario no encontrado
 */
router.delete("/comments/:commentId", authenticate, deleteComment)

module.exports = router
