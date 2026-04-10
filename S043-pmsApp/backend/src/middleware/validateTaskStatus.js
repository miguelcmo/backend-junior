// Validar status y priority de las tasks

const VALID_STATUS = ['pending', 'todo', 'in_progress', 'done']
const VALID_PRIORITY = ['low', 'medium', 'high']

const validateTask = (req, res, next) => {
    const { status, priority } = req.body

    // Solo validar si se proporciona el campo
    if (status && !VALID_STATUS.includes(status)) {
        return res.status(400).json({
            error: `Status invalido. Debe ser uno de: ${VALID_STATUS.join(', ')}`
        })
    }

    if (priority && !VALID_PRIORITY.includes(priority)) {
        return res.status(400).json({
            error: `Priority invalida. Debe ser una de: ${VALID_PRIORITY.join(', ')}`
        })
    }

    next()
}

module.exports = validateTask
