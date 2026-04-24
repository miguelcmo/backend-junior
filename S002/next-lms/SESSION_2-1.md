# SESIÓN 2.1 - Landing Page Principal

**Objetivo:** Crear una landing page profesional y atractiva para el LMS, incluyendo header, hero section, características, testimonios, footer y componentes reutilizables siguiendo el estilo de TailAdmin UI.

**Duración estimada:** 3-4 horas

**Requisitos previos:**
- Fase 1 completada (Sesiones 1.1, 1.2, 1.3)
- Servidor de desarrollo funcionando

---

## Visión General de la Landing Page

### Estructura de la Página

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              HEADER                                      │
│  Logo    [Características] [Precios] [Blog]        [Login] [Comenzar]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                           HERO SECTION                                   │
│                                                                          │
│         "Transforma tu conocimiento en cursos exitosos"                 │
│         [Comenzar gratis]  [Ver demo]                                   │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    LOGOS DE EMPRESAS (Social Proof)                      │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                         CARACTERÍSTICAS                                  │
│    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐            │
│    │  Card   │    │  Card   │    │  Card   │    │  Card   │            │
│    │Feature 1│    │Feature 2│    │Feature 3│    │Feature 4│            │
│    └─────────┘    └─────────┘    └─────────┘    └─────────┘            │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    SECCIÓN "CÓMO FUNCIONA"                              │
│              Step 1 → Step 2 → Step 3 → Step 4                          │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                         TESTIMONIOS                                      │
│         ┌──────────┐  ┌──────────┐  ┌──────────┐                        │
│         │Testimonio│  │Testimonio│  │Testimonio│                        │
│         └──────────┘  └──────────┘  └──────────┘                        │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                             CTA FINAL                                    │
│           "¿Listo para comenzar?" [Crear cuenta gratis]                 │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                              FOOTER                                      │
│  Logo    Producto | Recursos | Empresa | Legal      [Redes Sociales]   │
│          Links      Links      Links     Links                          │
│                    © 2024 Next LMS                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Paso 1: Actualizar Estilos Globales

### 1.1 Actualizar globals.css con paleta de colores

Actualiza el archivo `src/app/globals.css`:

```css
/* src/app/globals.css */
@import "tailwindcss";

:root {
  /* Colores base */
  --background: #ffffff;
  --foreground: #1c2434;

  /* Colores primarios (Azul - estilo TailAdmin) */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;

  /* Colores secundarios */
  --secondary-50: #f8fafc;
  --secondary-100: #f1f5f9;
  --secondary-200: #e2e8f0;
  --secondary-300: #cbd5e1;
  --secondary-400: #94a3b8;
  --secondary-500: #64748b;
  --secondary-600: #475569;
  --secondary-700: #334155;
  --secondary-800: #1e293b;
  --secondary-900: #0f172a;

  /* Colores de estado */
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #3b82f6;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary-600);
  --color-primary-foreground: #ffffff;
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

/* Estilos base */
body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), system-ui, sans-serif;
}

/* Transiciones suaves */
* {
  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--secondary-100);
}

::-webkit-scrollbar-thumb {
  background: var(--secondary-300);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-400);
}

/* Focus visible mejorado */
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

---

## Paso 2: Crear/Actualizar Componentes UI Base

### 2.1 Componente Button (actualizado)

Crea o actualiza el archivo `src/components/ui/button.tsx`:

```typescript
// src/components/ui/button.tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center font-medium rounded-lg
      transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98]
    `

    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md',
      secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm',
      outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
      ghost: 'text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
      xl: 'px-8 py-4 text-lg gap-3',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
```

### 2.2 Componente Container

Crea el archivo `src/components/ui/container.tsx`:

```typescript
// src/components/ui/container.tsx
import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const sizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
}

export function Container({
  className,
  size = 'xl',
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizes[size], className)}
      {...props}
    />
  )
}
```

### 2.3 Componente Badge

Crea el archivo `src/components/ui/badge.tsx`:

```typescript
// src/components/ui/badge.tsx
import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-secondary-100 text-secondary-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}
```

### 2.4 Actualizar índice de componentes UI

Actualiza `src/components/ui/index.ts`:

```typescript
// src/components/ui/index.ts
export { Button } from './button'
export { Input } from './input'
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
export { Container } from './container'
export { Badge } from './badge'
```

---

## Paso 3: Crear Componentes de Landing

### 3.1 Componente Header/Navbar

Crea el archivo `src/components/landing/header.tsx`:

```typescript
// src/components/landing/header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Container, Button } from '@/components/ui'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Características', href: '#features' },
  { name: 'Cómo funciona', href: '#how-it-works' },
  { name: 'Testimonios', href: '#testimonials' },
  { name: 'Precios', href: '/pricing' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <Container>
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-bold text-xl text-secondary-900">
              Next LMS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="md">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="primary" size="md">
                Comenzar gratis
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-secondary-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-secondary-200">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-secondary-200">
                <Link href="/auth/login">
                  <Button variant="outline" size="md" className="w-full">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="md" className="w-full">
                    Comenzar gratis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
```

### 3.2 Componente Hero Section

Crea el archivo `src/components/landing/hero.tsx`:

```typescript
// src/components/landing/hero.tsx
import Link from 'next/link'
import { Container, Button, Badge } from '@/components/ui'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <Container>
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="primary" size="lg" className="mb-6">
            Nuevo: Integración con IA para crear contenido
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 leading-tight mb-6">
            Transforma tu conocimiento en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              cursos exitosos
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-secondary-600 mb-10 max-w-2xl mx-auto">
            Crea, vende y gestiona tus cursos online con la plataforma LMS más
            completa. Sin conocimientos técnicos, con todas las herramientas que
            necesitas para triunfar.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/register">
              <Button size="xl" variant="primary" className="w-full sm:w-auto">
                Comenzar gratis
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Ver demo
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-secondary-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>14 días de prueba gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Cancela cuando quieras</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Preview */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
          <div className="relative mx-auto max-w-5xl">
            <div className="bg-secondary-900 rounded-t-xl p-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>
            <div className="bg-secondary-100 rounded-b-xl aspect-video flex items-center justify-center border border-secondary-200">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-secondary-600">
                  Vista previa del dashboard - Imagen/Video próximamente
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
```

### 3.3 Componente Logos (Social Proof)

Crea el archivo `src/components/landing/logos.tsx`:

```typescript
// src/components/landing/logos.tsx
import { Container } from '@/components/ui'

const companies = [
  { name: 'Empresa 1', logo: '/logos/company1.svg' },
  { name: 'Empresa 2', logo: '/logos/company2.svg' },
  { name: 'Empresa 3', logo: '/logos/company3.svg' },
  { name: 'Empresa 4', logo: '/logos/company4.svg' },
  { name: 'Empresa 5', logo: '/logos/company5.svg' },
]

export function Logos() {
  return (
    <section className="py-12 bg-secondary-50 border-y border-secondary-100">
      <Container>
        <p className="text-center text-sm font-medium text-secondary-500 mb-8">
          Más de 1,000 empresas confían en nosotros
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {companies.map((company) => (
            <div
              key={company.name}
              className="h-8 w-32 bg-secondary-200 rounded flex items-center justify-center text-secondary-400 text-xs"
            >
              {company.name}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
```

### 3.4 Componente Features

Crea el archivo `src/components/landing/features.tsx`:

```typescript
// src/components/landing/features.tsx
import { Container, Card, CardContent } from '@/components/ui'

const features = [
  {
    title: 'Creador de cursos intuitivo',
    description:
      'Arrastra y suelta para crear módulos, lecciones y evaluaciones sin necesidad de código.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    color: 'bg-blue-500',
  },
  {
    title: 'Multi-tenant nativo',
    description:
      'Cada organización tiene su propio espacio aislado con branding personalizable.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: 'bg-purple-500',
  },
  {
    title: 'Pagos con Mercado Pago',
    description:
      'Vende tus cursos y recibe pagos de forma segura con integración nativa de Mercado Pago.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    color: 'bg-green-500',
  },
  {
    title: 'Asistente IA con Groq',
    description:
      'Genera contenido, resúmenes y evaluaciones automáticamente con inteligencia artificial.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: 'bg-yellow-500',
  },
  {
    title: 'Análisis y reportes',
    description:
      'Dashboard completo con métricas de progreso, engagement y ventas en tiempo real.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'bg-red-500',
  },
  {
    title: 'Certificados automáticos',
    description:
      'Genera y envía certificados personalizados cuando los estudiantes completan un curso.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    color: 'bg-indigo-500',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            Características
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mt-3 mb-4">
            Todo lo que necesitas para crear cursos increíbles
          </h2>
          <p className="text-lg text-secondary-600">
            Herramientas poderosas y fáciles de usar para crear, gestionar y
            monetizar tu contenido educativo.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-shadow duration-300 border-secondary-100"
            >
              <CardContent className="p-6">
                <div
                  className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
```

### 3.5 Componente How It Works

Crea el archivo `src/components/landing/how-it-works.tsx`:

```typescript
// src/components/landing/how-it-works.tsx
import { Container } from '@/components/ui'

const steps = [
  {
    number: '01',
    title: 'Crea tu cuenta',
    description: 'Regístrate gratis en menos de 2 minutos y configura tu espacio de trabajo.',
  },
  {
    number: '02',
    title: 'Diseña tu curso',
    description: 'Usa nuestro editor intuitivo para crear módulos, lecciones y evaluaciones.',
  },
  {
    number: '03',
    title: 'Configura pagos',
    description: 'Conecta Mercado Pago y define el precio de tu curso o déjalo gratuito.',
  },
  {
    number: '04',
    title: 'Publica y vende',
    description: 'Comparte tu curso con el mundo y empieza a generar ingresos.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-secondary-50">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            Cómo funciona
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mt-3 mb-4">
            De idea a curso publicado en 4 simples pasos
          </h2>
          <p className="text-lg text-secondary-600">
            Nuestra plataforma está diseñada para que puedas enfocarte en lo que
            mejor sabes hacer: enseñar.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-secondary-200 -z-10" />
              )}

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-600 text-white text-xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-secondary-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
```

### 3.6 Componente Testimonials

Crea el archivo `src/components/landing/testimonials.tsx`:

```typescript
// src/components/landing/testimonials.tsx
import { Container, Card, CardContent } from '@/components/ui'

const testimonials = [
  {
    quote:
      'Next LMS me permitió lanzar mi academia online en tiempo récord. La facilidad de uso y las integraciones son increíbles.',
    author: 'María González',
    role: 'CEO, Academia Digital',
    avatar: 'MG',
    rating: 5,
  },
  {
    quote:
      'La integración con Mercado Pago fue perfecta. Ahora puedo vender mis cursos sin complicaciones y recibir pagos al instante.',
    author: 'Carlos Rodríguez',
    role: 'Instructor de Marketing',
    avatar: 'CR',
    rating: 5,
  },
  {
    quote:
      'El asistente de IA me ahorra horas de trabajo generando contenido y evaluaciones. Es como tener un asistente personal.',
    author: 'Ana Martínez',
    role: 'Creadora de contenido',
    avatar: 'AM',
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-32">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            Testimonios
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mt-3 mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-lg text-secondary-600">
            Miles de creadores ya están transformando su conocimiento en cursos
            exitosos con Next LMS.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-secondary-100">
              <CardContent className="p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-secondary-700 mb-6">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-secondary-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-secondary-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
```

### 3.7 Componente CTA Section

Crea el archivo `src/components/landing/cta.tsx`:

```typescript
// src/components/landing/cta.tsx
import Link from 'next/link'
import { Container, Button } from '@/components/ui'

export function CTA() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-primary-600 to-primary-800">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Listo para crear tu primer curso?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Únete a miles de creadores que ya están monetizando su conocimiento.
            Comienza gratis hoy, sin tarjeta de crédito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="xl"
                className="w-full sm:w-auto bg-white text-primary-700 hover:bg-primary-50"
              >
                Comenzar gratis
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="xl"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10"
              >
                Contactar ventas
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
```

### 3.8 Componente Footer

Crea el archivo `src/components/landing/footer.tsx`:

```typescript
// src/components/landing/footer.tsx
import Link from 'next/link'
import { Container } from '@/components/ui'

const footerLinks = {
  producto: [
    { name: 'Características', href: '#features' },
    { name: 'Precios', href: '/pricing' },
    { name: 'Integraciones', href: '/integrations' },
    { name: 'Changelog', href: '/changelog' },
  ],
  recursos: [
    { name: 'Documentación', href: '/docs' },
    { name: 'Blog', href: '/blog' },
    { name: 'Tutoriales', href: '/tutorials' },
    { name: 'API', href: '/api-docs' },
  ],
  empresa: [
    { name: 'Sobre nosotros', href: '/about' },
    { name: 'Contacto', href: '/contact' },
    { name: 'Carreras', href: '/careers' },
    { name: 'Partners', href: '/partners' },
  ],
  legal: [
    { name: 'Privacidad', href: '/privacy' },
    { name: 'Términos', href: '/terms' },
    { name: 'Cookies', href: '/cookies' },
  ],
}

const socialLinks = [
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="bg-secondary-900 text-secondary-300">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="font-bold text-xl text-white">Next LMS</span>
              </Link>
              <p className="text-sm mb-6 max-w-xs">
                La plataforma LMS más completa para crear, vender y gestionar
                cursos online.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-400 hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Producto</h3>
              <ul className="space-y-3">
                {footerLinks.producto.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Recursos</h3>
              <ul className="space-y-3">
                {footerLinks.recursos.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Empresa</h3>
              <ul className="space-y-3">
                {footerLinks.empresa.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-secondary-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © {new Date().getFullYear()} Next LMS. Todos los derechos
              reservados.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span>Hecho con</span>
              <svg
                className="w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span>en Latinoamérica</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
```

### 3.9 Crear índice de componentes de landing

Crea el archivo `src/components/landing/index.ts`:

```typescript
// src/components/landing/index.ts
export { Header } from './header'
export { Hero } from './hero'
export { Logos } from './logos'
export { Features } from './features'
export { HowItWorks } from './how-it-works'
export { Testimonials } from './testimonials'
export { CTA } from './cta'
export { Footer } from './footer'
```

---

## Paso 4: Crear la Página de Landing

### 4.1 Actualizar el layout raíz

Actualiza el archivo `src/app/layout.tsx`:

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Next LMS - Plataforma de Cursos Online',
    template: '%s | Next LMS',
  },
  description:
    'Crea, vende y gestiona tus cursos online con la plataforma LMS más completa. Multi-tenant, pagos con Mercado Pago e integración con IA.',
  keywords: [
    'LMS',
    'cursos online',
    'plataforma educativa',
    'e-learning',
    'educación online',
  ],
  authors: [{ name: 'Next LMS Team' }],
  openGraph: {
    type: 'website',
    locale: 'es_LA',
    url: 'https://nextlms.com',
    siteName: 'Next LMS',
    title: 'Next LMS - Plataforma de Cursos Online',
    description:
      'Crea, vende y gestiona tus cursos online con la plataforma LMS más completa.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next LMS - Plataforma de Cursos Online',
    description:
      'Crea, vende y gestiona tus cursos online con la plataforma LMS más completa.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
```

### 4.2 Crear la página principal

Actualiza el archivo `src/app/page.tsx`:

```typescript
// src/app/page.tsx
import {
  Header,
  Hero,
  Logos,
  Features,
  HowItWorks,
  Testimonials,
  CTA,
  Footer,
} from '@/components/landing'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Logos />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
```

---

## Paso 5: Agregar Animaciones CSS

### 5.1 Agregar animaciones al globals.css

Agrega estas animaciones al final de `src/app/globals.css`:

```css
/* Agregar al final de globals.css */

/* Animación de blob */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Animación de fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Animación de slide in */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out forwards;
}

/* Hover effects */
.hover-lift {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-400));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Paso 6: Verificar Todo

### 6.1 Estructura final de archivos nuevos

```
src/
├── app/
│   ├── globals.css              ✅ Actualizado con colores y animaciones
│   ├── layout.tsx               ✅ Actualizado con metadata
│   └── page.tsx                 ✅ Landing page completa
├── components/
│   ├── ui/
│   │   ├── button.tsx           ✅ Actualizado con más variantes
│   │   ├── container.tsx        ✅ Nuevo
│   │   ├── badge.tsx            ✅ Nuevo
│   │   └── index.ts             ✅ Actualizado
│   └── landing/
│       ├── header.tsx           ✅ Nuevo
│       ├── hero.tsx             ✅ Nuevo
│       ├── logos.tsx            ✅ Nuevo
│       ├── features.tsx         ✅ Nuevo
│       ├── how-it-works.tsx     ✅ Nuevo
│       ├── testimonials.tsx     ✅ Nuevo
│       ├── cta.tsx              ✅ Nuevo
│       ├── footer.tsx           ✅ Nuevo
│       └── index.ts             ✅ Nuevo
```

### 6.2 Probar la landing page

```bash
# Asegurarte de que el servidor está corriendo
npm run dev
```

Visita http://localhost:3000 y verifica:

- [ ] Header con navegación y CTAs
- [ ] Hero section con gradientes animados
- [ ] Sección de logos
- [ ] Grid de características
- [ ] Sección "Cómo funciona" con pasos
- [ ] Testimonios con cards
- [ ] CTA final con gradiente
- [ ] Footer con links y redes sociales
- [ ] Responsive en móvil
- [ ] Scroll suave al hacer click en links de navegación

### 6.3 Verificar navegación

- [ ] Click en "Iniciar sesión" → `/auth/login`
- [ ] Click en "Comenzar gratis" → `/auth/register`
- [ ] Click en links de navegación → Scroll a secciones

---

## Resumen de la Sesión 2.1

### ✅ Lo que aprendimos:

1. **Diseño de Landing Pages** - Estructura y flujo de conversión
2. **Componentes Reutilizables** - Container, Badge, Button mejorado
3. **Animaciones CSS** - Blobs, fade-in, hover effects
4. **Navegación Responsive** - Header con menú móvil
5. **SEO Básico** - Metadata en layout
6. **Tailwind CSS v4** - Uso de variables CSS con @theme

### ✅ Tareas completadas:

- [x] Crear layout de landing (header, footer, navigation)
- [x] Hero section con CTA
- [x] Sección de características del LMS
- [x] Sección de testimonios
- [x] Componentes reutilizables adicionales (Container, Badge)

### ✅ Componentes creados:

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| Header | `components/landing/header.tsx` | Navbar con scroll effect |
| Hero | `components/landing/hero.tsx` | Sección principal con CTAs |
| Logos | `components/landing/logos.tsx` | Social proof |
| Features | `components/landing/features.tsx` | Grid de características |
| HowItWorks | `components/landing/how-it-works.tsx` | Pasos del proceso |
| Testimonials | `components/landing/testimonials.tsx` | Reseñas de usuarios |
| CTA | `components/landing/cta.tsx` | Call to action final |
| Footer | `components/landing/footer.tsx` | Pie de página |
| Container | `components/ui/container.tsx` | Contenedor responsive |
| Badge | `components/ui/badge.tsx` | Etiquetas/badges |

### 📝 Paleta de colores establecida:

```css
--primary-600: #2563eb    /* Azul principal */
--secondary-900: #0f172a  /* Texto oscuro */
--secondary-600: #475569  /* Texto secundario */
--success: #10b981        /* Verde */
--warning: #f59e0b        /* Amarillo */
--danger: #ef4444         /* Rojo */
```

---

## Próxima Sesión: 2.2 - Planes y Precios

En la siguiente sesión:
- Diseñar página de pricing
- Crear componente de tarjetas de planes
- Implementar comparador de features
- Preparar integración con Mercado Pago

---

**Estado de la Sesión 2.1:** ✅ Completada
