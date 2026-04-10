const express = require("express")
const router = express.Router()

const { register, login } = require("./auth.controller")
const { validateRegister, validateLogin } = require("../middleware/validateAuth")

/**
 * @openapi
 * /auth/register:
 *    post:
 *      summary: Registrar un usuario nuevo
 *      description: Crea una nueva cuenta de usuario
 *      tags:
 *        - Auth
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - email
 *                - password
 *              properties:
 *                name:
 *                  type: string
 *                  minLength: 2
 *                email:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *                  minLength: 6
 *      responses:
 *        201:
 *          description: Usuario creado exitosamente
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                  name:
 *                    type: string
 *                  email:
 *                    type: string
 *                  role:
 *                    type: string
 *        400:
 *          description: Datos invalidos o email ya registrado
 */
router.post("/register", validateRegister, register)

/**
 * @openapi
 * /auth/login:
 *    post:
 *      summary: Login de usuario
 *      description: Inicia sesion y obtiene un token JWT
 *      tags:
 *        - Auth
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - password
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        200:
 *          description: Login exitoso
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                  user:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                      name:
 *                        type: string
 *                      email:
 *                        type: string
 *                      role:
 *                        type: string
 *        400:
 *          description: Datos requeridos faltantes
 *        401:
 *          description: Credenciales invalidas
 */
router.post("/login", validateLogin, login)

module.exports = router
