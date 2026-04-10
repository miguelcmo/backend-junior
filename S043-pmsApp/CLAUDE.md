# Project Management System (PMS) - Status Report

## Overview

Full-stack Project Management System with Express.js backend and React frontend.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Backend | Express.js 5, SQLite3, JWT, bcrypt |
| Frontend | React 19, Vite 8, Bootstrap 5, Axios |
| Auth | JWT tokens (1h expiry), bcrypt password hashing |
| Docs | Swagger/OpenAPI at `/api/docs` |

## Project Structure

```
S042-pmsApp/
├── backend/
│   ├── server.js              # Entry point
│   ├── database.sqlite        # SQLite database
│   └── src/
│       ├── server.js          # Express app setup
│       ├── auth/              # Auth controllers, routes, services
│       ├── controllers/       # Projects & Tasks controllers
│       ├── services/          # Business logic
│       ├── routes/            # API endpoint definitions
│       ├── middleware/        # auth, authorize, logger, validators
│       └── database/          # SQLite connection & schema
│
└── frontend/
    └── src/
        ├── api/client.js      # Axios with auth interceptor
        ├── context/           # AuthContext & AuthProvider
        ├── pages/             # Login, Dashboard, Tasks
        ├── components/        # Navbar
        └── routes/            # AppRouter, PrivateRoute
```

## Database Schema

### Users
- `id`, `name`, `email` (unique), `password` (hashed), `role` (admin/user), `created_at`

### Projects
- `id`, `name`, `description`, `status`, `created_at`

### Tasks
- `id`, `title`, `description`, `status` (pending/todo/in_progress/done)
- `priority` (low/medium/high), `project_id` (FK), `user_id` (FK)
- `due_date`, `created_at`, `updated_at`

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register user |
| POST | `/login` | Login, returns JWT |

### Projects (`/api/projects`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | List all projects |
| GET | `/:id` | No | Get project by ID |
| POST | `/` | Yes | Create project |
| PUT | `/:id` | Yes | Update project |
| DELETE | `/:id` | Admin | Delete project |

### Tasks (`/api`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects/:projectId/tasks` | Tasks by project |
| POST | `/projects/:projectId/tasks` | Create task |
| GET | `/tasks/:id` | Get task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| GET | `/listTasks` | List with filters/pagination |
| GET | `/me` | Current user info (auth required) |

## Frontend Routes

| Path | Component | Protected |
|------|-----------|-----------|
| `/` | Login | No |
| `/dashboard` | Dashboard | Yes |
| `/tasks/:projectId` | Tasks | Yes |

## Running the Project

```bash
# Backend (port 3000)
cd backend
npm install
npm run dev

# Frontend (port 5173)
cd frontend
npm install
npm run dev
```

## Security Notes

**Current Implementation:**
- JWT authentication with 1h expiration
- bcrypt password hashing (10 rounds)
- Role-based authorization middleware
- CORS enabled

**Known Issues:**
- JWT secret hardcoded (`"secretkey"`) - should use env variable
- Token stored in localStorage (XSS vulnerable)
- No rate limiting on auth endpoints
- Some task endpoints lack authentication

## Status: Active Development

- Core CRUD operations functional
- Authentication system complete
- Frontend pages implemented (Login, Dashboard, Tasks)
- Task filtering and pagination working

## Notas principales para el desarrollo
Este es una proyecto educativo el cual fuimos construyendo paso a paso por lo cual quiero mantenerlo basico ABAP (As Basic As Possible), pero quiero mejorarlo para que implemente todas las funcionalidades de una App de Gestion de Proyectos real y mas robusta, **primero quiero expandir la API(backend)** con mas cosas (hazme una propuesta) y finalizarla con lo que haga falta para que funcione de forma correcta en todos sus aspectos (middleware, rutas, auth, roles), quiero que tengas en cuenta esto:

* Mantener la estructura como esta propuesta aun cuando no sean practicas PRO, nivel produccion DIOS y THANOS
* Continuar la misma linea de diseño

## Plan de trabajo propuesto para mejora de la API "por CLAUDE"

### FASE 1: Completar lo que falta (Fundamentos) ✅ COMPLETADA

**1.1 Proteger endpoints de Tasks con autenticacion**
- [x] Agregar middleware `authenticate` a rutas de tasks que lo necesiten
- [x] Solo usuarios autenticados pueden crear/editar/eliminar tasks

**1.2 Completar el middleware validateTaskStatus**
- [x] Validar que el status sea uno de: `pending`, `todo`, `in_progress`, `done`
- [x] Validar que priority sea uno de: `low`, `medium`, `high`

**1.3 Agregar owner_id a Projects**
- [x] Modificar schema: agregar `owner_id` (FK a users) en tabla projects
- [x] El usuario que crea el proyecto es el owner
- [x] Solo el owner o admin puede eliminar/editar el proyecto (middleware `isProjectOwner`)

**1.4 Endpoint para listar usuarios**
- [x] `GET /api/users` - Lista usuarios (sin passwords) para asignar tasks
- [x] `GET /api/users/:id` - Obtener usuario por ID
- [x] Solo usuarios autenticados pueden ver la lista

> **NOTA:** Debes eliminar `database.sqlite` para que se recree con el nuevo schema (owner_id)

---

### FASE 2: Miembros de Proyecto ✅ COMPLETADA

**2.1 Nueva tabla project_members**
```sql
project_members (
  id, project_id, user_id, role ('owner', 'member'), joined_at
)
```
- [x] Tabla creada con UNIQUE(project_id, user_id) y ON DELETE CASCADE

**2.2 Nuevos endpoints**
- [x] `POST /api/projects/:id/members` - Agregar miembro (solo owner/admin)
- [x] `GET /api/projects/:id/members` - Listar miembros del proyecto
- [x] `DELETE /api/projects/:id/members/:userId` - Remover miembro

**2.3 Logica de acceso**
- [x] Solo miembros del proyecto pueden crear tasks (middleware `isProjectMember`)
- [x] Middleware `isProjectMember` creado y aplicado a POST /projects/:projectId/tasks

**2.4 Documentacion Swagger**
- [x] Todos los endpoints documentados con JSDoc/OpenAPI
- [x] Schemas definidos: Project, Task, User, ProjectMember

---

### FASE 3: Asignacion de Tasks ✅ COMPLETADA

**3.1 Mejorar asignacion de tasks**
- [x] Validar que `user_id` en task sea miembro del proyecto (en createTask)
- [x] `GET /api/me/tasks` - Tasks asignadas al usuario actual (con project_name)
- [x] Filtrar tasks por `user_id` en /listTasks

**3.2 Endpoint mis proyectos**
- [x] `GET /api/me/projects` - Proyectos donde soy owner o miembro (incluye my_role)

---

### FASE 4: Comentarios en Tasks ✅ COMPLETADA

**4.1 Nueva tabla comments**
```sql
comments (
  id, task_id, user_id, content, created_at
)
```
- [x] Tabla creada con ON DELETE CASCADE

**4.2 Nuevos endpoints**
- [x] `POST /api/tasks/:id/comments` - Agregar comentario (auth required)
- [x] `GET /api/tasks/:id/comments` - Listar comentarios con user_name/email
- [x] `DELETE /api/comments/:commentId` - Eliminar (solo autor o admin)

**4.3 Logger mejorado - guarda en BD**
- [x] Tabla `logs` creada (method, url, status_code, user_id, ip, user_agent, response_time)
- [x] Middleware logger actualizado para guardar en BD
- [x] `GET /api/logs` - Listar logs (solo admin, con filtros)
- [x] `GET /api/logs/stats` - Estadisticas de requests (solo admin)

---

### FASE 5: Dashboard y Estadisticas ✅ COMPLETADA

**5.1 Endpoint de estadisticas generales**
- [x] `GET /api/stats` - Retorna:
  ```json
  {
    "totalProjects": 5,
    "totalTasks": 23,
    "totalUsers": 10,
    "tasksByStatus": { "pending": 5, "in_progress": 10, "done": 8 },
    "tasksByPriority": { "low": 3, "medium": 15, "high": 5 },
    "myTasks": 7,
    "myProjects": 3,
    "completedTasks": 8,
    "overdueTasks": 2
  }
  ```

**5.2 Stats por proyecto**
- [x] `GET /api/stats/projects/:id` - Stats detalladas:
  - project info, totalTasks, completedTasks, completionRate (%)
  - overdueTasks, totalMembers, totalComments
  - tasksByStatus, tasksByPriority, tasksByUser

---

### FASE 6: Mejoras Finales ✅ COMPLETADA

**6.1 Variables de entorno**
- [x] Crear archivo `.env.example` y `.env`
- [x] Agregar dependencia `dotenv`
- [x] Mover JWT_SECRET a variable de entorno (process.env.JWT_SECRET)
- [x] Mover PORT a variable de entorno (process.env.PORT)

**6.2 Validaciones adicionales**
- [x] Validar email formato correcto en registro (regex)
- [x] Validar password minimo 6 caracteres
- [x] Validar nombre minimo 2 caracteres
- [x] Validar que project exista antes de crear task
- [x] Validar titulo requerido en task
- [x] Verificar email duplicado en registro

**6.3 Respuestas de error consistentes**
- [x] Errores usan formato: `{ error: "mensaje" }` o `{ errors: [...] }`
- [x] Auth controller con manejo de excepciones try/catch

> **NOTA:** Ejecutar `npm install` para instalar dotenv

---

### Orden de implementacion sugerido

| Orden | Fase | Prioridad | Descripcion |
|-------|------|-----------|-------------|
| 1 | 1.1 | Alta | Proteger endpoints tasks |
| 2 | 1.2 | Alta | Completar validadores |
| 3 | 1.3 | Alta | Owner en projects |
| 4 | 1.4 | Media | Listar usuarios |
| 5 | 2.x | Media | Miembros de proyecto |
| 6 | 3.x | Media | Asignacion de tasks |
| 7 | 4.x | Baja | Comentarios |
| 8 | 5.x | Baja | Estadisticas |
| 9 | 6.x | Media | Mejoras finales |

---

### Archivos a crear/modificar por fase

**FASE 1:**
- `src/routes/tasks.routes.js` - agregar middleware auth
- `src/middleware/validateTaskStatus.js` - completar validacion
- `src/database/db.js` - agregar owner_id a projects
- `src/routes/users.routes.js` - NUEVO
- `src/controllers/users.controller.js` - NUEVO

**FASE 2:**
- `src/database/db.js` - tabla project_members
- `src/routes/projectMembers.routes.js` - NUEVO
- `src/controllers/projectMembers.controller.js` - NUEVO
- `src/middleware/isProjectMember.js` - NUEVO

**FASE 3:**
- `src/routes/tasks.routes.js` - nuevos endpoints
- `src/controllers/tasks.controller.js` - logica adicional

**FASE 4:**
- `src/database/db.js` - tabla comments
- `src/routes/comments.routes.js` - NUEVO
- `src/controllers/comments.controller.js` - NUEVO

**FASE 5:**
- `src/routes/stats.routes.js` - NUEVO
- `src/controllers/stats.controller.js` - NUEVO

**FASE 6:**
- `.env.example` - NUEVO
- `src/middleware/validateAuth.js` - NUEVO (validar email/password)
- Refactor respuestas en todos los controllers

---

## Plan de mejora del FRONTEND

El backend ahora tiene muchas más funcionalidades que el frontend actual no aprovecha. Aquí está el plan para actualizar el frontend.

### Estado actual del Frontend

```
frontend/src/
├── api/client.js          # Axios con interceptor de auth
├── context/AuthProvider   # Solo guarda token y user básico
├── pages/
│   ├── Login.jsx          # Login funcional
│   ├── Dashboard.jsx      # Lista proyectos, crear proyecto básico
│   └── Tasks.jsx          # Lista tasks de un proyecto, filtro por status
├── components/
│   └── Navbar.jsx         # Nombre de usuario y logout
└── routes/
    ├── AppRouter.jsx      # Rutas: /, /dashboard, /tasks/:projectId
    └── PrivateRoute.jsx   # Protege rutas con token
```

### FASE F1: Registro de usuarios

**Funcionalidad:** Actualmente solo hay login, falta registro.

- [ ] Crear página `Register.jsx`
- [ ] Formulario: nombre, email, password, confirmar password
- [ ] Validaciones en frontend (email válido, password 6+ chars)
- [ ] Redirigir a login después de registro exitoso
- [ ] Link "¿No tienes cuenta? Regístrate" en Login

**Endpoint:** `POST /api/auth/register`

---

### FASE F2: Dashboard mejorado con estadísticas

**Funcionalidad:** Mostrar stats generales y mejorar UI del dashboard.

- [ ] Llamar a `GET /api/stats` para mostrar resumen
- [ ] Cards de estadísticas: Total proyectos, Total tasks, Mis tasks, Tasks completadas
- [ ] Gráfico simple de tasks por status (puede ser con barras CSS, no requiere librería)
- [ ] Separar "Mis Proyectos" vs "Todos los Proyectos"
- [ ] Llamar a `GET /api/me/projects` para mis proyectos

**Endpoints:**
- `GET /api/stats`
- `GET /api/me/projects`

---

### FASE F3: Gestión de miembros de proyecto

**Funcionalidad:** Ver y gestionar miembros de cada proyecto.

- [ ] En la vista de proyecto, mostrar lista de miembros
- [ ] Botón "Agregar miembro" (solo si soy owner o admin)
- [ ] Modal/dropdown para seleccionar usuario de `GET /api/users`
- [ ] Botón para remover miembro (con confirmación)
- [ ] Mostrar badge "Owner" / "Member" junto al nombre

**Endpoints:**
- `GET /api/projects/:id/members`
- `POST /api/projects/:id/members`
- `DELETE /api/projects/:id/members/:userId`
- `GET /api/users`

---

### FASE F4: Tasks mejoradas

**Funcionalidad:** Mejorar la gestión de tasks con todas las features del backend.

- [ ] Mostrar prioridad con colores (high=rojo, medium=amarillo, low=verde)
- [ ] Mostrar usuario asignado en cada task
- [ ] Mostrar due_date y marcar en rojo si está vencida
- [ ] Dropdown para asignar task a un miembro del proyecto
- [ ] Editar task (modal o página)
- [ ] Cambiar status con drag-and-drop o dropdown
- [ ] Filtro por prioridad además de status
- [ ] Paginación real (botones anterior/siguiente con page y limit)

**Endpoints:**
- `GET /api/projects/:projectId/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

---

### FASE F5: Comentarios en Tasks

**Funcionalidad:** Sistema de comentarios en cada task.

- [ ] Al hacer clic en una task, abrir modal/página de detalle
- [ ] Mostrar lista de comentarios con autor y fecha
- [ ] Input para agregar nuevo comentario
- [ ] Botón eliminar en mis propios comentarios
- [ ] Contador de comentarios en la card de la task

**Endpoints:**
- `GET /api/tasks/:id/comments`
- `POST /api/tasks/:id/comments`
- `DELETE /api/comments/:commentId`

---

### FASE F6: Página "Mis Tasks"

**Funcionalidad:** Ver todas las tasks asignadas a mí en un solo lugar.

- [ ] Nueva ruta `/my-tasks`
- [ ] Llamar a `GET /api/me/tasks`
- [ ] Mostrar tasks agrupadas por proyecto o en lista con nombre de proyecto
- [ ] Filtros por status y prioridad
- [ ] Link rápido para ir al proyecto de cada task

**Endpoint:** `GET /api/me/tasks`

---

### FASE F7: Mejoras de UX

**Funcionalidad:** Mejorar la experiencia general.

- [ ] Loading spinners mientras cargan datos
- [ ] Mensajes de error amigables (toast notifications)
- [ ] Confirmación antes de eliminar (proyectos, tasks, miembros)
- [ ] Breadcrumbs para navegación (Dashboard > Proyecto > Task)
- [ ] Responsive design mejorado para móviles
- [ ] Modo oscuro (opcional, usar variables CSS)

---

### FASE F8: Panel de Admin (opcional)

**Funcionalidad:** Vista especial para administradores.

- [ ] Nueva ruta `/admin` (solo si user.role === 'admin')
- [ ] Ver logs del sistema `GET /api/logs`
- [ ] Ver estadísticas de logs `GET /api/logs/stats`
- [ ] Lista de todos los usuarios
- [ ] Poder cambiar rol de usuarios (requiere nuevo endpoint en backend)

**Endpoints:**
- `GET /api/logs`
- `GET /api/logs/stats`
- `GET /api/users`

---

### Nuevas rutas del Frontend

| Path | Componente | Descripción |
|------|------------|-------------|
| `/` | Login | Login de usuario |
| `/register` | Register | **NUEVO** - Registro |
| `/dashboard` | Dashboard | Proyectos + Stats |
| `/projects/:id` | ProjectDetail | **NUEVO** - Detalle con miembros |
| `/projects/:id/tasks` | Tasks | Tasks del proyecto |
| `/tasks/:id` | TaskDetail | **NUEVO** - Detalle con comentarios |
| `/my-tasks` | MyTasks | **NUEVO** - Mis tasks asignadas |
| `/admin` | AdminPanel | **NUEVO** - Panel admin (logs, users) |

---

### Componentes a crear

```
frontend/src/
├── components/
│   ├── Navbar.jsx           # Actualizar con links a My Tasks
│   ├── StatsCard.jsx        # NUEVO - Card de estadística
│   ├── TaskCard.jsx         # NUEVO - Card de task con prioridad/status
│   ├── MemberList.jsx       # NUEVO - Lista de miembros
│   ├── CommentList.jsx      # NUEVO - Lista de comentarios
│   ├── CommentForm.jsx      # NUEVO - Input para comentar
│   ├── Modal.jsx            # NUEVO - Modal reutilizable
│   ├── LoadingSpinner.jsx   # NUEVO - Spinner de carga
│   └── Toast.jsx            # NUEVO - Notificaciones
├── pages/
│   ├── Register.jsx         # NUEVO
│   ├── ProjectDetail.jsx    # NUEVO
│   ├── TaskDetail.jsx       # NUEVO
│   ├── MyTasks.jsx          # NUEVO
│   └── AdminPanel.jsx       # NUEVO
```

---

### Orden de implementación sugerido

| Orden | Fase | Prioridad | Descripción |
|-------|------|-----------|-------------|
| 1 | F1 | Alta | Registro de usuarios |
| 2 | F4 | Alta | Tasks mejoradas (prioridad, asignación, edición) |
| 3 | F2 | Alta | Dashboard con estadísticas |
| 4 | F5 | Media | Comentarios en tasks |
| 5 | F3 | Media | Gestión de miembros |
| 6 | F6 | Media | Página Mis Tasks |
| 7 | F7 | Media | Mejoras de UX |
| 8 | F8 | Baja | Panel de Admin |

---

### Datos de prueba disponibles

```
🔐 Credenciales:
   Admin: miguel@devteam.com / password123
   Admin: carlos@devteam.com / password123
   Admin: sofia@devteam.com / password123
   User:  ana@devteam.com / password123
   User:  cualquier otro @devteam.com / password123

📊 Base de datos poblada con:
   • 8 usuarios
   • 5 proyectos de desarrollo real
   • 26 tasks con diferentes estados/prioridades
   • 33 comentarios realistas

🔄 Para repoblar: npm run seed (en /backend)
```