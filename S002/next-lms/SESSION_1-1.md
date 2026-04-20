# SESIÓN 1.1 - Setup del Proyecto

**Objetivo:** Preparar el entorno de desarrollo completo para el LMS multi-tenant.

**Duración estimada:** 2-3 horas

**Requisitos previos:**
- Node.js 18+ instalado
- Docker Desktop instalado y corriendo
- VS Code con extensiones: ESLint, Prettier, Prisma, Tailwind CSS IntelliSense
- Git configurado

---

## Paso 1: Verificar la Estructura Inicial

### 1.1 Entender qué tenemos

El proyecto ya fue creado con `create-next-app`. Veamos qué tenemos:

```bash
# En la terminal, navega al proyecto
cd C:\xampp\htdocs\bootcamps\backend-junior\S002\next-lms

# Ver la estructura actual
ls -la
```

**Estructura actual:**
```
next-lms/
├── src/
│   └── app/
│       ├── layout.tsx      # Layout raíz (ya configurado con Geist fonts)
│       ├── page.tsx        # Página principal (template por defecto)
│       ├── globals.css     # Estilos globales + Tailwind
│       └── favicon.ico
├── public/                 # Assets estáticos
├── node_modules/           # Dependencias
├── package.json            # Configuración del proyecto
├── tsconfig.json           # Configuración TypeScript
├── next.config.ts          # Configuración de Next.js
├── eslint.config.mjs       # Configuración ESLint
├── postcss.config.mjs      # Configuración PostCSS/Tailwind
└── CLAUDE.md               # Este archivo
```

### 1.2 Verificar que todo funciona

```bash
# Instalar dependencias (si no lo has hecho)
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

Abre http://localhost:3000 y verifica que ves la página por defecto de Next.js.

**Detén el servidor con `Ctrl+C` antes de continuar.**

---

## Paso 2: Crear Estructura de Carpetas

### 2.1 Crear la arquitectura del proyecto

Ejecuta estos comandos para crear la estructura de carpetas:

```bash
# Crear carpetas para componentes
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/forms
mkdir -p src/components/dashboard
mkdir -p src/components/landing

# Crear carpetas para lógica de negocio
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/config

# Crear carpetas para tipos TypeScript
mkdir -p src/types

# Crear carpeta para Prisma
mkdir -p prisma
```

### 2.2 Explicación de cada carpeta

| Carpeta | Propósito |
|---------|-----------|
| `src/components/ui` | Componentes base reutilizables (Button, Input, Card, Modal, etc.) |
| `src/components/layout` | Componentes de estructura (Header, Footer, Sidebar, etc.) |
| `src/components/forms` | Componentes de formularios específicos |
| `src/components/dashboard` | Componentes específicos del panel admin |
| `src/components/landing` | Componentes específicos de la landing page |
| `src/lib` | Utilidades, helpers, configuraciones de librerías |
| `src/hooks` | Custom React hooks |
| `src/services` | Lógica de conexión con APIs externas |
| `src/config` | Constantes y configuraciones de la app |
| `src/types` | Definiciones de tipos TypeScript |
| `prisma` | Esquemas y migraciones de base de datos |

### 2.3 Crear archivos índice vacíos

Esto nos ayudará a organizar las exportaciones:

```bash
# Crear archivos index para exportaciones
echo "// UI Components exports" > src/components/ui/index.ts
echo "// Layout Components exports" > src/components/layout/index.ts
echo "// Form Components exports" > src/components/forms/index.ts
echo "// Custom hooks exports" > src/hooks/index.ts
echo "// Type definitions" > src/types/index.ts
echo "// App configuration" > src/config/index.ts
echo "// Utility functions" > src/lib/utils.ts
```

---

## Paso 3: Configurar Variables de Entorno

### 3.1 Crear archivo .env.local

Crea el archivo `.env.local` en la raíz del proyecto:

```bash
# Crear archivo de variables de entorno
touch .env.local
```

### 3.2 Agregar las variables de entorno

Abre `.env.local` y agrega el siguiente contenido:

```env
# ===========================================
# NEXT-LMS - Variables de Entorno
# ===========================================

# Entorno
NODE_ENV=development

# ===========================================
# BASE DE DATOS (PostgreSQL)
# ===========================================
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/nextlms_dev?schema=public"

# ===========================================
# AUTENTICACIÓN (NextAuth.js)
# ===========================================
# Genera un secret con: openssl rand -base64 32
NEXTAUTH_SECRET="tu-secret-super-seguro-cambiar-en-produccion"
NEXTAUTH_URL="http://localhost:3000"

# ===========================================
# MERCADO PAGO (Sandbox)
# ===========================================
MERCADOPAGO_PUBLIC_KEY="TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
MERCADOPAGO_ACCESS_TOKEN="TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# ===========================================
# GROQ AI
# ===========================================
GROQ_API_KEY="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# ===========================================
# APP CONFIG
# ===========================================
NEXT_PUBLIC_APP_NAME="Next LMS"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3.3 Crear archivo .env.example

Este archivo sirve como referencia para otros desarrolladores:

```bash
# Copiar .env.local como ejemplo (sin valores sensibles)
cp .env.local .env.example
```

Edita `.env.example` y reemplaza los valores sensibles con placeholders:

```env
# ===========================================
# NEXT-LMS - Variables de Entorno (EJEMPLO)
# ===========================================

# Entorno
NODE_ENV=development

# ===========================================
# BASE DE DATOS (PostgreSQL)
# ===========================================
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# ===========================================
# AUTENTICACIÓN (NextAuth.js)
# ===========================================
NEXTAUTH_SECRET="genera-con-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# ===========================================
# MERCADO PAGO (Sandbox)
# ===========================================
MERCADOPAGO_PUBLIC_KEY="tu-public-key"
MERCADOPAGO_ACCESS_TOKEN="tu-access-token"

# ===========================================
# GROQ AI
# ===========================================
GROQ_API_KEY="tu-groq-api-key"

# ===========================================
# APP CONFIG
# ===========================================
NEXT_PUBLIC_APP_NAME="Next LMS"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3.4 Verificar .gitignore

Asegúrate de que `.env.local` está en `.gitignore`:

```bash
# Ver contenido de .gitignore
cat .gitignore
```

Debe incluir:
```
.env*.local
```

---

## Paso 4: Configurar PostgreSQL con Docker

### 4.1 Crear archivo docker-compose.yml

Crea el archivo `docker-compose.yml` en la raíz del proyecto:

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Base de datos PostgreSQL
  postgres:
    image: postgres:16-alpine
    container_name: nextlms_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres123
      POSTGRES_DB: nextlms_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Adminer - GUI para gestionar la BD (opcional pero útil)
  adminer:
    image: adminer:latest
    container_name: nextlms_adminer
    restart: unless-stopped
    ports:
      - "8080:8080"
    depends_on:
      - postgres

volumes:
  postgres_data:
    name: nextlms_postgres_data
```

### 4.2 Iniciar los contenedores

```bash
# Iniciar PostgreSQL y Adminer
docker-compose up -d

# Verificar que están corriendo
docker-compose ps
```

Deberías ver algo como:
```
NAME                 STATUS              PORTS
nextlms_postgres     Up                  0.0.0.0:5432->5432/tcp
nextlms_adminer      Up                  0.0.0.0:8080->8080/tcp
```

### 4.3 Verificar conexión

Abre http://localhost:8080 para acceder a Adminer:

- **Sistema:** PostgreSQL
- **Servidor:** postgres (o localhost si no funciona)
- **Usuario:** postgres
- **Contraseña:** postgres123
- **Base de datos:** nextlms_dev

### 4.4 Comandos útiles de Docker

```bash
# Ver logs de PostgreSQL
docker-compose logs postgres

# Detener los contenedores
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra datos)
docker-compose down -v

# Reiniciar
docker-compose restart
```

---

## Paso 5: Instalar Dependencias Base

### 5.1 Dependencias de producción

```bash
npm install prisma @prisma/client
npm install next-auth@beta
npm install zod
npm install bcryptjs
npm install lucide-react
npm install clsx tailwind-merge
npm install @tanstack/react-query
```

**Explicación de cada paquete:**

| Paquete | Propósito |
|---------|-----------|
| `prisma` | ORM para base de datos |
| `@prisma/client` | Cliente de Prisma para queries |
| `next-auth@beta` | Autenticación (v5 para Next.js 14+) |
| `zod` | Validación de esquemas |
| `bcryptjs` | Hash de contraseñas |
| `lucide-react` | Iconos |
| `clsx` + `tailwind-merge` | Utilidades para clases CSS |
| `@tanstack/react-query` | Gestión de estado del servidor |

### 5.2 Dependencias de desarrollo

```bash
npm install -D @types/bcryptjs
npm install -D prisma
```

### 5.3 Verificar package.json

Tu `package.json` debería verse similar a esto en la sección de dependencias:

```json
{
  "dependencies": {
    "@prisma/client": "^6.x.x",
    "@tanstack/react-query": "^5.x.x",
    "bcryptjs": "^2.x.x",
    "clsx": "^2.x.x",
    "lucide-react": "^0.x.x",
    "next": "16.x.x",
    "next-auth": "5.0.0-beta.x",
    "react": "^19.x.x",
    "react-dom": "^19.x.x",
    "tailwind-merge": "^2.x.x",
    "zod": "^3.x.x"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.x.x",
    "prisma": "^6.x.x",
    // ... otras dependencias de desarrollo
  }
}
```

---

## Paso 6: Inicializar Prisma

### 6.1 Inicializar Prisma

```bash
npx prisma init
```

Esto creará:
- `prisma/schema.prisma` - Esquema de la base de datos
- Actualizará `.env` (pero nosotros usamos `.env.local`)

### 6.2 Configurar schema.prisma inicial

Reemplaza el contenido de `prisma/schema.prisma` con:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// MODELOS BASE - MULTI-TENANT
// ============================================

// Tenant (Organización/Empresa)
model Tenant {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique // Subdominio: empresa.nextlms.com
  logo      String?
  plan      Plan     @default(FREE)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  users   User[]
  courses Course[]

  @@map("tenants")
}

// Planes de suscripción
enum Plan {
  FREE
  STARTER
  PRO
  ENTERPRISE
}

// Usuario
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?   // Null si usa OAuth
  image         String?
  role          Role      @default(STUDENT)
  emailVerified DateTime?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Multi-tenant
  tenantId String?
  tenant   Tenant? @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  // Relaciones de autenticación
  accounts Account[]
  sessions Session[]

  // Relaciones de LMS
  enrollments  Enrollment[]
  coursesOwned Course[]     @relation("CourseOwner")

  @@map("users")
}

// Roles de usuario
enum Role {
  SUPER_ADMIN // Admin de la plataforma
  ADMIN       // Admin del tenant
  INSTRUCTOR  // Creador de cursos
  STUDENT     // Estudiante
}

// ============================================
// MODELOS DE AUTENTICACIÓN (NextAuth)
// ============================================

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ============================================
// MODELOS DEL LMS
// ============================================

// Curso
model Course {
  id          String   @id @default(cuid())
  title       String
  slug        String
  description String?  @db.Text
  thumbnail   String?
  price       Decimal? @db.Decimal(10, 2)
  isPublished Boolean  @default(false)
  isFree      Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Multi-tenant
  tenantId String
  tenant   Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  // Propietario/Instructor
  ownerId String
  owner   User   @relation("CourseOwner", fields: [ownerId], references: [id])

  // Relaciones
  modules     Module[]
  enrollments Enrollment[]
  categories  CategoriesOnCourses[]

  @@unique([tenantId, slug])
  @@map("courses")
}

// Módulo de un curso
model Module {
  id        String   @id @default(cuid())
  title     String
  position  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  courseId String
  course   Course @relation(fields: [courseId], references: [id], onDelete: Cascade)

  lessons Lesson[]

  @@map("modules")
}

// Lección de un módulo
model Lesson {
  id          String     @id @default(cuid())
  title       String
  content     String?    @db.Text
  videoUrl    String?
  position    Int
  type        LessonType @default(TEXT)
  isFree      Boolean    @default(false)
  isPublished Boolean    @default(false)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  moduleId String
  module   Module @relation(fields: [moduleId], references: [id], onDelete: Cascade)

  progress LessonProgress[]

  @@map("lessons")
}

enum LessonType {
  TEXT
  VIDEO
  QUIZ
}

// Categoría
model Category {
  id      String @id @default(cuid())
  name    String @unique
  slug    String @unique
  courses CategoriesOnCourses[]

  @@map("categories")
}

// Relación muchos a muchos: Cursos <-> Categorías
model CategoriesOnCourses {
  courseId   String
  categoryId String
  course     Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([courseId, categoryId])
  @@map("categories_on_courses")
}

// Inscripción a un curso
model Enrollment {
  id        String           @id @default(cuid())
  status    EnrollmentStatus @default(ACTIVE)
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt

  userId   String
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId String
  course   Course @relation(fields: [courseId], references: [id], onDelete: Cascade)

  progress LessonProgress[]

  @@unique([userId, courseId])
  @@map("enrollments")
}

enum EnrollmentStatus {
  ACTIVE
  COMPLETED
  CANCELLED
}

// Progreso de lección
model LessonProgress {
  id          String   @id @default(cuid())
  isCompleted Boolean  @default(false)
  completedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  enrollmentId String
  enrollment   Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  lessonId     String
  lesson       Lesson     @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@unique([enrollmentId, lessonId])
  @@map("lesson_progress")
}
```

### 6.3 Ejecutar la primera migración

Asegúrate de que Docker con PostgreSQL está corriendo:

```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps

# Crear la migración inicial
npx prisma migrate dev --name init

# Generar el cliente de Prisma
npx prisma generate
```

### 6.4 Verificar en Adminer

Abre http://localhost:8080 y verifica que se crearon las tablas:
- tenants
- users
- accounts
- sessions
- courses
- modules
- lessons
- etc.

---

## Paso 7: Crear Utilidades Base

### 7.1 Crear cliente de Prisma

Crea el archivo `src/lib/prisma.ts`:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
```

**¿Por qué este patrón?**
En desarrollo, Next.js hace hot-reload y crearía múltiples instancias de Prisma. Este patrón reutiliza la misma instancia.

### 7.2 Crear utilidad de clases CSS

Crea el archivo `src/lib/utils.ts`:

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases de Tailwind de forma inteligente
 * Evita conflictos como "p-4 p-2" y mantiene solo "p-2"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 7.3 Crear tipos base

Crea el archivo `src/types/index.ts`:

```typescript
// src/types/index.ts

// Re-exportar tipos de Prisma
export type {
  User,
  Tenant,
  Course,
  Module,
  Lesson,
  Enrollment,
  Category,
  Role,
  Plan,
  LessonType,
  EnrollmentStatus,
} from '@prisma/client'

// Tipos personalizados para la aplicación
export interface NavItem {
  title: string
  href: string
  icon?: string
  disabled?: boolean
  external?: boolean
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}
```

### 7.4 Crear configuración de la app

Crea el archivo `src/config/site.ts`:

```typescript
// src/config/site.ts

export const siteConfig = {
  name: "Next LMS",
  description: "Plataforma de aprendizaje en línea multi-tenant",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    twitter: "https://twitter.com/nextlms",
    github: "https://github.com/tu-usuario/next-lms",
  },
}

export type SiteConfig = typeof siteConfig
```

### 7.5 Actualizar src/config/index.ts

```typescript
// src/config/index.ts
export * from './site'
```

---

## Paso 8: Verificar Todo

### 8.1 Estructura final

Tu proyecto debería verse así:

```
next-lms/
├── prisma/
│   ├── schema.prisma         ✅ Esquema de BD
│   └── migrations/           ✅ Migraciones
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── favicon.ico
│   ├── components/
│   │   ├── ui/
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   └── index.ts
│   │   ├── forms/
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   └── landing/
│   ├── config/
│   │   ├── index.ts
│   │   └── site.ts
│   ├── hooks/
│   │   └── index.ts
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── utils.ts
│   ├── services/
│   └── types/
│       └── index.ts
├── public/
├── .env.local                ✅ Variables de entorno
├── .env.example              ✅ Ejemplo de variables
├── docker-compose.yml        ✅ PostgreSQL + Adminer
├── package.json              ✅ Dependencias instaladas
├── tsconfig.json
├── next.config.ts
└── CLAUDE.md
```

### 8.2 Verificar que todo compila

```bash
# Verificar tipos TypeScript
npx tsc --noEmit

# Ejecutar linter
npm run lint

# Iniciar servidor de desarrollo
npm run dev
```

### 8.3 Verificar conexión a BD

Crea un archivo temporal para probar la conexión. Crea `src/app/test-db/page.tsx`:

```typescript
// src/app/test-db/page.tsx
import prisma from '@/lib/prisma'

export default async function TestDBPage() {
  // Contar registros en cada tabla
  const tenantCount = await prisma.tenant.count()
  const userCount = await prisma.user.count()
  const courseCount = await prisma.course.count()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de Conexión a BD</h1>
      <ul className="space-y-2">
        <li>✅ Conexión exitosa a PostgreSQL</li>
        <li>📊 Tenants: {tenantCount}</li>
        <li>👥 Usuarios: {userCount}</li>
        <li>📚 Cursos: {courseCount}</li>
      </ul>
    </div>
  )
}
```

Visita http://localhost:3000/test-db para verificar la conexión.

---

## Resumen de la Sesión 1.1

### ✅ Lo que aprendimos:

1. **Estructura de proyecto** - Organización escalable para un proyecto Next.js
2. **Variables de entorno** - Configuración segura con `.env.local`
3. **Docker** - PostgreSQL y Adminer para desarrollo local
4. **Prisma ORM** - Configuración y esquema multi-tenant
5. **Utilidades base** - Cliente Prisma, función `cn()`, tipos TypeScript

### ✅ Tareas completadas:

- [x] Verificar estructura inicial de Next.js 16
- [x] Configurar variables de entorno (.env.local)
- [x] Instalar dependencias base
- [x] Configurar PostgreSQL local con Docker
- [x] Crear estructura de carpetas del proyecto

### 📝 Comandos importantes:

```bash
# Docker
docker-compose up -d          # Iniciar BD
docker-compose down           # Detener BD
docker-compose logs postgres  # Ver logs

# Prisma
npx prisma migrate dev        # Crear migración
npx prisma generate           # Generar cliente
npx prisma studio             # GUI para ver datos

# Desarrollo
npm run dev                   # Servidor de desarrollo
npm run lint                  # Verificar código
npx tsc --noEmit              # Verificar tipos
```

---

## Próxima Sesión: 1.2 - Base de Datos y Modelos

En la siguiente sesión:
- Crear seeders para datos de prueba
- Explorar Prisma Studio
- Crear funciones de acceso a datos
- Implementar patrones multi-tenant

---

**Estado de la Sesión 1.1:** ✅ Completada