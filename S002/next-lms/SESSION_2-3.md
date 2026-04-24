# SESIÓN 2.3 - Registro de Tenants

**Objetivo:** Crear un flujo completo de registro de organizaciones (tenants) con validación de subdominio único, proceso de onboarding y sistema de emails de bienvenida.

**Duración estimada:** 3-4 horas

**Requisitos previos:**
- Sesiones 2.1 y 2.2 completadas
- Servidor de desarrollo funcionando

---

## Visión General del Flujo de Registro

### Diagrama del Flujo

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FLUJO DE REGISTRO DE TENANT                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   1. LANDING                     2. REGISTRO                            │
│   ┌──────────┐                   ┌──────────────────────┐               │
│   │ "Comenzar│                   │ Paso 1: Datos cuenta │               │
│   │  gratis" │─────────────────▶ │ - Nombre             │               │
│   └──────────┘                   │ - Email              │               │
│                                  │ - Contraseña         │               │
│                                  └──────────┬───────────┘               │
│                                             │                            │
│                                             ▼                            │
│                                  ┌──────────────────────┐               │
│                                  │ Paso 2: Organización │               │
│                                  │ - Nombre empresa     │               │
│                                  │ - Subdominio         │               │
│                                  │ - Tamaño/Industria   │               │
│                                  └──────────┬───────────┘               │
│                                             │                            │
│                                             ▼                            │
│   3. VERIFICACIÓN                4. ONBOARDING                          │
│   ┌──────────────┐               ┌──────────────────────┐               │
│   │ Email enviado│               │ - Seleccionar plan   │               │
│   │ (opcional)   │──────────────▶│ - Configurar perfil  │               │
│   └──────────────┘               │ - Crear primer curso │               │
│                                  └──────────┬───────────┘               │
│                                             │                            │
│                                             ▼                            │
│                                  ┌──────────────────────┐               │
│                                  │     DASHBOARD        │               │
│                                  │   ¡Listo para usar!  │               │
│                                  └──────────────────────┘               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Paso 1: Crear Servicio de Tenant

### 1.1 Crear servicio de tenant

Crea el archivo `src/services/tenant.service.ts`:

```typescript
// src/services/tenant.service.ts
import prisma from '@/lib/prisma'
import { Tenant, Plan, Prisma } from '@prisma/client'

// Selección de campos para tenant
const tenantSelect = {
  id: true,
  name: true,
  slug: true,
  logo: true,
  plan: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TenantSelect

export type SafeTenant = Prisma.TenantGetPayload<{ select: typeof tenantSelect }>

// ============================================
// QUERIES (Lectura)
// ============================================

/**
 * Obtener tenant por ID
 */
export async function getTenantById(id: string): Promise<SafeTenant | null> {
  return prisma.tenant.findUnique({
    where: { id },
    select: tenantSelect,
  })
}

/**
 * Obtener tenant por slug (subdominio)
 */
export async function getTenantBySlug(slug: string): Promise<SafeTenant | null> {
  return prisma.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
    select: tenantSelect,
  })
}

/**
 * Verificar si un slug está disponible
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const normalizedSlug = slug.toLowerCase().trim()

  // Lista de slugs reservados
  const reservedSlugs = [
    'admin', 'api', 'app', 'auth', 'blog', 'cdn', 'checkout',
    'dashboard', 'docs', 'help', 'login', 'mail', 'pricing',
    'register', 'settings', 'signup', 'static', 'status', 'support',
    'www', 'test', 'demo', 'staging', 'dev', 'development',
  ]

  if (reservedSlugs.includes(normalizedSlug)) {
    return false
  }

  const existing = await prisma.tenant.findUnique({
    where: { slug: normalizedSlug },
    select: { id: true },
  })

  return existing === null
}

/**
 * Obtener estadísticas del tenant
 */
export async function getTenantStats(tenantId: string) {
  const [users, courses, enrollments] = await Promise.all([
    prisma.user.count({ where: { tenantId } }),
    prisma.course.count({ where: { tenantId } }),
    prisma.enrollment.count({
      where: { course: { tenantId } },
    }),
  ])

  return { users, courses, enrollments }
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
export async function createTenant(data: CreateTenantInput): Promise<SafeTenant> {
  const normalizedSlug = data.slug.toLowerCase().trim()

  // Verificar disponibilidad del slug
  const isAvailable = await isSlugAvailable(normalizedSlug)
  if (!isAvailable) {
    throw new Error('El subdominio no está disponible')
  }

  return prisma.tenant.create({
    data: {
      name: data.name.trim(),
      slug: normalizedSlug,
      logo: data.logo,
      plan: data.plan || Plan.FREE,
    },
    select: tenantSelect,
  })
}

export type UpdateTenantInput = {
  name?: string
  logo?: string
  plan?: Plan
  isActive?: boolean
}

/**
 * Actualizar un tenant
 */
export async function updateTenant(
  id: string,
  data: UpdateTenantInput
): Promise<SafeTenant> {
  return prisma.tenant.update({
    where: { id },
    data,
    select: tenantSelect,
  })
}

/**
 * Crear tenant con usuario admin
 */
export async function createTenantWithAdmin(
  tenantData: CreateTenantInput,
  userData: {
    name: string
    email: string
    password: string
  }
): Promise<{ tenant: SafeTenant; user: { id: string; email: string } }> {
  const { hash } = await import('bcryptjs')
  const hashedPassword = await hash(userData.password, 12)

  const result = await prisma.$transaction(async (tx) => {
    // 1. Crear tenant
    const tenant = await tx.tenant.create({
      data: {
        name: tenantData.name.trim(),
        slug: tenantData.slug.toLowerCase().trim(),
        logo: tenantData.logo,
        plan: tenantData.plan || Plan.FREE,
      },
      select: tenantSelect,
    })

    // 2. Crear usuario admin del tenant
    const user = await tx.user.create({
      data: {
        email: userData.email.toLowerCase(),
        name: userData.name,
        password: hashedPassword,
        role: 'ADMIN',
        tenantId: tenant.id,
      },
      select: {
        id: true,
        email: true,
      },
    })

    return { tenant, user }
  })

  return result
}

/**
 * Desactivar tenant (soft delete)
 */
export async function deactivateTenant(id: string): Promise<SafeTenant> {
  return prisma.tenant.update({
    where: { id },
    data: { isActive: false },
    select: tenantSelect,
  })
}
```

### 1.2 Actualizar índice de servicios

Actualiza `src/services/index.ts`:

```typescript
// src/services/index.ts
export * from './user.service'
export * from './tenant.service'
```

---

## Paso 2: Crear Esquemas de Validación

### 2.1 Crear esquemas para registro de tenant

Crea el archivo `src/lib/validations/tenant.ts`:

```typescript
// src/lib/validations/tenant.ts
import { z } from 'zod'

// Regex para validar slug (solo letras, números y guiones)
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Paso 1: Datos de la cuenta
export const accountStepSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[a-zA-Z]/, 'La contraseña debe contener al menos una letra')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
})

export type AccountStepInput = z.infer<typeof accountStepSchema>

// Paso 2: Datos de la organización
export const organizationStepSchema = z.object({
  organizationName: z
    .string()
    .min(1, 'El nombre de la organización es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  slug: z
    .string()
    .min(1, 'El subdominio es requerido')
    .min(3, 'El subdominio debe tener al menos 3 caracteres')
    .max(30, 'El subdominio no puede exceder 30 caracteres')
    .regex(slugRegex, 'Solo letras minúsculas, números y guiones')
    .transform((val) => val.toLowerCase()),
  industry: z
    .string()
    .optional(),
  size: z
    .enum(['1-10', '11-50', '51-200', '201-500', '500+'])
    .optional(),
})

export type OrganizationStepInput = z.infer<typeof organizationStepSchema>

// Schema completo de registro
export const tenantRegistrationSchema = accountStepSchema.merge(organizationStepSchema)

export type TenantRegistrationInput = z.infer<typeof tenantRegistrationSchema>

// Estado del formulario multi-paso
export type RegistrationFormState = {
  step: number
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    organizationName?: string[]
    slug?: string[]
    industry?: string[]
    size?: string[]
    _form?: string[]
  }
  success?: boolean
  message?: string
}
```

### 2.2 Actualizar índice de validaciones

Actualiza `src/lib/validations/index.ts`:

```typescript
// src/lib/validations/index.ts
export * from './auth'
export * from './tenant'
```

---

## Paso 3: Crear Server Actions para Registro

### 3.1 Crear acciones de registro de tenant

Crea el archivo `src/app/actions/tenant.ts`:

```typescript
// src/app/actions/tenant.ts
'use server'

import { signIn } from '@/lib/auth'
import {
  createTenantWithAdmin,
  isSlugAvailable
} from '@/services/tenant.service'
import { emailExists } from '@/services/user.service'
import {
  tenantRegistrationSchema,
  RegistrationFormState,
} from '@/lib/validations/tenant'
import { redirect } from 'next/navigation'

/**
 * Verificar disponibilidad del slug (para validación en tiempo real)
 */
export async function checkSlugAvailability(slug: string): Promise<{
  available: boolean
  message?: string
}> {
  if (!slug || slug.length < 3) {
    return { available: false, message: 'Mínimo 3 caracteres' }
  }

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  if (!slugRegex.test(slug.toLowerCase())) {
    return { available: false, message: 'Solo letras, números y guiones' }
  }

  const available = await isSlugAvailable(slug)

  return {
    available,
    message: available ? 'Disponible' : 'Ya está en uso',
  }
}

/**
 * Registrar nuevo tenant con usuario admin
 */
export async function registerTenantAction(
  prevState: RegistrationFormState | undefined,
  formData: FormData
): Promise<RegistrationFormState> {
  // Extraer datos del formulario
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    organizationName: formData.get('organizationName'),
    slug: formData.get('slug'),
    industry: formData.get('industry') || undefined,
    size: formData.get('size') || undefined,
  }

  // Validar campos
  const validatedFields = tenantRegistrationSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      step: prevState?.step || 1,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password, organizationName, slug } = validatedFields.data

  try {
    // Verificar si el email ya existe
    const emailTaken = await emailExists(email)
    if (emailTaken) {
      return {
        step: 1,
        errors: {
          email: ['Este email ya está registrado'],
        },
      }
    }

    // Verificar disponibilidad del slug
    const slugAvailable = await isSlugAvailable(slug)
    if (!slugAvailable) {
      return {
        step: 2,
        errors: {
          slug: ['Este subdominio no está disponible'],
        },
      }
    }

    // Crear tenant con usuario admin
    const { tenant, user } = await createTenantWithAdmin(
      {
        name: organizationName,
        slug,
      },
      {
        name,
        email,
        password,
      }
    )

    // TODO: Enviar email de bienvenida
    // await sendWelcomeEmail(user.email, name, organizationName)

    // Iniciar sesión automáticamente
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

  } catch (error) {
    console.error('[TENANT_REGISTRATION_ERROR]', error)
    return {
      step: 2,
      errors: {
        _form: ['Ocurrió un error al crear la organización. Intenta de nuevo.'],
      },
    }
  }

  // Redirigir al onboarding
  redirect('/onboarding')
}

/**
 * Validar paso 1 del registro (sin crear nada)
 */
export async function validateAccountStep(
  prevState: RegistrationFormState | undefined,
  formData: FormData
): Promise<RegistrationFormState> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  }

  // Validar con schema del paso 1
  const { accountStepSchema } = await import('@/lib/validations/tenant')
  const validatedFields = accountStepSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      step: 1,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Verificar si el email ya existe
  const emailTaken = await emailExists(validatedFields.data.email)
  if (emailTaken) {
    return {
      step: 1,
      errors: {
        email: ['Este email ya está registrado'],
      },
    }
  }

  // Avanzar al paso 2
  return {
    step: 2,
    success: true,
  }
}
```

---

## Paso 4: Crear Componentes del Formulario de Registro

### 4.1 Componente de indicador de pasos

Crea el archivo `src/components/registration/step-indicator.tsx`:

```typescript
// src/components/registration/step-indicator.tsx
import { cn } from '@/lib/utils'

interface Step {
  number: number
  title: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Círculo del paso */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors',
                currentStep > step.number
                  ? 'bg-green-500 text-white'
                  : currentStep === step.number
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-200 text-secondary-500'
              )}
            >
              {currentStep > step.number ? (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                step.number
              )}
            </div>
            <span
              className={cn(
                'mt-2 text-xs font-medium',
                currentStep >= step.number
                  ? 'text-secondary-900'
                  : 'text-secondary-400'
              )}
            >
              {step.title}
            </span>
          </div>

          {/* Línea conectora */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                'w-16 h-0.5 mx-2 -mt-6',
                currentStep > step.number
                  ? 'bg-green-500'
                  : 'bg-secondary-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
```

### 4.2 Componente de verificación de slug

Crea el archivo `src/components/registration/slug-input.tsx`:

```typescript
// src/components/registration/slug-input.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui'
import { checkSlugAvailability } from '@/app/actions/tenant'
import { cn } from '@/lib/utils'

interface SlugInputProps {
  defaultValue?: string
  error?: string
  disabled?: boolean
}

export function SlugInput({ defaultValue = '', error, disabled }: SlugInputProps) {
  const [slug, setSlug] = useState(defaultValue)
  const [status, setStatus] = useState<{
    checking: boolean
    available: boolean | null
    message: string
  }>({
    checking: false,
    available: null,
    message: '',
  })

  // Debounced check
  const checkAvailability = useCallback(async (value: string) => {
    if (value.length < 3) {
      setStatus({ checking: false, available: null, message: '' })
      return
    }

    setStatus({ checking: true, available: null, message: 'Verificando...' })

    const result = await checkSlugAvailability(value)

    setStatus({
      checking: false,
      available: result.available,
      message: result.message || '',
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (slug) {
        checkAvailability(slug)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [slug, checkAvailability])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setSlug(value)
  }

  return (
    <div className="space-y-1">
      <label
        htmlFor="slug"
        className="block text-sm font-medium text-secondary-700"
      >
        Subdominio
      </label>
      <div className="flex items-center">
        <Input
          id="slug"
          name="slug"
          type="text"
          value={slug}
          onChange={handleChange}
          placeholder="mi-academia"
          disabled={disabled}
          className={cn(
            'rounded-r-none',
            error && 'border-red-500'
          )}
        />
        <span className="inline-flex items-center px-3 h-[42px] border border-l-0 border-secondary-300 bg-secondary-50 text-secondary-500 text-sm rounded-r-lg">
          .nextlms.com
        </span>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 min-h-[20px]">
        {status.checking && (
          <span className="text-sm text-secondary-500 flex items-center gap-1">
            <svg
              className="animate-spin h-4 w-4"
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
            {status.message}
          </span>
        )}
        {!status.checking && status.available === true && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {status.message}
          </span>
        )}
        {!status.checking && status.available === false && (
          <span className="text-sm text-red-600 flex items-center gap-1">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {status.message}
          </span>
        )}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  )
}
```

### 4.3 Formulario de registro multi-paso

Crea el archivo `src/components/registration/registration-form.tsx`:

```typescript
// src/components/registration/registration-form.tsx
'use client'

import { useState, useActionState } from 'react'
import { Button, Input, Card, CardContent } from '@/components/ui'
import { StepIndicator } from './step-indicator'
import { SlugInput } from './slug-input'
import {
  registerTenantAction,
  validateAccountStep
} from '@/app/actions/tenant'
import type { RegistrationFormState } from '@/lib/validations/tenant'

const steps = [
  { number: 1, title: 'Tu cuenta' },
  { number: 2, title: 'Organización' },
]

const industries = [
  { value: '', label: 'Selecciona una industria' },
  { value: 'education', label: 'Educación' },
  { value: 'technology', label: 'Tecnología' },
  { value: 'healthcare', label: 'Salud' },
  { value: 'finance', label: 'Finanzas' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'consulting', label: 'Consultoría' },
  { value: 'other', label: 'Otro' },
]

const companySizes = [
  { value: '', label: 'Selecciona el tamaño' },
  { value: '1-10', label: '1-10 empleados' },
  { value: '11-50', label: '11-50 empleados' },
  { value: '51-200', label: '51-200 empleados' },
  { value: '201-500', label: '201-500 empleados' },
  { value: '500+', label: 'Más de 500 empleados' },
]

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [accountData, setAccountData] = useState({
    name: '',
    email: '',
    password: '',
  })

  // Estado para validación del paso 1
  const [step1State, step1Action, step1Pending] = useActionState(
    validateAccountStep,
    undefined
  )

  // Estado para registro completo
  const [registerState, registerAction, registerPending] = useActionState(
    registerTenantAction,
    undefined
  )

  // Si la validación del paso 1 fue exitosa, avanzar al paso 2
  if (step1State?.success && currentStep === 1) {
    setCurrentStep(2)
  }

  // Manejar cambios en el paso 1
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountData({
      ...accountData,
      [e.target.name]: e.target.value,
    })
  }

  // Volver al paso anterior
  const handleBack = () => {
    setCurrentStep(1)
  }

  const state = currentStep === 1 ? step1State : registerState
  const isPending = currentStep === 1 ? step1Pending : registerPending

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-8">
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Error general */}
        {state?.errors?._form && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{state.errors._form[0]}</p>
          </div>
        )}

        {/* Paso 1: Datos de la cuenta */}
        {currentStep === 1 && (
          <form action={step1Action} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-secondary-900">
                Crea tu cuenta
              </h2>
              <p className="text-sm text-secondary-600 mt-1">
                Ingresa tus datos personales
              </p>
            </div>

            <Input
              name="name"
              type="text"
              label="Nombre completo"
              placeholder="Tu nombre"
              autoComplete="name"
              value={accountData.name}
              onChange={handleAccountChange}
              error={state?.errors?.name?.[0]}
              disabled={isPending}
            />

            <Input
              name="email"
              type="email"
              label="Correo electrónico"
              placeholder="tu@email.com"
              autoComplete="email"
              value={accountData.email}
              onChange={handleAccountChange}
              error={state?.errors?.email?.[0]}
              disabled={isPending}
            />

            <Input
              name="password"
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              autoComplete="new-password"
              value={accountData.password}
              onChange={handleAccountChange}
              error={state?.errors?.password?.[0]}
              disabled={isPending}
            />

            <div className="text-xs text-secondary-500">
              <p>La contraseña debe tener:</p>
              <ul className="list-disc list-inside ml-2">
                <li>Al menos 8 caracteres</li>
                <li>Al menos una letra</li>
                <li>Al menos un número</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isPending}
            >
              Continuar
            </Button>
          </form>
        )}

        {/* Paso 2: Datos de la organización */}
        {currentStep === 2 && (
          <form action={registerAction} className="space-y-4">
            {/* Campos ocultos del paso 1 */}
            <input type="hidden" name="name" value={accountData.name} />
            <input type="hidden" name="email" value={accountData.email} />
            <input type="hidden" name="password" value={accountData.password} />

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-secondary-900">
                Tu organización
              </h2>
              <p className="text-sm text-secondary-600 mt-1">
                Configura tu espacio de trabajo
              </p>
            </div>

            <Input
              name="organizationName"
              type="text"
              label="Nombre de la organización"
              placeholder="Mi Academia"
              error={state?.errors?.organizationName?.[0]}
              disabled={isPending}
            />

            <SlugInput
              error={state?.errors?.slug?.[0]}
              disabled={isPending}
            />

            <div className="space-y-1">
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-secondary-700"
              >
                Industria (opcional)
              </label>
              <select
                id="industry"
                name="industry"
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isPending}
              >
                {industries.map((industry) => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="size"
                className="block text-sm font-medium text-secondary-700"
              >
                Tamaño de la empresa (opcional)
              </label>
              <select
                id="size"
                name="size"
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isPending}
              >
                {companySizes.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleBack}
                disabled={isPending}
              >
                Atrás
              </Button>
              <Button
                type="submit"
                className="flex-1"
                isLoading={isPending}
              >
                Crear organización
              </Button>
            </div>
          </form>
        )}

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-secondary-600">
          ¿Ya tienes una cuenta?{' '}
          <a
            href="/auth/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Inicia sesión
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
```

### 4.4 Crear índice de componentes de registro

Crea el archivo `src/components/registration/index.ts`:

```typescript
// src/components/registration/index.ts
export { StepIndicator } from './step-indicator'
export { SlugInput } from './slug-input'
export { RegistrationForm } from './registration-form'
```

---

## Paso 5: Crear Página de Registro de Organización

### 5.1 Crear la página

Crea el archivo `src/app/register/page.tsx`:

```typescript
// src/app/register/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Header, Footer } from '@/components/landing'
import { Container } from '@/components/ui'
import { RegistrationForm } from '@/components/registration'

export const metadata = {
  title: 'Crear organización | Next LMS',
  description: 'Crea tu academia online y comienza a enseñar',
}

export default async function RegisterPage() {
  // Si ya está autenticado, redirigir al dashboard
  const session = await auth()
  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-secondary-50 pt-32 pb-20">
        <Container size="sm">
          <div className="flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-secondary-900">
                Crea tu academia online
              </h1>
              <p className="text-secondary-600 mt-2">
                Comienza gratis y escala cuando lo necesites
              </p>
            </div>

            {/* Formulario */}
            <RegistrationForm />

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-secondary-500">
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
                <span>Configuración en 2 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Soporte incluido</span>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
```

---

## Paso 6: Crear Página de Onboarding

### 6.1 Crear componentes de onboarding

Crea el archivo `src/components/onboarding/onboarding-steps.tsx`:

```typescript
// src/components/onboarding/onboarding-steps.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Card, CardContent } from '@/components/ui'
import { cn } from '@/lib/utils'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  completed?: boolean
}

const defaultSteps: OnboardingStep[] = [
  {
    id: 'profile',
    title: 'Completa tu perfil',
    description: 'Agrega tu foto y una descripción para que tus estudiantes te conozcan',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    href: '/settings/profile',
    completed: false,
  },
  {
    id: 'branding',
    title: 'Personaliza tu marca',
    description: 'Sube el logo de tu organización y elige los colores de tu academia',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    href: '/settings/branding',
    completed: false,
  },
  {
    id: 'course',
    title: 'Crea tu primer curso',
    description: 'Comienza a crear contenido y comparte tu conocimiento con el mundo',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    href: '/dashboard/courses/new',
    completed: false,
  },
  {
    id: 'invite',
    title: 'Invita a tu equipo',
    description: 'Agrega instructores y colaboradores a tu organización',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    href: '/settings/team',
    completed: false,
  },
]

interface OnboardingStepsProps {
  steps?: OnboardingStep[]
}

export function OnboardingSteps({ steps = defaultSteps }: OnboardingStepsProps) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const handleSkipStep = (stepId: string) => {
    setCompletedSteps([...completedSteps, stepId])
  }

  const progress = (completedSteps.length / steps.length) * 100

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-secondary-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-secondary-700">
            Progreso de configuración
          </span>
          <span className="text-sm font-medium text-primary-600">
            {completedSteps.length} de {steps.length} completados
          </span>
        </div>
        <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="grid gap-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)

          return (
            <Card
              key={step.id}
              className={cn(
                'transition-all',
                isCompleted && 'opacity-60'
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                      isCompleted
                        ? 'bg-green-100 text-green-600'
                        : 'bg-primary-100 text-primary-600'
                    )}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-secondary-900">
                          {step.title}
                        </h3>
                        <p className="text-sm text-secondary-600 mt-1">
                          {step.description}
                        </p>
                      </div>
                      <span className="text-xs text-secondary-400">
                        Paso {index + 1}
                      </span>
                    </div>

                    {/* Actions */}
                    {!isCompleted && (
                      <div className="flex items-center gap-3 mt-4">
                        <Link href={step.href}>
                          <Button size="sm">Comenzar</Button>
                        </Link>
                        <button
                          onClick={() => handleSkipStep(step.id)}
                          className="text-sm text-secondary-500 hover:text-secondary-700"
                        >
                          Omitir por ahora
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Skip all */}
      {completedSteps.length < steps.length && (
        <div className="text-center">
          <Link href="/dashboard">
            <Button variant="ghost">
              Ir al dashboard sin completar
            </Button>
          </Link>
        </div>
      )}

      {/* All completed */}
      {completedSteps.length === steps.length && (
        <div className="text-center bg-green-50 rounded-xl border border-green-200 p-6">
          <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            ¡Configuración completa!
          </h3>
          <p className="text-green-700 mb-4">
            Tu academia está lista para recibir estudiantes
          </p>
          <Link href="/dashboard">
            <Button>Ir al dashboard</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
```

### 6.2 Crear índice de onboarding

Crea el archivo `src/components/onboarding/index.ts`:

```typescript
// src/components/onboarding/index.ts
export { OnboardingSteps } from './onboarding-steps'
```

### 6.3 Crear página de onboarding

Crea el archivo `src/app/onboarding/page.tsx`:

```typescript
// src/app/onboarding/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Container } from '@/components/ui'
import { OnboardingSteps } from '@/components/onboarding'

export const metadata = {
  title: 'Configuración inicial | Next LMS',
  description: 'Configura tu academia en unos simples pasos',
}

export default async function OnboardingPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header simple */}
      <header className="bg-white border-b border-secondary-200">
        <Container>
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="font-bold text-xl text-secondary-900">
                Next LMS
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-secondary-600">
                {session.user.email}
              </span>
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-medium text-sm">
                  {session.user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Main content */}
      <main className="py-12">
        <Container size="md">
          {/* Welcome message */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-secondary-900">
              ¡Bienvenido a Next LMS, {session.user.name?.split(' ')[0]}!
            </h1>
            <p className="text-secondary-600 mt-2 max-w-xl mx-auto">
              Completa estos pasos para configurar tu academia y comenzar a
              crear cursos increíbles.
            </p>
          </div>

          {/* Onboarding steps */}
          <OnboardingSteps />
        </Container>
      </main>
    </div>
  )
}
```

---

## Paso 7: Preparar Sistema de Emails

### 7.1 Instalar dependencias para emails

```bash
npm install resend
```

### 7.2 Crear cliente de email

Crea el archivo `src/lib/email.ts`:

```typescript
// src/lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions) {
  const fromEmail = from || process.env.EMAIL_FROM || 'Next LMS <noreply@nextlms.com>'

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })

    return { success: true, data }
  } catch (error) {
    console.error('[EMAIL_ERROR]', error)
    return { success: false, error }
  }
}
```

### 7.3 Crear plantillas de email

Crea el archivo `src/lib/email-templates.ts`:

```typescript
// src/lib/email-templates.ts

interface WelcomeEmailData {
  userName: string
  organizationName: string
  loginUrl: string
}

export function getWelcomeEmailTemplate({
  userName,
  organizationName,
  loginUrl,
}: WelcomeEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a Next LMS</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 40px 0;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    ¡Bienvenido a Next LMS!
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                    Hola <strong>${userName}</strong>,
                  </p>

                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                    Tu organización <strong>${organizationName}</strong> ha sido creada exitosamente en Next LMS. Estás a un paso de comenzar a crear cursos increíbles.
                  </p>

                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
                    Aquí hay algunas cosas que puedes hacer para comenzar:
                  </p>

                  <ul style="margin: 0 0 30px; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #374151;">
                    <li>Completa tu perfil con una foto y descripción</li>
                    <li>Personaliza el branding de tu academia</li>
                    <li>Crea tu primer curso</li>
                    <li>Invita a otros instructores a colaborar</li>
                  </ul>

                  <!-- CTA Button -->
                  <table role="presentation" style="width: 100%;">
                    <tr>
                      <td style="text-align: center;">
                        <a href="${loginUrl}" style="display: inline-block; padding: 16px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 8px;">
                          Ir a mi dashboard
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280; text-align: center;">
                    ¿Tienes preguntas? Responde a este email o visita nuestro
                    <a href="https://nextlms.com/help" style="color: #2563eb; text-decoration: none;">centro de ayuda</a>.
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                    © ${new Date().getFullYear()} Next LMS. Todos los derechos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

interface TeamInviteEmailData {
  inviterName: string
  organizationName: string
  inviteUrl: string
  role: string
}

export function getTeamInviteEmailTemplate({
  inviterName,
  organizationName,
  inviteUrl,
  role,
}: TeamInviteEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitación a Next LMS</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 40px 0;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    Has sido invitado
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                    <strong>${inviterName}</strong> te ha invitado a unirte a <strong>${organizationName}</strong> en Next LMS como <strong>${role}</strong>.
                  </p>

                  <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #374151;">
                    Haz clic en el botón de abajo para aceptar la invitación y crear tu cuenta.
                  </p>

                  <!-- CTA Button -->
                  <table role="presentation" style="width: 100%;">
                    <tr>
                      <td style="text-align: center;">
                        <a href="${inviteUrl}" style="display: inline-block; padding: 16px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 8px;">
                          Aceptar invitación
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 30px 0 0; font-size: 14px; color: #6b7280;">
                    Si no esperabas esta invitación, puedes ignorar este email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                    © ${new Date().getFullYear()} Next LMS. Todos los derechos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}
```

### 7.4 Crear función de envío de email de bienvenida

Crea el archivo `src/services/email.service.ts`:

```typescript
// src/services/email.service.ts
import { sendEmail } from '@/lib/email'
import {
  getWelcomeEmailTemplate,
  getTeamInviteEmailTemplate,
} from '@/lib/email-templates'

/**
 * Enviar email de bienvenida a nuevo usuario
 */
export async function sendWelcomeEmail(
  email: string,
  userName: string,
  organizationName: string
) {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`

  const html = getWelcomeEmailTemplate({
    userName,
    organizationName,
    loginUrl,
  })

  return sendEmail({
    to: email,
    subject: `¡Bienvenido a Next LMS, ${userName}!`,
    html,
  })
}

/**
 * Enviar invitación a unirse a un equipo
 */
export async function sendTeamInviteEmail(
  email: string,
  inviterName: string,
  organizationName: string,
  role: string,
  inviteToken: string
) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inviteToken}`

  const html = getTeamInviteEmailTemplate({
    inviterName,
    organizationName,
    inviteUrl,
    role,
  })

  return sendEmail({
    to: email,
    subject: `${inviterName} te invitó a unirte a ${organizationName}`,
    html,
  })
}
```

### 7.5 Actualizar variables de entorno

Agrega a `.env.local`:

```env
# ===========================================
# EMAIL (Resend)
# ===========================================
# Obtener en: https://resend.com/api-keys
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="Next LMS <noreply@nextlms.com>"
```

### 7.6 Actualizar acción de registro para enviar email

Actualiza `src/app/actions/tenant.ts` para descomentar el envío de email:

```typescript
// En registerTenantAction, reemplazar el TODO:
// TODO: Enviar email de bienvenida

// Por:
import { sendWelcomeEmail } from '@/services/email.service'

// Después de crear el tenant:
try {
  await sendWelcomeEmail(user.email, name, organizationName)
} catch (emailError) {
  // Log pero no fallar si el email falla
  console.error('[WELCOME_EMAIL_ERROR]', emailError)
}
```

---

## Paso 8: Actualizar Links de Navegación

### 8.1 Actualizar el Header

Actualiza los links en `src/components/landing/header.tsx` para que "Comenzar gratis" apunte a `/register`:

```typescript
// En el Header, actualizar los CTAs:
<Link href="/register">
  <Button variant="primary" size="md">
    Comenzar gratis
  </Button>
</Link>
```

### 8.2 Actualizar links en Hero y CTA

Actualiza `src/components/landing/hero.tsx` y `src/components/landing/cta.tsx` para usar `/register`:

```typescript
// En lugar de /auth/register, usar:
<Link href="/register">
```

---

## Paso 9: Verificar Todo

### 9.1 Estructura final de archivos nuevos

```
src/
├── app/
│   ├── register/
│   │   └── page.tsx                    ✅ Página de registro
│   ├── onboarding/
│   │   └── page.tsx                    ✅ Página de onboarding
│   └── actions/
│       └── tenant.ts                   ✅ Server actions de tenant
├── components/
│   ├── registration/
│   │   ├── step-indicator.tsx          ✅ Indicador de pasos
│   │   ├── slug-input.tsx              ✅ Input con verificación
│   │   ├── registration-form.tsx       ✅ Formulario multi-paso
│   │   └── index.ts                    ✅ Exportaciones
│   └── onboarding/
│       ├── onboarding-steps.tsx        ✅ Pasos de onboarding
│       └── index.ts                    ✅ Exportaciones
├── lib/
│   ├── email.ts                        ✅ Cliente de email
│   ├── email-templates.ts              ✅ Plantillas HTML
│   └── validations/
│       └── tenant.ts                   ✅ Esquemas de validación
└── services/
    ├── tenant.service.ts               ✅ Servicio de tenants
    └── email.service.ts                ✅ Servicio de emails
```

### 9.2 Probar el flujo completo

```bash
npm run dev
```

1. **Ir a /register**
   - Completar paso 1 (cuenta)
   - Verificar validación de email existente
   - Avanzar al paso 2

2. **Completar organización**
   - Escribir nombre de organización
   - Verificar disponibilidad de slug en tiempo real
   - Crear organización

3. **Onboarding**
   - Verificar que se muestra la página de onboarding
   - Completar o saltar pasos
   - Ir al dashboard

### 9.3 Verificar flujo

- [ ] Formulario de registro muestra pasos
- [ ] Validación del paso 1 funciona
- [ ] Verificación de slug en tiempo real
- [ ] Creación de tenant y usuario
- [ ] Login automático después del registro
- [ ] Página de onboarding con pasos
- [ ] Progreso de onboarding

---

## Resumen de la Sesión 2.3

### ✅ Lo que aprendimos:

1. **Formularios multi-paso** - Con validación por paso
2. **Verificación en tiempo real** - Debounced slug check
3. **Transacciones Prisma** - Crear tenant + usuario atómicamente
4. **Server Actions** - Validación y creación
5. **Sistema de emails** - Con Resend y plantillas HTML
6. **Onboarding UX** - Guiar usuarios nuevos

### ✅ Tareas completadas:

- [x] Formulario de registro de empresa/organización
- [x] Validación de subdominio único
- [x] Proceso de onboarding inicial
- [x] Email de bienvenida (preparado)

### ✅ Componentes creados:

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| StepIndicator | `components/registration/` | Indicador visual de pasos |
| SlugInput | `components/registration/` | Input con verificación async |
| RegistrationForm | `components/registration/` | Formulario multi-paso |
| OnboardingSteps | `components/onboarding/` | Lista de pasos interactiva |

### ✅ Servicios creados:

| Servicio | Descripción |
|----------|-------------|
| `tenant.service.ts` | CRUD de tenants, verificación slug |
| `email.service.ts` | Envío de emails de bienvenida/invitación |

### 📝 Variables de entorno nuevas:

```env
RESEND_API_KEY=
EMAIL_FROM=
```

---

## Próxima Sesión: 3.1 - Layout del Dashboard

En la siguiente sesión:
- Implementar sidebar navigation (estilo TailAdmin)
- Header con perfil de usuario
- Sistema de breadcrumbs
- Responsive design para dashboard

---

**Estado de la Sesión 2.3:** ✅ Completada
