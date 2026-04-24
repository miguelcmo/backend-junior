# AGENTS.md

Instructions for agents:
@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Version Notice

This project uses **Next.js 16**, which has breaking changes from earlier versions. APIs, conventions, and file structure may differ from what you know. Before writing any code, consult the relevant documentation in `node_modules/next/dist/docs/` and heed deprecation notices.

## Next.js 16 Breaking Changes to Remember

- **Proxy instead of Middleware**: The file is now `src/proxy.ts` NOT `middleware.ts`
- **React 19 hooks**: Use `useActionState` instead of `useFormState`
- **Server Actions**: Use `'use server'` directive, works with forms natively
- **Async cookies**: `cookies()` returns a Promise, must use `await cookies()`

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint

# Database commands
docker-compose up -d          # Start PostgreSQL + Adminer
docker-compose down           # Stop containers
npx prisma migrate dev        # Create migration
npx prisma db seed            # Run seeders
npx prisma studio             # Database GUI (http://localhost:5555)
npx prisma generate           # Regenerate Prisma Client
```

## Architecture

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **UI**: React 19 with Tailwind CSS v4
- **Database**: PostgreSQL 16 (Docker) + Prisma ORM 7
- **Auth**: NextAuth.js v5 (beta) with JWT sessions
- **Validation**: Zod v4
- **Styling**: Tailwind via PostCSS (`@tailwindcss/postcss`), Geist font family
- **Linting**: ESLint 9 flat config with `eslint-config-next` (core-web-vitals + typescript)

## Project Structure

```
src/
├── app/                      # App Router pages and layouts
│   ├── layout.tsx            # Root layout with Geist fonts
│   ├── globals.css           # Global styles + Tailwind
│   ├── actions/              # Server Actions
│   │   └── auth.ts           # Login, register, logout actions
│   ├── api/
│   │   └── auth/[...nextauth]/ # NextAuth API route
│   ├── auth/                 # Auth pages (login, register, error)
│   ├── dashboard/            # Protected dashboard
│   └── unauthorized/         # Access denied page
├── components/
│   ├── ui/                   # Base UI components (Button, Input, Card)
│   └── auth/                 # Auth components (RoleGate, AuthCheck)
├── lib/
│   ├── auth.ts               # NextAuth.js configuration
│   ├── auth-utils.ts         # RBAC utilities (hasRole, requireAuth, etc.)
│   ├── prisma.ts             # Prisma client singleton
│   ├── utils.ts              # cn() helper for Tailwind
│   └── validations/          # Zod schemas
├── services/                 # Data access layer
│   └── user.service.ts       # User CRUD operations
├── config/                   # App configuration
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript type definitions
└── proxy.ts                  # Route protection (middleware)

prisma/
├── schema.prisma             # Database schema (multi-tenant)
└── seed.ts                   # Database seeders
```

## Path Alias

`@/*` maps to `src/` (configured in `tsconfig.json`).

## Authentication

- **Provider**: NextAuth.js v5 with credentials (OAuth ready but disabled)
- **Session Strategy**: JWT stored in httpOnly cookie
- **Session includes**: `id`, `email`, `name`, `image`, `role`, `tenantId`

### Test Credentials

| Email | Password | Role |
|-------|----------|------|
| superadmin@nextlms.com | password123 | SUPER_ADMIN |
| admin@acme.com | password123 | ADMIN |
| instructor@acme.com | password123 | INSTRUCTOR |
| maria@student.com | password123 | STUDENT |

### Auth Utilities

```typescript
// In Server Components or Server Actions:
import { auth } from '@/lib/auth'
import { requireAuth, requireRole, hasRole } from '@/lib/auth-utils'

// Get current session
const session = await auth()

// Require authentication (redirects if not logged in)
const session = await requireAuth()

// Require specific roles
const session = await requireRole(['ADMIN', 'SUPER_ADMIN'])

// Check role without redirect
const isAdmin = await hasRole(['ADMIN'])
```

### Protected Routes (Proxy)

Routes are protected in `src/proxy.ts`. To add protection:
- Add to `protectedRoutes` array for auth-required routes
- Add to `roleRoutes` object for role-specific routes

## Multi-Tenant Pattern

All tenant-scoped queries MUST include `tenantId`:

```typescript
// CORRECT
const courses = await prisma.course.findMany({
  where: { tenantId, isPublished: true }
})

// WRONG - leaks data across tenants!
const courses = await prisma.course.findMany({
  where: { isPublished: true }
})
```

## Roles Hierarchy

```
SUPER_ADMIN (4) > ADMIN (3) > INSTRUCTOR (2) > STUDENT (1)
```

- **SUPER_ADMIN**: Platform admin, access to all tenants
- **ADMIN**: Tenant admin, manages their organization
- **INSTRUCTOR**: Creates and manages courses
- **STUDENT**: Enrolls in and consumes courses

## Tutorial Sessions

Session files are in the root: `SESSION_1-1.md`, `SESSION_1-2.md`, `SESSION_1-3.md`, etc.


# Step by step tutorial of an LMS calle NEXT-LMS

The LMS must implemnet the following features:
* Landing page with the info of the LMS, characteristics, plans and pricing, resgiter and login to lms admin app and a sandbox to test the mercado pago payments API
* LMS admin panel where people can create their a own courses
* multi-tenant from beginning
* postgres database thinking in migration or deploying in the future after local dev to supabase
* user app where people can enter to make the course
* the admin panel and the end user app must be the same but whith diferent options depending on the user (student/trainee or company/user creator/teacher)
* create the backend and API apps for further mobile app development
* create an MVP, usefull but beautiful folowing the styles of TailAdmin UI

## key features to implement

* SAAS MultiTenant
* Mercado Pago as a payment gateway
* Geolocalization
* AI with Groq 

## Instructions to develop the app->course

Give me the step by step to develop this app in multiple sessions the idea is to go developing the application and at the same time going to teaching the proccess to my botcampers, so I need the detailed code, instruction, structure of the app, file path, and other things that you consider usefull to develop this project, I need that this projects will be not only a learning project I need that in the near future it will be the base to launch this service by myself.

# Tutorial starts here!

## Plan de Trabajo - NEXT-LMS

### Fase 1: Fundamentos y Configuración Base ✅ COMPLETADA
**Sesión 1.1 - Setup del Proyecto** ✅
- [x] Verificar estructura inicial de Next.js 16
- [x] Configurar variables de entorno (.env.local)
- [x] Instalar dependencias base (Prisma, next-auth, etc.)
- [x] Configurar PostgreSQL local con Docker
- [x] Crear estructura de carpetas del proyecto
- **Archivo**: `SESSION_1-1.md`

**Sesión 1.2 - Base de Datos y Modelos** ✅
- [x] Diseñar esquema de base de datos multi-tenant
- [x] Configurar Prisma ORM
- [x] Crear modelos: Tenant, User, Role, Course, Module, Lesson
- [x] Ejecutar migraciones iniciales
- [x] Crear seeders para datos de prueba
- **Archivo**: `SESSION_1-2.md`

**Sesión 1.3 - Sistema de Autenticación** ✅
- [x] Implementar NextAuth.js v5
- [x] Configurar providers (credentials, Google, GitHub)
- [x] Crear páginas de login/register
- [x] Implementar proxy de protección de rutas (Next.js 16)
- [x] Sistema de roles y permisos (RBAC)
- **Archivo**: `SESSION_1-3.md`

### Fase 2: Landing Page y Marketing ⏳ EN PROGRESO
**Sesión 2.1 - Landing Page Principal** ✅
- [x] Crear layout de landing (header, footer, navigation)
- [x] Hero section con CTA y animaciones
- [x] Sección de características del LMS
- [x] Sección de testimonios
- [x] Componentes reutilizables adicionales (Container, Badge)
- **Archivo**: `SESSION_2-1.md`

**Sesión 2.2 - Planes y Precios** ✅
- [x] Diseñar página de pricing
- [x] Crear componente de tarjetas de planes (BillingToggle, PricingCard)
- [x] Implementar comparador de features (ComparisonTable, FAQSection)
- [x] Preparar integración con Mercado Pago (SDK, tipos, modelos)
- **Archivo**: `SESSION_2-2.md`

**Sesión 2.3 - Registro de Tenants** ← PRÓXIMA SESIÓN
- [ ] Formulario de registro de empresa/organización
- [ ] Validación de subdominio único
- [ ] Proceso de onboarding inicial
- [ ] Email de bienvenida

### Fase 3: Panel de Administración (Admin Dashboard)
**Sesión 3.1 - Layout del Dashboard**
- [ ] Implementar sidebar navigation (estilo TailAdmin)
- [ ] Header con perfil de usuario
- [ ] Sistema de breadcrumbs
- [ ] Responsive design para dashboard

**Sesión 3.2 - Gestión de Cursos**
- [ ] CRUD de cursos
- [ ] Editor de contenido (rich text)
- [ ] Upload de imágenes y thumbnails
- [ ] Organización por categorías

**Sesión 3.3 - Gestión de Módulos y Lecciones**
- [ ] CRUD de módulos dentro de cursos
- [ ] CRUD de lecciones dentro de módulos
- [ ] Drag & drop para reordenar
- [ ] Preview de contenido

**Sesión 3.4 - Gestión de Usuarios**
- [ ] Lista de usuarios del tenant
- [ ] Invitación de usuarios
- [ ] Asignación de roles
- [ ] Gestión de inscripciones a cursos

### Fase 4: Aplicación del Estudiante
**Sesión 4.1 - Dashboard del Estudiante**
- [ ] Vista de cursos inscritos
- [ ] Progreso de cursos
- [ ] Certificados obtenidos
- [ ] Actividad reciente

**Sesión 4.2 - Visor de Cursos**
- [ ] Navegación de módulos/lecciones
- [ ] Marcado de progreso
- [ ] Sistema de notas personales
- [ ] Reproductor de video (si aplica)

**Sesión 4.3 - Evaluaciones y Quizzes**
- [ ] Creación de quizzes (admin)
- [ ] Renderizado de quizzes (estudiante)
- [ ] Calificación automática
- [ ] Retroalimentación

### Fase 5: Pagos con Mercado Pago
**Sesión 5.1 - Integración Básica**
- [ ] Configurar SDK de Mercado Pago
- [ ] Sandbox de pruebas en landing
- [ ] Checkout básico

**Sesión 5.2 - Suscripciones y Pagos Recurrentes**
- [ ] Implementar planes de suscripción
- [ ] Webhooks de Mercado Pago
- [ ] Gestión de estados de pago
- [ ] Facturación básica

### Fase 6: Funcionalidades Avanzadas
**Sesión 6.1 - Multi-tenancy Completo**
- [ ] Subdominios dinámicos
- [ ] Aislamiento de datos por tenant
- [ ] Personalización de branding por tenant
- [ ] Límites por plan

**Sesión 6.2 - Geolocalización**
- [ ] Detección de ubicación del usuario
- [ ] Precios por región
- [ ] Restricciones geográficas de contenido

**Sesión 6.3 - Integración con Groq AI**
- [ ] Configurar API de Groq
- [ ] Asistente de creación de contenido
- [ ] Resúmenes automáticos de lecciones
- [ ] Chatbot de soporte

### Fase 7: API y Backend para Mobile
**Sesión 7.1 - API RESTful**
- [ ] Diseñar endpoints de API
- [ ] Documentación con Swagger/OpenAPI
- [ ] Rate limiting y seguridad
- [ ] Versionado de API

**Sesión 7.2 - Autenticación para Mobile**
- [ ] JWT tokens para mobile
- [ ] Refresh tokens
- [ ] Endpoints específicos para mobile

### Fase 8: Optimización y Deploy
**Sesión 8.1 - Testing**
- [ ] Unit tests con Vitest
- [ ] Integration tests
- [ ] E2E tests con Playwright

**Sesión 8.2 - Optimización**
- [ ] Performance optimization
- [ ] SEO para landing
- [ ] Accesibilidad (a11y)
- [ ] Lazy loading y code splitting

**Sesión 8.3 - Deployment**
- [ ] Configurar Supabase (producción)
- [ ] Deploy en Vercel
- [ ] Configuración de dominios
- [ ] Monitoreo y analytics

---

## Current State Summary

### Existing UI Components (`src/components/ui/`)
- `Button` - With variants (primary, secondary, outline, ghost, danger, success) and sizes (sm, md, lg, xl)
- `Input` - With label and error support
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `Container` - Responsive container with size variants (sm, md, lg, xl, full)
- `Badge` - With variants (default, primary, secondary, success, warning, danger)

### Existing Landing Components (`src/components/landing/`)
- `Header` - Navbar with scroll effect and mobile menu
- `Hero` - Hero section with animated blobs, CTAs, and trust indicators
- `Logos` - Social proof section with company logos
- `Features` - 6-card grid of platform features
- `HowItWorks` - 4-step process section
- `Testimonials` - 3-card testimonial section
- `CTA` - Call-to-action section with gradient background
- `Footer` - Full footer with links and social media

### Existing Pricing Components (`src/components/pricing/`)
- `BillingToggle` - Monthly/yearly toggle switch
- `PricingCard` - Individual plan card with features
- `PricingSection` - Main pricing section with all cards
- `ComparisonTable` - Expandable feature comparison table
- `FAQSection` - Accordion FAQ section

### Existing Auth Components (`src/components/auth/`)
- `RoleGate` - Show content only to specific roles
- `AuthCheck` - Show content only to authenticated users

### Existing Services (`src/services/`)
- `user.service.ts` - User CRUD, verifyCredentials, changePassword

### Existing Pages
- `/` - Landing page (Hero, Features, Testimonials, CTA, Footer)
- `/pricing` - Pricing page with plans, comparison table, FAQ
- `/checkout` - Checkout placeholder (Mercado Pago integration pending)
- `/checkout/success` - Payment success page
- `/checkout/failure` - Payment failure page
- `/checkout/pending` - Payment pending page
- `/auth/login` - Login page with form
- `/auth/register` - Registration page with form
- `/auth/error` - Auth error page
- `/dashboard` - Basic dashboard with user info and stats cards
- `/unauthorized` - Access denied page

### Configuration Files
- `src/config/pricing.ts` - Plans, features, FAQs, Mercado Pago config
- `src/config/site.ts` - Site metadata and info

### Mercado Pago Integration
- `src/lib/mercadopago.ts` - SDK client and helpers
- `src/types/mercadopago.ts` - TypeScript types
- Models: `Subscription`, `Payment` in Prisma schema

### Color Palette (CSS Variables in globals.css)
```css
--primary-600: #2563eb     /* Main blue */
--secondary-900: #0f172a   /* Dark text */
--secondary-600: #475569   /* Secondary text */
--success: #10b981         /* Green */
--warning: #f59e0b         /* Yellow */
--danger: #ef4444          /* Red */
```

### CSS Animations Available
- `.animate-blob` - Floating blob animation
- `.animate-fade-in` - Fade in with translateY
- `.animate-slide-in` - Slide in from left
- `.hover-lift` - Lift effect on hover
- `.gradient-text` - Gradient text effect

### Database Models (Prisma)
- `Tenant` - Organizations (multi-tenant)
- `User` - Users with roles and tenant association
- `Course` - Courses owned by instructors
- `Module` - Course modules
- `Lesson` - Lessons with content types (TEXT, VIDEO, QUIZ)
- `Category` - Course categories
- `Enrollment` - User enrollments in courses
- `LessonProgress` - Progress tracking
- `Account`, `Session`, `VerificationToken` - NextAuth models

### Environment Variables Required
```env
# Database
DATABASE_URL          # PostgreSQL connection string

# Auth
AUTH_SECRET           # NextAuth secret (openssl rand -base64 32)
AUTH_URL              # App URL (http://localhost:3000)
AUTH_TRUST_HOST       # true for development
GOOGLE_CLIENT_ID      # Optional: Google OAuth
GOOGLE_CLIENT_SECRET  # Optional: Google OAuth
GITHUB_CLIENT_ID      # Optional: GitHub OAuth
GITHUB_CLIENT_SECRET  # Optional: GitHub OAuth

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN    # API access token
MERCADOPAGO_PUBLIC_KEY      # Public key for frontend
MERCADOPAGO_WEBHOOK_SECRET  # Webhook validation
MP_PLAN_STARTER_MONTHLY     # Subscription plan IDs
MP_PLAN_STARTER_YEARLY
MP_PLAN_PRO_MONTHLY
MP_PLAN_PRO_YEARLY
NEXT_PUBLIC_APP_URL         # Public app URL for callbacks
```