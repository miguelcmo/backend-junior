# AGENTS.md

Instructions for agents:
@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Version Notice

This project uses **Next.js 16**, which has breaking changes from earlier versions. APIs, conventions, and file structure may differ from what you know. Before writing any code, consult the relevant documentation in `node_modules/next/dist/docs/` and heed deprecation notices.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **UI**: React 19 with Tailwind CSS v4
- **Styling**: Tailwind via PostCSS (`@tailwindcss/postcss`), Geist font family
- **Linting**: ESLint 9 flat config with `eslint-config-next` (core-web-vitals + typescript)

## Project Structure

- `app/` - App Router pages and layouts (React Server Components by default)
- `app/layout.tsx` - Root layout with Geist font configuration
- `app/globals.css` - Global styles and Tailwind imports
- `public/` - Static assets

## Path Alias

`@/*` maps to the project root (configured in `tsconfig.json`).


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

### Fase 1: Fundamentos y Configuración Base
**Sesión 1.1 - Setup del Proyecto**
- [ ] Verificar estructura inicial de Next.js 16
- [ ] Configurar variables de entorno (.env.local)
- [ ] Instalar dependencias base (Prisma, next-auth, etc.)
- [ ] Configurar PostgreSQL local con Docker
- [ ] Crear estructura de carpetas del proyecto

**Sesión 1.2 - Base de Datos y Modelos**
- [ ] Diseñar esquema de base de datos multi-tenant
- [ ] Configurar Prisma ORM
- [ ] Crear modelos: Tenant, User, Role, Course, Module, Lesson
- [ ] Ejecutar migraciones iniciales
- [ ] Crear seeders para datos de prueba

**Sesión 1.3 - Sistema de Autenticación**
- [ ] Implementar NextAuth.js v5
- [ ] Configurar providers (credentials, Google, GitHub)
- [ ] Crear páginas de login/register
- [ ] Implementar middleware de protección de rutas
- [ ] Sistema de roles y permisos (RBAC)

### Fase 2: Landing Page y Marketing
**Sesión 2.1 - Landing Page Principal**
- [ ] Crear layout de landing (header, footer, navigation)
- [ ] Hero section con CTA
- [ ] Sección de características del LMS
- [ ] Sección de testimonios
- [ ] Componentes reutilizables (Button, Card, etc.)

**Sesión 2.2 - Planes y Precios**
- [ ] Diseñar página de pricing
- [ ] Crear componente de tarjetas de planes
- [ ] Implementar comparador de features
- [ ] Preparar integración con Mercado Pago

**Sesión 2.3 - Registro de Tenants**
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