/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login de usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 */

const express = require("express")

const router = express.Router()

const {
    register,
    login
} = require("./auth.controller")

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registrar usuario
 *     tags:
 *       - Auth
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post("/register", register)

router.post("/login", login)

module.exports = router