# Project Management System - API

API REST para gestión de proyectos/tareas con Express, JWT y capas limpias (routes/controllers/services/database).

## 1. Overview del proyecto

- Nombre: `project-management-system-api`
- Stack: Node.js + Express
- Autenticación: JWT
- Arquitectura: estructurada (RCMS / capas separadas)

## 2. Estructura de carpetas

### Inicial
- `package.json`
- `server.js`

### Final
- `src/`
  - `routes/`
  - `controllers/`
  - `services/`
  - `models/`
  - `middleware/`
  - `database/`

> Nota: la carpeta `middleware` contiene helpers y validadores para extensiones de Express.
> `database` contiene conexión y setup de DB (e.g., `db.js`).

## 3. Flujo de ejecución

`Client` → `Routes` → `Controllers` → `Services` → `Database` → `Response`

### Qué hace cada capa
- `Routes`: define endpoints HTTP y rutas.
- `Controllers`: procesa request/response y orquesta las llamadas.
- `Services`: lógica de negocio, reglas y transacciones.
- `Database`: consulta, CRUD y persistencia.
- `Middleware`: validadores, autenticación, logs, manejo de errores.

## 4. Base de datos

- `database/db.js` gestiona conexión y modelo.
- Las entidades (proyectos, tareas, usuarios) pasan de hardcode a persistencia real.
- Los controllers ya no manipulan queries directamente; usan services.

## 5. Service Layer

- Se extrae el código transaccional fuera de controllers.
- Separa responsabilidades:
  - Controllers: coordinación.
  - Services: procesos y reglas.
  - DB: acceso y consultas.

## 6. Autenticación (JWT)

- Login recibe credenciales.
- Si es válido, genera un token JWT.
- Cliente usa token en cabecera:
  - `Authorization: Bearer <TOKEN>`
- Server valida token en middleware.

### Formato JWT
- `HEADER.PAYLOAD.SIGNATURE`
- Usar `jwt.sign(payload, SECRET, { expiresIn })`.

## 7. Autorización (roles)

Segunda capa tras verificar token:

- `Admin`  → control total.
- `User`   → crear proyectos/tareas + edición propia.
- `Viewer` → solo lectura.

### Reglas de acceso

- Crear tarea → `admin`, `user`
- Editar tarea → `admin`, `user`
- Eliminar tarea → `admin`

> Puedes implementar middleware tipo `checkRole(['admin','user'])` y combinar con `checkToken`.

## 8. Uso rápido

1. `npm install`
2. `npm run dev` (o `node server.js`)
3. Endpoints:
   - `POST /auth/login`
   - `GET/POST/PUT/DELETE /projects`
   - `GET/POST/PUT/DELETE /tasks`

## 9. Buenas prácticas sugeridas

- Mantener validación con `express-validator`.
- Manejo global de errores (`errorHandler` middleware).
- Variables de config en `.env` (`DB_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`).
- Testear con Jest / Supertest.
- Documentar con Swagger / Postman.

## 10. Próximos pasos

- Agregar `refresh token`.
- Permitir permisos finos por recursos y usuario.
- API docs con Swagger.
- Versionar rutas: `/api/v1/...`
- Deploy (Heroku/Vercel/AWS/GCP).
