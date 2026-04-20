# SESIÓN 1.2 - Base de Datos y Modelos

**Objetivo:** Poblar la base de datos con datos de prueba, entender Prisma a profundidad y crear servicios de acceso a datos con patrones multi-tenant.

**Duración estimada:** 2-3 horas

**Requisitos previos:**
- Sesión 1.1 completada
- Docker corriendo con PostgreSQL
- Dependencias instaladas

---

## Paso 1: Entender el Esquema de Base de Datos

### 1.1 Diagrama de Relaciones

```
┌─────────────────────────────────────────────────────────────────┐
│                        MULTI-TENANT                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐         ┌──────────┐         ┌──────────┐         │
│  │  TENANT  │───────▶│   USER   │────────▶│ ACCOUNT  │         │
│  │          │   1:N   │          │   1:N   │ (OAuth)  │         │
│  └──────────┘         └──────────┘         └──────────┘         │
│       │                    │                                    │
│       │ 1:N                │ 1:N (owner)                        │
│       ▼                    ▼                                    │
│  ┌──────────┐         ┌──────────┐         ┌──────────┐         │
│  │  COURSE  │◀────────│  COURSE  │────────▶│ CATEGORY │        │
│  │          │         │          │   N:M   │          │         │
│  └──────────┘         └──────────┘         └──────────┘         │
│       │                    │                                    │
│       │ 1:N                │ 1:N (enrollment)                   │
│       ▼                    ▼                                    │
│  ┌──────────┐         ┌──────────┐                              │
│  │  MODULE  │         │ENROLLMENT│                              │
│  │          │         │          │                              │
│  └──────────┘         └──────────┘                              │
│       │                    │                                    │
│       │ 1:N                │ 1:N                                │
│       ▼                    ▼                                    │
│  ┌──────────┐         ┌──────────┐                              │
│  │  LESSON  │◀────────│ PROGRESS │                              │
│  │          │   1:N   │          │                              │
│  └──────────┘         └──────────┘                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Explicación de Relaciones Clave

| Relación | Tipo | Descripción |
|----------|------|-------------|
| Tenant → User | 1:N | Un tenant tiene muchos usuarios |
| Tenant → Course | 1:N | Un tenant tiene muchos cursos |
| User → Course | 1:N | Un usuario (instructor) puede crear muchos cursos |
| User → Enrollment | 1:N | Un usuario puede inscribirse en muchos cursos |
| Course → Module | 1:N | Un curso tiene muchos módulos |
| Module → Lesson | 1:N | Un módulo tiene muchas lecciones |
| Course ↔ Category | N:M | Muchos cursos pueden tener muchas categorías |
| Enrollment → Progress | 1:N | Una inscripción trackea progreso de muchas lecciones |

### 1.3 Patrones Multi-Tenant

**Patrón elegido: Columna de Tenant ID**

```
┌─────────────────────────────────────────────────────────────┐
│ Estrategias Multi-Tenant                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. BD Separada por Tenant    → Más aislamiento, más costo   │
│ 2. Schema Separado por Tenant → Buen balance                │
│ 3. Columna tenant_id (✅)    → Simple, escalable           │
│                                                             │
│ Nosotros usamos #3:                                         │
│ - Todos los datos en las mismas tablas                      │
│ - Cada registro tiene tenant_id                             │
│ - Filtramos por tenant_id en cada query                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Paso 2: Crear Seeders

### 2.1 Crear archivo de seed

Crea el archivo `prisma/seed.ts`:

```typescript
// prisma/seed.ts
import { PrismaClient, Role, Plan, LessonType } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // ============================================
  // 1. LIMPIAR BASE DE DATOS (orden importante por FK)
  // ============================================
  console.log('🧹 Limpiando datos existentes...')

  await prisma.lessonProgress.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.module.deleteMany()
  await prisma.categoriesOnCourses.deleteMany()
  await prisma.course.deleteMany()
  await prisma.category.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()
  await prisma.tenant.deleteMany()

  // ============================================
  // 2. CREAR CATEGORÍAS
  // ============================================
  console.log('📁 Creando categorías...')

  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Desarrollo Web', slug: 'desarrollo-web' }
    }),
    prisma.category.create({
      data: { name: 'Desarrollo Mobile', slug: 'desarrollo-mobile' }
    }),
    prisma.category.create({
      data: { name: 'Base de Datos', slug: 'base-de-datos' }
    }),
    prisma.category.create({
      data: { name: 'DevOps', slug: 'devops' }
    }),
    prisma.category.create({
      data: { name: 'Inteligencia Artificial', slug: 'inteligencia-artificial' }
    }),
    prisma.category.create({
      data: { name: 'Diseño UX/UI', slug: 'diseno-ux-ui' }
    }),
  ])

  console.log(`   ✅ ${categories.length} categorías creadas`)

  // ============================================
  // 3. CREAR TENANTS
  // ============================================
  console.log('🏢 Creando tenants...')

  const tenantAcme = await prisma.tenant.create({
    data: {
      name: 'ACME Academy',
      slug: 'acme',
      plan: Plan.PRO,
      logo: '/tenants/acme-logo.png',
    }
  })

  const tenantTechSchool = await prisma.tenant.create({
    data: {
      name: 'Tech School',
      slug: 'techschool',
      plan: Plan.STARTER,
      logo: '/tenants/techschool-logo.png',
    }
  })

  const tenantFreeLearn = await prisma.tenant.create({
    data: {
      name: 'Free Learn',
      slug: 'freelearn',
      plan: Plan.FREE,
    }
  })

  console.log('   ✅ 3 tenants creados')

  // ============================================
  // 4. CREAR USUARIOS
  // ============================================
  console.log('👥 Creando usuarios...')

  const hashedPassword = await hash('password123', 12)

  // Super Admin (sin tenant - administra la plataforma)
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@nextlms.com',
      name: 'Super Administrador',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      emailVerified: new Date(),
    }
  })

  // Admin de ACME
  const adminAcme = await prisma.user.create({
    data: {
      email: 'admin@acme.com',
      name: 'Admin ACME',
      password: hashedPassword,
      role: Role.ADMIN,
      tenantId: tenantAcme.id,
      emailVerified: new Date(),
    }
  })

  // Instructor de ACME
  const instructorAcme = await prisma.user.create({
    data: {
      email: 'instructor@acme.com',
      name: 'Carlos Instructor',
      password: hashedPassword,
      role: Role.INSTRUCTOR,
      tenantId: tenantAcme.id,
      emailVerified: new Date(),
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
    }
  })

  // Estudiantes de ACME
  const student1Acme = await prisma.user.create({
    data: {
      email: 'maria@student.com',
      name: 'María García',
      password: hashedPassword,
      role: Role.STUDENT,
      tenantId: tenantAcme.id,
      emailVerified: new Date(),
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    }
  })

  const student2Acme = await prisma.user.create({
    data: {
      email: 'juan@student.com',
      name: 'Juan Pérez',
      password: hashedPassword,
      role: Role.STUDENT,
      tenantId: tenantAcme.id,
      emailVerified: new Date(),
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=juan',
    }
  })

  // Admin de Tech School
  const adminTechSchool = await prisma.user.create({
    data: {
      email: 'admin@techschool.com',
      name: 'Admin Tech School',
      password: hashedPassword,
      role: Role.ADMIN,
      tenantId: tenantTechSchool.id,
      emailVerified: new Date(),
    }
  })

  console.log('   ✅ 6 usuarios creados')

  // ============================================
  // 5. CREAR CURSOS
  // ============================================
  console.log('📚 Creando cursos...')

  // Curso 1: Next.js Completo (ACME)
  const courseNextjs = await prisma.course.create({
    data: {
      title: 'Next.js 16 - Curso Completo',
      slug: 'nextjs-16-curso-completo',
      description: `
        Aprende Next.js 16 desde cero hasta nivel avanzado.

        En este curso aprenderás:
        - App Router y Server Components
        - Data Fetching y Caching
        - Autenticación con NextAuth.js
        - Deployment en Vercel

        ¡Incluye proyecto final de un LMS completo!
      `.trim(),
      thumbnail: '/courses/nextjs-thumbnail.jpg',
      price: 49.99,
      isPublished: true,
      isFree: false,
      tenantId: tenantAcme.id,
      ownerId: instructorAcme.id,
      categories: {
        create: [
          { categoryId: categories[0].id }, // Desarrollo Web
        ]
      },
      modules: {
        create: [
          {
            title: 'Introducción a Next.js',
            position: 1,
            lessons: {
              create: [
                {
                  title: '¿Qué es Next.js?',
                  content: `
# ¿Qué es Next.js?

Next.js es un framework de React que permite crear aplicaciones web fullstack.

## Características principales:

1. **Server Components** - Componentes que se renderizan en el servidor
2. **App Router** - Sistema de rutas basado en el sistema de archivos
3. **API Routes** - Backend integrado
4. **Optimizaciones** - Imágenes, fonts, scripts automáticamente optimizados

## ¿Por qué usar Next.js?

- Mejor SEO
- Mejor rendimiento
- Experiencia de desarrollo superior
                  `.trim(),
                  position: 1,
                  type: LessonType.TEXT,
                  isFree: true,
                  isPublished: true,
                },
                {
                  title: 'Instalación y Configuración',
                  content: `
# Instalación de Next.js

## Requisitos previos

- Node.js 18.17 o superior
- npm, yarn, o pnpm

## Crear un nuevo proyecto

\`\`\`bash
npx create-next-app@latest mi-proyecto
\`\`\`

## Opciones recomendadas

- TypeScript: Sí
- ESLint: Sí
- Tailwind CSS: Sí
- src/ directory: Sí
- App Router: Sí
                  `.trim(),
                  position: 2,
                  type: LessonType.TEXT,
                  isFree: true,
                  isPublished: true,
                },
                {
                  title: 'Estructura del Proyecto',
                  content: 'Contenido sobre la estructura de carpetas...',
                  position: 3,
                  type: LessonType.TEXT,
                  isFree: false,
                  isPublished: true,
                },
              ]
            }
          },
          {
            title: 'App Router en Profundidad',
            position: 2,
            lessons: {
              create: [
                {
                  title: 'Rutas y Layouts',
                  content: 'Contenido sobre rutas y layouts...',
                  position: 1,
                  type: LessonType.TEXT,
                  isPublished: true,
                },
                {
                  title: 'Loading y Error States',
                  content: 'Contenido sobre estados de carga y error...',
                  position: 2,
                  type: LessonType.TEXT,
                  isPublished: true,
                },
                {
                  title: 'Quiz: App Router',
                  content: '{"questions": []}',
                  position: 3,
                  type: LessonType.QUIZ,
                  isPublished: false,
                },
              ]
            }
          },
          {
            title: 'Server Components',
            position: 3,
            lessons: {
              create: [
                {
                  title: 'Server vs Client Components',
                  content: 'Contenido sobre componentes...',
                  position: 1,
                  type: LessonType.TEXT,
                  isPublished: true,
                },
                {
                  title: 'Data Fetching en Server Components',
                  videoUrl: 'https://www.youtube.com/watch?v=example',
                  position: 2,
                  type: LessonType.VIDEO,
                  isPublished: true,
                },
              ]
            }
          },
        ]
      }
    }
  })

  // Curso 2: React Fundamentos (ACME - Gratis)
  const courseReact = await prisma.course.create({
    data: {
      title: 'React - Fundamentos',
      slug: 'react-fundamentos',
      description: 'Aprende los fundamentos de React antes de pasar a Next.js',
      thumbnail: '/courses/react-thumbnail.jpg',
      isPublished: true,
      isFree: true,
      tenantId: tenantAcme.id,
      ownerId: instructorAcme.id,
      categories: {
        create: [
          { categoryId: categories[0].id }, // Desarrollo Web
        ]
      },
      modules: {
        create: [
          {
            title: 'Introducción a React',
            position: 1,
            lessons: {
              create: [
                {
                  title: '¿Qué es React?',
                  content: 'Introducción a React...',
                  position: 1,
                  type: LessonType.TEXT,
                  isFree: true,
                  isPublished: true,
                },
                {
                  title: 'JSX y Componentes',
                  content: 'JSX y componentes funcionales...',
                  position: 2,
                  type: LessonType.TEXT,
                  isFree: true,
                  isPublished: true,
                },
              ]
            }
          },
        ]
      }
    }
  })

  // Curso 3: PostgreSQL (Tech School)
  const coursePostgres = await prisma.course.create({
    data: {
      title: 'PostgreSQL desde Cero',
      slug: 'postgresql-desde-cero',
      description: 'Domina PostgreSQL para aplicaciones modernas',
      thumbnail: '/courses/postgres-thumbnail.jpg',
      price: 29.99,
      isPublished: true,
      isFree: false,
      tenantId: tenantTechSchool.id,
      ownerId: adminTechSchool.id,
      categories: {
        create: [
          { categoryId: categories[2].id }, // Base de Datos
        ]
      },
      modules: {
        create: [
          {
            title: 'Fundamentos SQL',
            position: 1,
            lessons: {
              create: [
                {
                  title: 'SELECT, INSERT, UPDATE, DELETE',
                  content: 'Operaciones CRUD básicas...',
                  position: 1,
                  type: LessonType.TEXT,
                  isFree: true,
                  isPublished: true,
                },
              ]
            }
          },
        ]
      }
    }
  })

  console.log('   ✅ 3 cursos creados con módulos y lecciones')

  // ============================================
  // 6. CREAR INSCRIPCIONES Y PROGRESO
  // ============================================
  console.log('📝 Creando inscripciones...')

  // María inscrita en Next.js
  const enrollmentMaria = await prisma.enrollment.create({
    data: {
      userId: student1Acme.id,
      courseId: courseNextjs.id,
    }
  })

  // Juan inscrito en React
  const enrollmentJuan = await prisma.enrollment.create({
    data: {
      userId: student2Acme.id,
      courseId: courseReact.id,
    }
  })

  // Obtener lecciones para crear progreso
  const lessonsNextjs = await prisma.lesson.findMany({
    where: { module: { courseId: courseNextjs.id } },
    orderBy: { position: 'asc' },
    take: 2,
  })

  // María ha completado 2 lecciones
  for (const lesson of lessonsNextjs) {
    await prisma.lessonProgress.create({
      data: {
        enrollmentId: enrollmentMaria.id,
        lessonId: lesson.id,
        isCompleted: true,
        completedAt: new Date(),
      }
    })
  }

  console.log('   ✅ 2 inscripciones creadas con progreso')

  // ============================================
  // RESUMEN
  // ============================================
  console.log('')
  console.log('════════════════════════════════════════')
  console.log('🎉 Seed completado exitosamente!')
  console.log('════════════════════════════════════════')
  console.log('')
  console.log('📊 Resumen:')
  console.log(`   - Categorías: ${categories.length}`)
  console.log('   - Tenants: 3')
  console.log('   - Usuarios: 6')
  console.log('   - Cursos: 3')
  console.log('   - Inscripciones: 2')
  console.log('')
  console.log('🔐 Credenciales de prueba:')
  console.log('   Email: superadmin@nextlms.com')
  console.log('   Email: admin@acme.com')
  console.log('   Email: instructor@acme.com')
  console.log('   Email: maria@student.com')
  console.log('   Password: password123')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 2.2 Configurar package.json para seeds

Agrega el script de seed en `package.json`:

```json
{
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  }
}
```

Tu `package.json` debería verse así (sección relevante):

```json
{
  "name": "next-lms",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  },
  "dependencies": {
    // ...
  }
}
```

### 2.3 Instalar tsx para ejecutar TypeScript

```bash
npm install -D tsx
```

### 2.4 Ejecutar el Seed

```bash
# Ejecutar seed
npx prisma db seed
```

Deberías ver:

```
🌱 Iniciando seed de la base de datos...
🧹 Limpiando datos existentes...
📁 Creando categorías...
   ✅ 6 categorías creadas
🏢 Creando tenants...
   ✅ 3 tenants creados
👥 Creando usuarios...
   ✅ 6 usuarios creados
📚 Creando cursos...
   ✅ 3 cursos creados con módulos y lecciones
📝 Creando inscripciones...
   ✅ 2 inscripciones creadas con progreso

════════════════════════════════════════
🎉 Seed completado exitosamente!
════════════════════════════════════════
```

---

## Paso 3: Explorar Prisma Studio

### 3.1 Abrir Prisma Studio

```bash
npx prisma studio
```

Esto abrirá una interfaz web en http://localhost:5555

### 3.2 Explorar los datos

En Prisma Studio puedes:

1. **Ver todas las tablas** - Click en cada modelo para ver registros
2. **Filtrar datos** - Usar la barra de búsqueda
3. **Editar registros** - Click en una celda para editar
4. **Agregar registros** - Botón "Add record"
5. **Ver relaciones** - Click en campos relacionados

### 3.3 Ejercicio práctico

Abre Prisma Studio y verifica:

- [ ] Hay 3 tenants (acme, techschool, freelearn)
- [ ] Hay 6 usuarios con diferentes roles
- [ ] El curso "Next.js 16" tiene 3 módulos
- [ ] María tiene 2 lecciones completadas
- [ ] Las categorías están asociadas a los cursos

---

## Paso 4: Crear Servicios de Acceso a Datos

### 4.1 Concepto de Servicios/Repositorios

```
┌─────────────────────────────────────────────────────────────┐
│ ARQUITECTURA DE CAPAS                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐                                           │
│  │   PÁGINAS   │  ← Server/Client Components               │
│  │  (app/*.tsx)│                                           │
│  └──────┬──────┘                                           │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────┐                                           │
│  │  SERVICIOS  │  ← Lógica de negocio + queries           │
│  │ (services/) │                                           │
│  └──────┬──────┘                                           │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────┐                                           │
│  │   PRISMA    │  ← ORM / Acceso a BD                      │
│  │  (lib/prisma)│                                          │
│  └─────────────┘                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Crear servicio de Tenants

Crea el archivo `src/services/tenant.service.ts`:

```typescript
// src/services/tenant.service.ts
import prisma from '@/lib/prisma'
import { Tenant, Plan, Prisma } from '@prisma/client'

// Tipos para las respuestas
export type TenantWithCounts = Tenant & {
  _count: {
    users: number
    courses: number
  }
}

// ============================================
// QUERIES (Lectura)
// ============================================

/**
 * Obtener todos los tenants activos
 */
export async function getAllTenants(): Promise<TenantWithCounts[]> {
  return prisma.tenant.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          users: true,
          courses: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Obtener tenant por ID
 */
export async function getTenantById(id: string): Promise<Tenant | null> {
  return prisma.tenant.findUnique({
    where: { id },
  })
}

/**
 * Obtener tenant por slug (subdominio)
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  return prisma.tenant.findUnique({
    where: { slug },
  })
}

/**
 * Verificar si un slug está disponible
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: { id: true },
  })
  return tenant === null
}

// ============================================
// MUTATIONS (Escritura)
// ============================================

export type CreateTenantInput = {
  name: string
  slug: string
  logo?: string
  plan?: Plan
}

/**
 * Crear un nuevo tenant
 */
export async function createTenant(data: CreateTenantInput): Promise<Tenant> {
  return prisma.tenant.create({
    data: {
      name: data.name,
      slug: data.slug.toLowerCase(),
      logo: data.logo,
      plan: data.plan || Plan.FREE,
    },
  })
}

export type UpdateTenantInput = Partial<CreateTenantInput> & {
  isActive?: boolean
}

/**
 * Actualizar un tenant
 */
export async function updateTenant(
  id: string,
  data: UpdateTenantInput
): Promise<Tenant> {
  return prisma.tenant.update({
    where: { id },
    data,
  })
}

/**
 * Desactivar un tenant (soft delete)
 */
export async function deactivateTenant(id: string): Promise<Tenant> {
  return prisma.tenant.update({
    where: { id },
    data: { isActive: false },
  })
}

/**
 * Eliminar un tenant (hard delete)
 * ⚠️ Cuidado: Esto eliminará todos los datos relacionados
 */
export async function deleteTenant(id: string): Promise<Tenant> {
  return prisma.tenant.delete({
    where: { id },
  })
}
```

### 4.3 Crear servicio de Usuarios

Crea el archivo `src/services/user.service.ts`:

```typescript
// src/services/user.service.ts
import prisma from '@/lib/prisma'
import { User, Role, Prisma } from '@prisma/client'
import { hash, compare } from 'bcryptjs'

// Excluir password de las respuestas por defecto
const userSelectWithoutPassword = {
  id: true,
  email: true,
  name: true,
  image: true,
  role: true,
  emailVerified: true,
  isActive: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect

export type SafeUser = Omit<User, 'password'>

// ============================================
// QUERIES (Lectura)
// ============================================

/**
 * Obtener usuario por ID (sin password)
 */
export async function getUserById(id: string): Promise<SafeUser | null> {
  return prisma.user.findUnique({
    where: { id },
    select: userSelectWithoutPassword,
  })
}

/**
 * Obtener usuario por email (sin password)
 */
export async function getUserByEmail(email: string): Promise<SafeUser | null> {
  return prisma.user.findUnique({
    where: { email },
    select: userSelectWithoutPassword,
  })
}

/**
 * Obtener usuario por email CON password (para autenticación)
 */
export async function getUserByEmailWithPassword(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  })
}

/**
 * Obtener usuarios de un tenant específico
 * ⚠️ IMPORTANTE: Patrón Multi-Tenant - siempre filtrar por tenantId
 */
export async function getUsersByTenant(tenantId: string): Promise<SafeUser[]> {
  return prisma.user.findMany({
    where: {
      tenantId,
      isActive: true,
    },
    select: userSelectWithoutPassword,
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Obtener usuarios por rol dentro de un tenant
 */
export async function getUsersByRole(
  tenantId: string,
  role: Role
): Promise<SafeUser[]> {
  return prisma.user.findMany({
    where: {
      tenantId,
      role,
      isActive: true,
    },
    select: userSelectWithoutPassword,
  })
}

// ============================================
// MUTATIONS (Escritura)
// ============================================

export type CreateUserInput = {
  email: string
  name: string
  password: string
  role?: Role
  tenantId?: string
  image?: string
}

/**
 * Crear un nuevo usuario
 */
export async function createUser(data: CreateUserInput): Promise<SafeUser> {
  const hashedPassword = await hash(data.password, 12)

  return prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      name: data.name,
      password: hashedPassword,
      role: data.role || Role.STUDENT,
      tenantId: data.tenantId,
      image: data.image,
    },
    select: userSelectWithoutPassword,
  })
}

/**
 * Verificar credenciales de usuario
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<SafeUser | null> {
  const user = await getUserByEmailWithPassword(email)

  if (!user || !user.password) {
    return null
  }

  const isValid = await compare(password, user.password)

  if (!isValid) {
    return null
  }

  // Retornar usuario sin password
  const { password: _, ...safeUser } = user
  return safeUser
}

export type UpdateUserInput = {
  name?: string
  image?: string
  role?: Role
  isActive?: boolean
}

/**
 * Actualizar un usuario
 */
export async function updateUser(
  id: string,
  data: UpdateUserInput
): Promise<SafeUser> {
  return prisma.user.update({
    where: { id },
    data,
    select: userSelectWithoutPassword,
  })
}

/**
 * Cambiar contraseña
 */
export async function changePassword(
  id: string,
  newPassword: string
): Promise<void> {
  const hashedPassword = await hash(newPassword, 12)

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  })
}

/**
 * Desactivar usuario (soft delete)
 */
export async function deactivateUser(id: string): Promise<SafeUser> {
  return prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: userSelectWithoutPassword,
  })
}
```

### 4.4 Crear servicio de Cursos (Multi-Tenant)

Crea el archivo `src/services/course.service.ts`:

```typescript
// src/services/course.service.ts
import prisma from '@/lib/prisma'
import { Course, Prisma } from '@prisma/client'

// Tipo para curso con relaciones
export type CourseWithDetails = Prisma.CourseGetPayload<{
  include: {
    owner: { select: { id: true; name: true; image: true } }
    categories: { include: { category: true } }
    modules: {
      include: {
        lessons: { select: { id: true; title: true; isFree: true; isPublished: true } }
      }
    }
    _count: { select: { enrollments: true } }
  }
}>

export type CourseWithBasicInfo = Prisma.CourseGetPayload<{
  include: {
    owner: { select: { id: true; name: true; image: true } }
    _count: { select: { enrollments: true; modules: true } }
  }
}>

// ============================================
// QUERIES (Lectura) - MULTI-TENANT
// ============================================

/**
 * Obtener cursos publicados de un tenant
 *
 * ⚠️ PATRÓN MULTI-TENANT:
 * SIEMPRE incluir tenantId en las queries para aislar datos
 */
export async function getPublishedCourses(
  tenantId: string
): Promise<CourseWithBasicInfo[]> {
  return prisma.course.findMany({
    where: {
      tenantId,        // ← CRÍTICO: Filtrar por tenant
      isPublished: true,
    },
    include: {
      owner: {
        select: { id: true, name: true, image: true }
      },
      _count: {
        select: { enrollments: true, modules: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Obtener todos los cursos de un tenant (para admin)
 */
export async function getAllCourses(
  tenantId: string
): Promise<CourseWithBasicInfo[]> {
  return prisma.course.findMany({
    where: { tenantId },
    include: {
      owner: {
        select: { id: true, name: true, image: true }
      },
      _count: {
        select: { enrollments: true, modules: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Obtener curso por slug dentro de un tenant
 */
export async function getCourseBySlug(
  tenantId: string,
  slug: string
): Promise<CourseWithDetails | null> {
  return prisma.course.findUnique({
    where: {
      tenantId_slug: {  // Índice compuesto
        tenantId,
        slug,
      }
    },
    include: {
      owner: {
        select: { id: true, name: true, image: true }
      },
      categories: {
        include: { category: true }
      },
      modules: {
        orderBy: { position: 'asc' },
        include: {
          lessons: {
            orderBy: { position: 'asc' },
            select: {
              id: true,
              title: true,
              isFree: true,
              isPublished: true
            }
          }
        }
      },
      _count: {
        select: { enrollments: true }
      }
    },
  })
}

/**
 * Obtener cursos de un instructor
 */
export async function getCoursesByInstructor(
  tenantId: string,
  ownerId: string
): Promise<CourseWithBasicInfo[]> {
  return prisma.course.findMany({
    where: {
      tenantId,
      ownerId,
    },
    include: {
      owner: {
        select: { id: true, name: true, image: true }
      },
      _count: {
        select: { enrollments: true, modules: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Buscar cursos por término
 */
export async function searchCourses(
  tenantId: string,
  searchTerm: string
): Promise<CourseWithBasicInfo[]> {
  return prisma.course.findMany({
    where: {
      tenantId,
      isPublished: true,
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    include: {
      owner: {
        select: { id: true, name: true, image: true }
      },
      _count: {
        select: { enrollments: true, modules: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  })
}

// ============================================
// MUTATIONS (Escritura)
// ============================================

export type CreateCourseInput = {
  title: string
  slug: string
  description?: string
  thumbnail?: string
  price?: number
  isFree?: boolean
  tenantId: string
  ownerId: string
  categoryIds?: string[]
}

/**
 * Crear un nuevo curso
 */
export async function createCourse(
  data: CreateCourseInput
): Promise<Course> {
  return prisma.course.create({
    data: {
      title: data.title,
      slug: data.slug.toLowerCase(),
      description: data.description,
      thumbnail: data.thumbnail,
      price: data.price,
      isFree: data.isFree || false,
      tenantId: data.tenantId,
      ownerId: data.ownerId,
      categories: data.categoryIds ? {
        create: data.categoryIds.map(categoryId => ({
          categoryId,
        }))
      } : undefined,
    },
  })
}

export type UpdateCourseInput = {
  title?: string
  slug?: string
  description?: string
  thumbnail?: string
  price?: number
  isFree?: boolean
  isPublished?: boolean
}

/**
 * Actualizar un curso
 */
export async function updateCourse(
  id: string,
  data: UpdateCourseInput
): Promise<Course> {
  return prisma.course.update({
    where: { id },
    data,
  })
}

/**
 * Publicar/Despublicar un curso
 */
export async function toggleCoursePublish(
  id: string,
  isPublished: boolean
): Promise<Course> {
  return prisma.course.update({
    where: { id },
    data: { isPublished },
  })
}

/**
 * Eliminar un curso
 */
export async function deleteCourse(id: string): Promise<Course> {
  return prisma.course.delete({
    where: { id },
  })
}
```

### 4.5 Crear índice de servicios

Crea el archivo `src/services/index.ts`:

```typescript
// src/services/index.ts

// Exportar todos los servicios
export * from './tenant.service'
export * from './user.service'
export * from './course.service'
```

---

## Paso 5: Probar los Servicios

### 5.1 Actualizar la página de prueba

Actualiza `src/app/test-db/page.tsx`:

```typescript
// src/app/test-db/page.tsx
import {
  getAllTenants,
  getUsersByTenant,
  getPublishedCourses
} from '@/services'

export default async function TestDBPage() {
  // Obtener todos los tenants
  const tenants = await getAllTenants()

  // Obtener el primer tenant para pruebas
  const firstTenant = tenants[0]

  // Obtener usuarios y cursos del primer tenant
  const users = firstTenant
    ? await getUsersByTenant(firstTenant.id)
    : []
  const courses = firstTenant
    ? await getPublishedCourses(firstTenant.id)
    : []

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Test de Servicios de Base de Datos
      </h1>

      {/* Tenants */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          🏢 Tenants ({tenants.length})
        </h2>
        <div className="grid gap-4">
          {tenants.map(tenant => (
            <div
              key={tenant.id}
              className="p-4 border rounded-lg bg-gray-50"
            >
              <h3 className="font-medium">{tenant.name}</h3>
              <p className="text-sm text-gray-600">
                Slug: {tenant.slug} | Plan: {tenant.plan}
              </p>
              <p className="text-sm text-gray-600">
                👥 {tenant._count.users} usuarios |
                📚 {tenant._count.courses} cursos
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Usuarios del primer tenant */}
      {firstTenant && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            👥 Usuarios de {firstTenant.name} ({users.length})
          </h2>
          <div className="grid gap-2">
            {users.map(user => (
              <div
                key={user.id}
                className="p-3 border rounded flex justify-between"
              >
                <span>{user.name} ({user.email})</span>
                <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cursos del primer tenant */}
      {firstTenant && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            📚 Cursos publicados de {firstTenant.name} ({courses.length})
          </h2>
          <div className="grid gap-4">
            {courses.map(course => (
              <div
                key={course.id}
                className="p-4 border rounded-lg"
              >
                <h3 className="font-medium">{course.title}</h3>
                <p className="text-sm text-gray-600">
                  Por: {course.owner.name}
                </p>
                <p className="text-sm text-gray-600">
                  {course._count.modules} módulos |
                  {course._count.enrollments} inscritos |
                  {course.isFree ? ' Gratis' : ` $${course.price}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
```

### 5.2 Verificar en el navegador

```bash
npm run dev
```

Visita http://localhost:3000/test-db

Deberías ver:
- Lista de tenants con conteo de usuarios y cursos
- Usuarios del primer tenant con sus roles
- Cursos publicados con información del instructor

---

## Paso 6: Comandos Útiles de Prisma

### 6.1 Referencia rápida

```bash
# ═══════════════════════════════════════════
# PRISMA - COMANDOS ESENCIALES
# ═══════════════════════════════════════════

# --- MIGRACIONES ---
npx prisma migrate dev              # Crear migración en desarrollo
npx prisma migrate dev --name xxx   # Crear migración con nombre
npx prisma migrate reset            # Resetear BD y re-ejecutar migraciones
npx prisma migrate deploy           # Aplicar migraciones en producción

# --- CLIENTE ---
npx prisma generate                 # Regenerar cliente después de cambios

# --- BASE DE DATOS ---
npx prisma db push                  # Sincronizar schema sin migración
npx prisma db pull                  # Generar schema desde BD existente
npx prisma db seed                  # Ejecutar seeder

# --- HERRAMIENTAS ---
npx prisma studio                   # GUI para explorar datos
npx prisma format                   # Formatear schema.prisma
npx prisma validate                 # Validar schema

# --- INTROSPECCIÓN ---
npx prisma db pull                  # Generar schema desde BD
```

### 6.2 Flujo de trabajo recomendado

```
┌─────────────────────────────────────────────────────────────┐
│ FLUJO DE CAMBIOS EN BASE DE DATOS                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Editar prisma/schema.prisma                            │
│              │                                              │
│              ▼                                              │
│  2. npx prisma migrate dev --name descripcion              │
│              │                                              │
│              ▼                                              │
│  3. Prisma genera migración SQL automáticamente            │
│              │                                              │
│              ▼                                              │
│  4. npx prisma generate (se ejecuta automáticamente)       │
│              │                                              │
│              ▼                                              │
│  5. Cliente actualizado con nuevos tipos                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Resumen de la Sesión 1.2

### ✅ Lo que aprendimos:

1. **Diagrama ER** - Entender las relaciones de la base de datos
2. **Multi-tenancy** - Patrón de columna tenant_id
3. **Seeders** - Poblar la BD con datos de prueba realistas
4. **Prisma Studio** - GUI para explorar y editar datos
5. **Servicios** - Capa de abstracción para queries
6. **Patrones Multi-Tenant** - SIEMPRE filtrar por tenantId

### ✅ Tareas completadas:

- [x] Diseñar esquema de base de datos multi-tenant
- [x] Configurar Prisma ORM
- [x] Crear modelos: Tenant, User, Role, Course, Module, Lesson
- [x] Ejecutar migraciones iniciales
- [x] Crear seeders para datos de prueba

### ✅ Archivos creados:

```
prisma/
└── seed.ts                    # Seeder con datos de prueba

src/services/
├── index.ts                   # Exportaciones
├── tenant.service.ts          # Servicio de tenants
├── user.service.ts            # Servicio de usuarios
└── course.service.ts          # Servicio de cursos

src/app/test-db/
└── page.tsx                   # Página de prueba actualizada
```

### 📝 Patrón Multi-Tenant Crítico:

```typescript
// ⚠️ SIEMPRE incluir tenantId en queries
const courses = await prisma.course.findMany({
  where: {
    tenantId,  // ← NUNCA olvidar esto
    isPublished: true,
  },
})
```

### 🔐 Credenciales de prueba:

| Email | Password | Rol | Tenant |
|-------|----------|-----|--------|
| superadmin@nextlms.com | password123 | SUPER_ADMIN | - |
| admin@acme.com | password123 | ADMIN | ACME |
| instructor@acme.com | password123 | INSTRUCTOR | ACME |
| maria@student.com | password123 | STUDENT | ACME |
| juan@student.com | password123 | STUDENT | ACME |

---

## Próxima Sesión: 1.3 - Sistema de Autenticación

En la siguiente sesión:
- Implementar NextAuth.js v5
- Configurar providers (credentials, Google, GitHub)
- Crear páginas de login/register
- Middleware de protección de rutas
- Sistema de roles y permisos (RBAC)

---

**Estado de la Sesión 1.2:** ✅ Completada