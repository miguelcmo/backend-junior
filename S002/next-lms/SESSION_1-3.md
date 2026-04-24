# SESIÓN 1.3 - Sistema de Autenticación

**Objetivo:** Implementar un sistema de autenticación completo con NextAuth.js v5, múltiples proveedores, páginas de login/registro, protección de rutas y control de acceso basado en roles (RBAC).

**Duración estimada:** 3-4 horas

**Requisitos previos:**
- Sesiones 1.1 y 1.2 completadas
- Docker corriendo con PostgreSQL
- Dependencias instaladas (next-auth@beta ya instalado)

---

## Conceptos Clave de Autenticación

### Diagrama de Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FLUJO DE AUTENTICACIÓN                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   Usuario                                                               │
│      │                                                                  │
│      ▼                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  │  LOGIN   │───▶│ NextAuth │───▶│ Provider │───▶│    BD    │         │
│  │   PAGE   │    │  Server  │    │(Creds/   │    │ (Prisma) │         │
│  └──────────┘    └────┬─────┘    │ OAuth)   │    └──────────┘         │
│                       │          └──────────┘                          │
│                       ▼                                                 │
│                 ┌──────────┐                                           │
│                 │  SESSION │  ← JWT Token en Cookie                    │
│                 │  CREATED │                                           │
│                 └────┬─────┘                                           │
│                      │                                                  │
│                      ▼                                                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                            │
│   │  PROXY   │──│ PROTECTED│──│DASHBOARD │                            │
│   │(Verifica)│  │  ROUTES  │  │   PAGE   │                            │
│   └──────────┘  └──────────┘  └──────────┘                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Tres Pilares de la Autenticación

| Concepto | Descripción | Implementación |
|----------|-------------|----------------|
| **Authentication** | Verificar identidad del usuario | NextAuth.js Providers |
| **Session Management** | Mantener estado de auth entre requests | JWT en Cookies |
| **Authorization** | Controlar acceso a recursos | RBAC + Proxy |

---

## Paso 1: Configurar NextAuth.js v5

### 1.1 Crear archivo de configuración de Auth

Crea el archivo `src/lib/auth.ts`:

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import { compare } from 'bcryptjs'
import prisma from '@/lib/prisma'
import type { Role } from '@prisma/client'

// Extender tipos de NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: Role
      tenantId?: string
    }
  }

  interface User {
    role: Role
    tenantId?: string
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    role: Role
    tenantId?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Adaptador de Prisma para persistir sesiones en BD
  adapter: PrismaAdapter(prisma),

  // Usar JWT para sesiones (stateless)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  // Páginas personalizadas
  pages: {
    signIn: '/auth/login',
    // signUp: '/auth/register', // NextAuth no tiene signUp nativo
    error: '/auth/error',
  },

  // Proveedores de autenticación
  providers: [
    // ========================================
    // PROVEEDOR DE CREDENCIALES (Email/Password)
    // ========================================
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos')
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Buscar usuario en BD
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            image: true,
            role: true,
            tenantId: true,
            isActive: true,
            emailVerified: true,
          },
        })

        if (!user) {
          throw new Error('Usuario no encontrado')
        }

        if (!user.isActive) {
          throw new Error('Usuario desactivado')
        }

        if (!user.password) {
          throw new Error('Esta cuenta usa inicio de sesión social')
        }

        // Verificar contraseña
        const isValidPassword = await compare(password, user.password)

        if (!isValidPassword) {
          throw new Error('Contraseña incorrecta')
        }

        // Retornar usuario (sin password)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          tenantId: user.tenantId,
        }
      },
    }),

    // ========================================
    // PROVEEDOR DE GOOGLE
    // ========================================
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Permitir vincular cuentas existentes
      allowDangerousEmailAccountLinking: true,
    }),

    // ========================================
    // PROVEEDOR DE GITHUB
    // ========================================
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  // Callbacks para personalizar comportamiento
  callbacks: {
    // Callback JWT: Se ejecuta cada vez que se crea/actualiza el token
    async jwt({ token, user, trigger, session }) {
      // Primera vez que el usuario inicia sesión
      if (user) {
        token.id = user.id
        token.role = user.role
        token.tenantId = user.tenantId
      }

      // Cuando se actualiza la sesión desde el cliente
      if (trigger === 'update' && session) {
        token.name = session.name
        token.image = session.image
      }

      return token
    },

    // Callback Session: Controla qué datos se exponen al cliente
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        session.user.tenantId = token.tenantId as string | undefined
      }
      return session
    },

    // Callback SignIn: Verificaciones adicionales al iniciar sesión
    async signIn({ user, account }) {
      // Para OAuth, verificar/crear usuario en BD
      if (account?.provider !== 'credentials') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        // Si el usuario no existe, se creará automáticamente por el adapter
        // Aquí podemos agregar lógica adicional si es necesario
        if (existingUser && !existingUser.isActive) {
          return false // Bloquear usuarios desactivados
        }
      }

      return true
    },
  },

  // Eventos para logging/analytics
  events: {
    async signIn({ user, account }) {
      console.log(`[AUTH] Usuario ${user.email} inició sesión via ${account?.provider}`)
    },
    async signOut({ token }) {
      console.log(`[AUTH] Usuario ${token?.email} cerró sesión`)
    },
  },

  // Configuración de debug (solo en desarrollo)
  debug: process.env.NODE_ENV === 'development',
})
```

### 1.2 Crear Route Handler de NextAuth

Crea el archivo `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
```

### 1.3 Actualizar variables de entorno

Agrega las nuevas variables a `.env.local`:

```env
# ===========================================
# AUTENTICACIÓN (NextAuth.js v5)
# ===========================================
# Genera un secret con: openssl rand -base64 32
AUTH_SECRET="tu-secret-super-seguro-de-32-caracteres-minimo"

# URL base de la aplicación
AUTH_URL="http://localhost:3000"

# Trust host (necesario para desarrollo)
AUTH_TRUST_HOST=true

# ===========================================
# GOOGLE OAuth (opcional - configurar después)
# ===========================================
# Obtener en: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"

# ===========================================
# GITHUB OAuth (opcional - configurar después)
# ===========================================
# Obtener en: https://github.com/settings/developers
GITHUB_CLIENT_ID="tu-github-client-id"
GITHUB_CLIENT_SECRET="tu-github-client-secret"
```

**Nota:** Por ahora solo usaremos el proveedor de credenciales. Configuraremos Google y GitHub más adelante.

---

## Paso 2: Crear Servicios de Autenticación

### 2.1 Servicio de Usuario (actualizado)

Crea el archivo `src/services/user.service.ts`:

```typescript
// src/services/user.service.ts
import prisma from '@/lib/prisma'
import { User, Role, Prisma } from '@prisma/client'
import { hash, compare } from 'bcryptjs'

// Selección de campos seguros (sin password)
const safeUserSelect = {
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

export type SafeUser = Prisma.UserGetPayload<{ select: typeof safeUserSelect }>

// ============================================
// QUERIES (Lectura)
// ============================================

/**
 * Obtener usuario por ID (sin password)
 */
export async function getUserById(id: string): Promise<SafeUser | null> {
  return prisma.user.findUnique({
    where: { id },
    select: safeUserSelect,
  })
}

/**
 * Obtener usuario por email (sin password)
 */
export async function getUserByEmail(email: string): Promise<SafeUser | null> {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: safeUserSelect,
  })
}

/**
 * Verificar si un email ya está registrado
 */
export async function emailExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  })
  return user !== null
}

/**
 * Obtener usuarios de un tenant específico
 */
export async function getUsersByTenant(tenantId: string): Promise<SafeUser[]> {
  return prisma.user.findMany({
    where: {
      tenantId,
      isActive: true,
    },
    select: safeUserSelect,
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
    select: safeUserSelect,
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
  // Verificar si el email ya existe
  const exists = await emailExists(data.email)
  if (exists) {
    throw new Error('El email ya está registrado')
  }

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
    select: safeUserSelect,
  })
}

/**
 * Verificar credenciales de usuario
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<SafeUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!user || !user.password) {
    return null
  }

  if (!user.isActive) {
    return null
  }

  const isValid = await compare(password, user.password)

  if (!isValid) {
    return null
  }

  // Retornar usuario sin password
  const { password: _, ...safeUser } = user
  return safeUser as SafeUser
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
    select: safeUserSelect,
  })
}

/**
 * Cambiar contraseña
 */
export async function changePassword(
  id: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { password: true },
  })

  if (!user || !user.password) {
    throw new Error('Usuario no encontrado o usa login social')
  }

  const isValid = await compare(currentPassword, user.password)
  if (!isValid) {
    throw new Error('Contraseña actual incorrecta')
  }

  const hashedPassword = await hash(newPassword, 12)

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  })

  return true
}

/**
 * Desactivar usuario (soft delete)
 */
export async function deactivateUser(id: string): Promise<SafeUser> {
  return prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: safeUserSelect,
  })
}
```

### 2.2 Crear índice de servicios

Crea o actualiza `src/services/index.ts`:

```typescript
// src/services/index.ts
export * from './user.service'
```

---

## Paso 3: Crear Esquemas de Validación con Zod

### 3.1 Crear esquemas de autenticación

Crea el archivo `src/lib/validations/auth.ts`:

```typescript
// src/lib/validations/auth.ts
import { z } from 'zod'

// Esquema de Login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginInput = z.infer<typeof loginSchema>

// Esquema de Registro
export const registerSchema = z.object({
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
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export type RegisterInput = z.infer<typeof registerSchema>

// Tipo para estado del formulario
export type FormState = {
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
    _form?: string[]
  }
  success?: boolean
  message?: string
}
```

### 3.2 Crear índice de validaciones

Crea el archivo `src/lib/validations/index.ts`:

```typescript
// src/lib/validations/index.ts
export * from './auth'
```

---

## Paso 4: Crear Server Actions de Autenticación

### 4.1 Crear acciones del servidor

Crea el archivo `src/app/actions/auth.ts`:

```typescript
// src/app/actions/auth.ts
'use server'

import { signIn, signOut } from '@/lib/auth'
import { createUser, emailExists } from '@/services/user.service'
import { loginSchema, registerSchema, FormState } from '@/lib/validations/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

/**
 * Action para iniciar sesión con credenciales
 */
export async function loginAction(
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  // Validar campos
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            errors: {
              _form: ['Credenciales inválidas'],
            },
          }
        default:
          return {
            errors: {
              _form: ['Ocurrió un error al iniciar sesión'],
            },
          }
      }
    }
    throw error
  }

  // Redirigir después de login exitoso
  redirect('/dashboard')
}

/**
 * Action para registrar un nuevo usuario
 */
export async function registerAction(
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  // Validar campos
  const validatedFields = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data

  try {
    // Verificar si el email ya existe
    const exists = await emailExists(email)
    if (exists) {
      return {
        errors: {
          email: ['Este email ya está registrado'],
        },
      }
    }

    // Crear usuario
    await createUser({
      name,
      email,
      password,
    })

    // Iniciar sesión automáticamente
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    console.error('[REGISTER_ERROR]', error)
    return {
      errors: {
        _form: ['Ocurrió un error al crear la cuenta'],
      },
    }
  }

  // Redirigir después de registro exitoso
  redirect('/dashboard')
}

/**
 * Action para cerrar sesión
 */
export async function logoutAction() {
  await signOut({ redirect: false })
  redirect('/auth/login')
}

/**
 * Action para iniciar sesión con OAuth
 */
export async function oauthSignIn(provider: 'google' | 'github') {
  await signIn(provider, { redirectTo: '/dashboard' })
}
```

---

## Paso 5: Crear Componentes de UI Base

### 5.1 Componente Button

Crea el archivo `src/components/ui/button.tsx`:

```typescript
// src/components/ui/button.tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
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
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
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
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
```

### 5.2 Componente Input

Crea el archivo `src/components/ui/input.tsx`:

```typescript
// src/components/ui/input.tsx
import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', id, ...props }, ref) => {
    const inputId = id || props.name

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
```

### 5.3 Componente Card

Crea el archivo `src/components/ui/card.tsx`:

```typescript
// src/components/ui/card.tsx
import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 shadow-sm',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('px-6 py-4 border-b border-gray-200', className)}
      {...props}
    />
  )
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-lg font-semibold text-gray-900', className)}
      {...props}
    />
  )
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-gray-600 mt-1', className)} {...props} />
  )
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn('px-6 py-4', className)} {...props} />
}

export function CardFooter({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl',
        className
      )}
      {...props}
    />
  )
}
```

### 5.4 Actualizar índice de componentes UI

Actualiza `src/components/ui/index.ts`:

```typescript
// src/components/ui/index.ts
export { Button } from './button'
export { Input } from './input'
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
```

---

## Paso 6: Crear Páginas de Autenticación

### 6.1 Layout de Autenticación

Crea el archivo `src/app/auth/layout.tsx`:

```typescript
// src/app/auth/layout.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Si el usuario ya está autenticado, redirigir al dashboard
  const session = await auth()

  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
```

### 6.2 Página de Login

Crea el archivo `src/app/auth/login/page.tsx`:

```typescript
// src/app/auth/login/page.tsx
import { LoginForm } from './login-form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import Link from 'next/link'

export const metadata = {
  title: 'Iniciar Sesión | Next LMS',
  description: 'Inicia sesión en tu cuenta de Next LMS',
}

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Bienvenido de nuevo</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                O continúa con
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              disabled
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-gray-500">
            OAuth deshabilitado temporalmente
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link
            href="/auth/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Regístrate aquí
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
```

### 6.3 Componente de Formulario de Login

Crea el archivo `src/app/auth/login/login-form.tsx`:

```typescript
// src/app/auth/login/login-form.tsx
'use client'

import { useActionState } from 'react'
import { loginAction } from '@/app/actions/auth'
import { Button, Input } from '@/components/ui'

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined)

  return (
    <form action={action} className="space-y-4">
      {/* Error general del formulario */}
      {state?.errors?._form && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{state.errors._form[0]}</p>
        </div>
      )}

      <Input
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="tu@email.com"
        autoComplete="email"
        error={state?.errors?.email?.[0]}
        disabled={pending}
      />

      <Input
        name="password"
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        autoComplete="current-password"
        error={state?.errors?.password?.[0]}
        disabled={pending}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="remember"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">Recordarme</span>
        </label>

        <a
          href="/auth/forgot-password"
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        isLoading={pending}
      >
        Iniciar Sesión
      </Button>
    </form>
  )
}
```

### 6.4 Página de Registro

Crea el archivo `src/app/auth/register/page.tsx`:

```typescript
// src/app/auth/register/page.tsx
import { RegisterForm } from './register-form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import Link from 'next/link'

export const metadata = {
  title: 'Crear Cuenta | Next LMS',
  description: 'Crea tu cuenta en Next LMS',
}

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Crear cuenta</CardTitle>
        <CardDescription>
          Completa el formulario para crear tu cuenta
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Inicia sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
```

### 6.5 Componente de Formulario de Registro

Crea el archivo `src/app/auth/register/register-form.tsx`:

```typescript
// src/app/auth/register/register-form.tsx
'use client'

import { useActionState } from 'react'
import { registerAction } from '@/app/actions/auth'
import { Button, Input } from '@/components/ui'

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, undefined)

  return (
    <form action={action} className="space-y-4">
      {/* Error general del formulario */}
      {state?.errors?._form && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{state.errors._form[0]}</p>
        </div>
      )}

      <Input
        name="name"
        type="text"
        label="Nombre completo"
        placeholder="Tu nombre"
        autoComplete="name"
        error={state?.errors?.name?.[0]}
        disabled={pending}
      />

      <Input
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="tu@email.com"
        autoComplete="email"
        error={state?.errors?.email?.[0]}
        disabled={pending}
      />

      <Input
        name="password"
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        autoComplete="new-password"
        error={state?.errors?.password?.[0]}
        disabled={pending}
      />

      <Input
        name="confirmPassword"
        type="password"
        label="Confirmar contraseña"
        placeholder="••••••••"
        autoComplete="new-password"
        error={state?.errors?.confirmPassword?.[0]}
        disabled={pending}
      />

      <div className="text-xs text-gray-500">
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
        isLoading={pending}
      >
        Crear cuenta
      </Button>

      <p className="text-xs text-center text-gray-500">
        Al registrarte, aceptas nuestros{' '}
        <a href="/terms" className="text-blue-600 hover:underline">
          Términos de Servicio
        </a>{' '}
        y{' '}
        <a href="/privacy" className="text-blue-600 hover:underline">
          Política de Privacidad
        </a>
      </p>
    </form>
  )
}
```

### 6.6 Página de Error de Auth

Crea el archivo `src/app/auth/error/page.tsx`:

```typescript
// src/app/auth/error/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import Link from 'next/link'

export const metadata = {
  title: 'Error de Autenticación | Next LMS',
}

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const errorMessages: Record<string, string> = {
    Configuration: 'Hay un problema con la configuración del servidor.',
    AccessDenied: 'No tienes permiso para acceder a este recurso.',
    Verification: 'El enlace de verificación ha expirado o ya fue usado.',
    Default: 'Ocurrió un error durante la autenticación.',
  }

  const error = searchParams.error || 'Default'
  const message = errorMessages[error] || errorMessages.Default

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <CardTitle className="text-2xl text-red-600">
          Error de Autenticación
        </CardTitle>
      </CardHeader>

      <CardContent className="text-center">
        <p className="text-gray-600 mb-6">{message}</p>

        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
        >
          Volver a intentar
        </Link>
      </CardContent>
    </Card>
  )
}
```

---

## Paso 7: Implementar Proxy (Middleware de Protección)

### 7.1 Crear archivo Proxy

**Nota importante:** En Next.js 16, el archivo de middleware se llama `proxy.ts` en lugar de `middleware.ts`.

Crea el archivo `src/proxy.ts`:

```typescript
// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

// Rutas que requieren autenticación
const protectedRoutes = [
  '/dashboard',
  '/courses',
  '/admin',
  '/profile',
  '/settings',
]

// Rutas públicas (solo para usuarios no autenticados)
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
]

// Rutas que requieren roles específicos
const roleRoutes: Record<string, string[]> = {
  '/admin': ['SUPER_ADMIN', 'ADMIN'],
  '/courses/create': ['SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR'],
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Obtener sesión
  const session = await auth()
  const isAuthenticated = !!session?.user
  const userRole = session?.user?.role

  // Verificar si es una ruta protegida
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Verificar si es una ruta de autenticación
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Redirigir usuarios no autenticados de rutas protegidas al login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirigir usuarios autenticados de rutas de auth al dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Verificar permisos de rol para rutas específicas
  if (isAuthenticated && userRole) {
    for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          // Redirigir a página de acceso denegado
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      }
    }
  }

  return NextResponse.next()
}

// Configurar en qué rutas se ejecuta el proxy
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}
```

### 7.2 Crear página de acceso no autorizado

Crea el archivo `src/app/unauthorized/page.tsx`:

```typescript
// src/app/unauthorized/page.tsx
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export const metadata = {
  title: 'Acceso Denegado | Next LMS',
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl">Acceso Denegado</CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            No tienes permisos para acceder a esta página. Si crees que esto es
            un error, contacta al administrador.
          </p>

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Ir al Dashboard
            </Link>
            <Link
              href="/"
              className="block w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Ir al Inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## Paso 8: Crear Dashboard Básico

### 8.1 Layout del Dashboard

Crea el archivo `src/app/dashboard/layout.tsx`:

```typescript
// src/app/dashboard/layout.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { UserNav } from './components/user-nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Next LMS</h1>
            </div>
            <UserNav user={session.user} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
```

### 8.2 Página del Dashboard

Crea el archivo `src/app/dashboard/page.tsx`:

```typescript
// src/app/dashboard/page.tsx
import { auth } from '@/lib/auth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export const metadata = {
  title: 'Dashboard | Next LMS',
}

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Bienvenido, {user?.name}!
        </h2>
        <p className="text-gray-600 mt-1">
          Este es tu panel de control de Next LMS
        </p>
      </div>

      {/* Info del usuario */}
      <Card>
        <CardHeader>
          <CardTitle>Tu información</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nombre</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rol</dt>
              <dd className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user?.role}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ID de Usuario</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{user?.id}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Estadísticas según rol */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {user?.role === 'STUDENT' && (
          <>
            <StatCard title="Cursos Inscritos" value="0" icon="book" />
            <StatCard title="Lecciones Completadas" value="0" icon="check" />
            <StatCard title="Certificados" value="0" icon="award" />
            <StatCard title="Tiempo de Estudio" value="0h" icon="clock" />
          </>
        )}

        {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
          <>
            <StatCard title="Cursos Creados" value="0" icon="book" />
            <StatCard title="Estudiantes" value="0" icon="users" />
            <StatCard title="Lecciones" value="0" icon="file" />
            <StatCard title="Ingresos" value="$0" icon="dollar" />
          </>
        )}

        {user?.role === 'SUPER_ADMIN' && (
          <>
            <StatCard title="Total Tenants" value="0" icon="building" />
            <StatCard title="Total Usuarios" value="0" icon="users" />
            <StatCard title="Total Cursos" value="0" icon="book" />
            <StatCard title="Ingresos Totales" value="$0" icon="dollar" />
          </>
        )}
      </div>
    </div>
  )
}

// Componente de tarjeta de estadística
function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-lg">
              {icon === 'book' && '📚'}
              {icon === 'check' && '✅'}
              {icon === 'award' && '🏆'}
              {icon === 'clock' && '⏰'}
              {icon === 'users' && '👥'}
              {icon === 'file' && '📄'}
              {icon === 'dollar' && '💰'}
              {icon === 'building' && '🏢'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 8.3 Componente de navegación de usuario

Crea el archivo `src/app/dashboard/components/user-nav.tsx`:

```typescript
// src/app/dashboard/components/user-nav.tsx
'use client'

import { useState } from 'react'
import { logoutAction } from '@/app/actions/auth'
import type { Session } from 'next-auth'

interface UserNavProps {
  user: Session['user']
}

export function UserNav({ user }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || ''}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <span className="text-white text-sm font-medium">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay para cerrar */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>

              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Mi Perfil
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Configuración
              </a>

              <div className="border-t">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Cerrar Sesión
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
```

---

## Paso 9: Sistema RBAC (Control de Acceso Basado en Roles)

### 9.1 Crear utilidades de autorización

Crea el archivo `src/lib/auth-utils.ts`:

```typescript
// src/lib/auth-utils.ts
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Role } from '@prisma/client'

// Jerarquía de roles (mayor índice = más permisos)
const roleHierarchy: Record<Role, number> = {
  STUDENT: 1,
  INSTRUCTOR: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
}

/**
 * Verificar si el usuario actual tiene un rol específico
 */
export async function hasRole(allowedRoles: Role[]): Promise<boolean> {
  const session = await auth()

  if (!session?.user?.role) {
    return false
  }

  return allowedRoles.includes(session.user.role as Role)
}

/**
 * Verificar si el usuario tiene al menos el nivel de rol especificado
 */
export async function hasMinRole(minRole: Role): Promise<boolean> {
  const session = await auth()

  if (!session?.user?.role) {
    return false
  }

  const userRoleLevel = roleHierarchy[session.user.role as Role]
  const minRoleLevel = roleHierarchy[minRole]

  return userRoleLevel >= minRoleLevel
}

/**
 * Obtener sesión actual o redirigir si no está autenticado
 */
export async function requireAuth() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  return session
}

/**
 * Requerir un rol específico o redirigir
 */
export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth()

  if (!allowedRoles.includes(session.user.role as Role)) {
    redirect('/unauthorized')
  }

  return session
}

/**
 * Requerir un nivel mínimo de rol o redirigir
 */
export async function requireMinRole(minRole: Role) {
  const session = await requireAuth()

  const userRoleLevel = roleHierarchy[session.user.role as Role]
  const minRoleLevel = roleHierarchy[minRole]

  if (userRoleLevel < minRoleLevel) {
    redirect('/unauthorized')
  }

  return session
}

/**
 * Verificar si el usuario pertenece a un tenant específico
 */
export async function belongsToTenant(tenantId: string): Promise<boolean> {
  const session = await auth()

  if (!session?.user) {
    return false
  }

  // Super admin tiene acceso a todos los tenants
  if (session.user.role === 'SUPER_ADMIN') {
    return true
  }

  return session.user.tenantId === tenantId
}

/**
 * Requerir pertenencia a un tenant específico
 */
export async function requireTenant(tenantId: string) {
  const session = await requireAuth()

  // Super admin tiene acceso a todos los tenants
  if (session.user.role === 'SUPER_ADMIN') {
    return session
  }

  if (session.user.tenantId !== tenantId) {
    redirect('/unauthorized')
  }

  return session
}
```

### 9.2 Crear componentes de autorización

Crea el archivo `src/components/auth/role-gate.tsx`:

```typescript
// src/components/auth/role-gate.tsx
import { auth } from '@/lib/auth'
import type { Role } from '@prisma/client'

interface RoleGateProps {
  allowedRoles: Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Componente para mostrar contenido solo a usuarios con roles específicos
 * Uso:
 * <RoleGate allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
 *   <AdminPanel />
 * </RoleGate>
 */
export async function RoleGate({
  allowedRoles,
  children,
  fallback = null,
}: RoleGateProps) {
  const session = await auth()

  if (!session?.user?.role) {
    return fallback
  }

  if (!allowedRoles.includes(session.user.role as Role)) {
    return fallback
  }

  return <>{children}</>
}
```

Crea el archivo `src/components/auth/auth-check.tsx`:

```typescript
// src/components/auth/auth-check.tsx
import { auth } from '@/lib/auth'

interface AuthCheckProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Componente para mostrar contenido solo a usuarios autenticados
 * Uso:
 * <AuthCheck fallback={<LoginButton />}>
 *   <UserProfile />
 * </AuthCheck>
 */
export async function AuthCheck({ children, fallback = null }: AuthCheckProps) {
  const session = await auth()

  if (!session?.user) {
    return fallback
  }

  return <>{children}</>
}
```

### 9.3 Actualizar índice de componentes auth

Crea el archivo `src/components/auth/index.ts`:

```typescript
// src/components/auth/index.ts
export { RoleGate } from './role-gate'
export { AuthCheck } from './auth-check'
```

---

## Paso 10: Verificar Todo

### 10.1 Estructura final de archivos

Tu proyecto debería tener estos nuevos archivos:

```
src/
├── app/
│   ├── actions/
│   │   └── auth.ts                    ✅ Server Actions
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts           ✅ Route Handler
│   ├── auth/
│   │   ├── layout.tsx                 ✅ Layout de auth
│   │   ├── login/
│   │   │   ├── page.tsx               ✅ Página login
│   │   │   └── login-form.tsx         ✅ Formulario login
│   │   ├── register/
│   │   │   ├── page.tsx               ✅ Página registro
│   │   │   └── register-form.tsx      ✅ Formulario registro
│   │   └── error/
│   │       └── page.tsx               ✅ Página error
│   ├── dashboard/
│   │   ├── layout.tsx                 ✅ Layout dashboard
│   │   ├── page.tsx                   ✅ Página dashboard
│   │   └── components/
│   │       └── user-nav.tsx           ✅ Navegación usuario
│   └── unauthorized/
│       └── page.tsx                   ✅ Página sin permisos
├── components/
│   ├── ui/
│   │   ├── button.tsx                 ✅ Componente Button
│   │   ├── input.tsx                  ✅ Componente Input
│   │   ├── card.tsx                   ✅ Componente Card
│   │   └── index.ts                   ✅ Exportaciones
│   └── auth/
│       ├── role-gate.tsx              ✅ Gate de roles
│       ├── auth-check.tsx             ✅ Check de auth
│       └── index.ts                   ✅ Exportaciones
├── lib/
│   ├── auth.ts                        ✅ Configuración NextAuth
│   ├── auth-utils.ts                  ✅ Utilidades RBAC
│   ├── prisma.ts
│   ├── utils.ts
│   └── validations/
│       ├── auth.ts                    ✅ Esquemas Zod
│       └── index.ts                   ✅ Exportaciones
├── services/
│   ├── user.service.ts                ✅ Servicio usuarios
│   └── index.ts                       ✅ Exportaciones
└── proxy.ts                           ✅ Middleware de rutas
```

### 10.2 Probar el flujo completo

```bash
# 1. Asegúrate de que Docker está corriendo
docker-compose ps

# 2. Ejecutar seed (si no lo has hecho)
npx prisma db seed

# 3. Iniciar servidor de desarrollo
npm run dev
```

### 10.3 Flujo de prueba

1. **Página de Login:** http://localhost:3000/auth/login
   - Usar credenciales: `admin@acme.com` / `password123`

2. **Página de Registro:** http://localhost:3000/auth/register
   - Crear un nuevo usuario

3. **Dashboard:** http://localhost:3000/dashboard
   - Ver información del usuario autenticado

4. **Protección de rutas:**
   - Intentar acceder a `/dashboard` sin autenticar → Redirige a login
   - Intentar acceder a `/auth/login` autenticado → Redirige a dashboard

5. **Cerrar sesión:**
   - Click en el menú de usuario → "Cerrar Sesión"

---

## Resumen de la Sesión 1.3

### ✅ Lo que aprendimos:

1. **NextAuth.js v5** - Configuración con Prisma Adapter y JWT
2. **Providers** - Credenciales y estructura para OAuth
3. **Server Actions** - Acciones del servidor para login/registro
4. **Validación con Zod** - Esquemas de validación de formularios
5. **Proxy (Middleware)** - Protección de rutas en Next.js 16
6. **RBAC** - Sistema de control de acceso basado en roles
7. **Componentes UI** - Button, Input, Card reutilizables

### ✅ Tareas completadas:

- [x] Implementar NextAuth.js v5
- [x] Configurar provider de credenciales
- [x] Preparar estructura para OAuth (Google, GitHub)
- [x] Crear páginas de login/register
- [x] Implementar proxy de protección de rutas
- [x] Sistema de roles y permisos (RBAC)

### 📝 Flujo de autenticación:

```
┌──────────────────────────────────────────────────────────────┐
│ Usuario                                                       │
│    │                                                          │
│    ├─► /auth/login ─► loginAction() ─► signIn() ─► JWT       │
│    │                                                          │
│    ├─► /dashboard ◄── proxy.ts verifica JWT ────┘            │
│    │                                                          │
│    └─► /admin ◄── proxy.ts verifica rol ─► RBAC              │
└──────────────────────────────────────────────────────────────┘
```

### 🔐 Credenciales de prueba:

| Email | Password | Rol |
|-------|----------|-----|
| superadmin@nextlms.com | password123 | SUPER_ADMIN |
| admin@acme.com | password123 | ADMIN |
| instructor@acme.com | password123 | INSTRUCTOR |
| maria@student.com | password123 | STUDENT |

### 📝 Comandos útiles:

```bash
# Generar nuevo secret para producción
openssl rand -base64 32

# Verificar configuración de auth
npm run dev
# Luego visitar: http://localhost:3000/api/auth/providers

# Resetear base de datos y seed
npx prisma migrate reset
```

---

## Próxima Sesión: 2.1 - Landing Page Principal

En la siguiente sesión:
- Crear layout de landing (header, footer, navigation)
- Hero section con CTA
- Sección de características del LMS
- Sección de testimonios
- Componentes reutilizables adicionales

---

**Estado de la Sesión 1.3:** ✅ Completada
