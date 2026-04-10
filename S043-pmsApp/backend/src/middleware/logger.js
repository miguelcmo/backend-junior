// Middleware de logging - guarda en consola y base de datos

const logger = (req, res, next) => {
    const startTime = Date.now()

    // Log en consola
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`)

    // Capturar cuando termina la respuesta
    res.on('finish', async () => {
        const responseTime = Date.now() - startTime
        const db = req.app.locals.db

        // Obtener user_id del token si existe
        let userId = null
        if (req.user && req.user.id) {
            userId = req.user.id
        }

        // Guardar en base de datos
        try {
            await db.run(`
                INSERT INTO logs (method, url, status_code, user_id, ip, user_agent, response_time)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                req.method,
                req.url,
                res.statusCode,
                userId,
                req.ip || req.connection.remoteAddress,
                req.get('User-Agent') || null,
                responseTime
            ])
        } catch (err) {
            console.error('Error guardando log:', err.message)
        }
    })

    next()
}

module.exports = logger
