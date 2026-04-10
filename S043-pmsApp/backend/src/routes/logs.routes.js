/**
 * @openapi
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         method:
 *           type: string
 *         url:
 *           type: string
 *         status_code:
 *           type: integer
 *         user_id:
 *           type: integer
 *         ip:
 *           type: string
 *         user_agent:
 *           type: string
 *         response_time:
 *           type: integer
 *           description: Tiempo de respuesta en ms
 *         created_at:
 *           type: string
 *           format: date-time
 */

const express = require("express")
const router = express.Router()

const authenticate = require("../middleware/auth")
const authorize = require("../middleware/authorize")

/**
 * @openapi
 * /logs:
 *   get:
 *     summary: Listar logs del sistema
 *     description: Obtiene los logs de requests. Solo admin.
 *     tags:
 *       - Logs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *           enum: [GET, POST, PUT, DELETE]
 *         description: Filtrar por metodo HTTP
 *       - in: query
 *         name: status_code
 *         schema:
 *           type: integer
 *         description: Filtrar por codigo de estado
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Lista de logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo admin
 */
router.get("/", authenticate, authorize(['admin']), async (req, res) => {
    const db = req.app.locals.db

    const { method, status_code } = req.query
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const offset = (page - 1) * limit

    let query = "SELECT * FROM logs WHERE 1=1"
    let params = []

    if (method) {
        query += " AND method = ?"
        params.push(method.toUpperCase())
    }

    if (status_code) {
        query += " AND status_code = ?"
        params.push(parseInt(status_code))
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const logs = await db.all(query, params)

    res.json(logs)
})

/**
 * @openapi
 * /logs/stats:
 *   get:
 *     summary: Estadisticas de logs
 *     description: Obtiene estadisticas de requests. Solo admin.
 *     tags:
 *       - Logs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadisticas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_requests:
 *                   type: integer
 *                 avg_response_time:
 *                   type: number
 *                 requests_by_method:
 *                   type: object
 *                 requests_by_status:
 *                   type: object
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo admin
 */
router.get("/stats", authenticate, authorize(['admin']), async (req, res) => {
    const db = req.app.locals.db

    const total = await db.get("SELECT COUNT(*) as count FROM logs")
    const avgTime = await db.get("SELECT AVG(response_time) as avg FROM logs")

    const byMethod = await db.all(`
        SELECT method, COUNT(*) as count
        FROM logs
        GROUP BY method
    `)

    const byStatus = await db.all(`
        SELECT status_code, COUNT(*) as count
        FROM logs
        GROUP BY status_code
        ORDER BY count DESC
    `)

    res.json({
        total_requests: total.count,
        avg_response_time: Math.round(avgTime.avg || 0),
        requests_by_method: byMethod.reduce((acc, row) => {
            acc[row.method] = row.count
            return acc
        }, {}),
        requests_by_status: byStatus.reduce((acc, row) => {
            acc[row.status_code] = row.count
            return acc
        }, {})
    })
})

module.exports = router
