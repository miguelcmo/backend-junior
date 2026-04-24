# SESIÓN 2.2 - Planes y Precios

**Objetivo:** Crear una página de precios profesional con tarjetas de planes, comparador de características, sección de FAQ y preparar la estructura para integración con Mercado Pago.

**Duración estimada:** 3-4 horas

**Requisitos previos:**
- Sesión 2.1 completada
- Servidor de desarrollo funcionando

---

## Visión General de la Página de Precios

### Estructura de la Página

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              HEADER                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                         PRICING HEADER                                   │
│            "Planes simples, precios transparentes"                      │
│              [Toggle: Mensual / Anual (-20%)]                           │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                        PRICING CARDS                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │   FREE   │  │ STARTER  │  │   PRO    │  │ENTERPRISE│                │
│  │    $0    │  │   $29    │  │   $79    │  │ Contacto │                │
│  │          │  │          │  │ Popular  │  │          │                │
│  │ Features │  │ Features │  │ Features │  │ Features │                │
│  │[Comenzar]│  │[Comenzar]│  │[Comenzar]│  │[Contacto]│                │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    FEATURE COMPARISON TABLE                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Feature          │ Free │ Starter │ Pro │ Enterprise           │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │ Cursos           │  1   │    5    │ 50  │ Ilimitados           │   │
│  │ Estudiantes      │  50  │   500   │5000 │ Ilimitados           │   │
│  │ ...              │      │         │     │                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                              FAQ                                         │
│                     [Accordion de preguntas]                            │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                              CTA                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                             FOOTER                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Paso 1: Definir Tipos y Configuración de Planes

### 1.1 Crear tipos para planes y precios

Crea el archivo `src/types/pricing.ts`:

```typescript
// src/types/pricing.ts

export type PlanTier = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE'

export type BillingPeriod = 'monthly' | 'yearly'

export interface PlanFeature {
  name: string
  free: boolean | string | number
  starter: boolean | string | number
  pro: boolean | string | number
  enterprise: boolean | string | number
  tooltip?: string
}

export interface Plan {
  id: PlanTier
  name: string
  description: string
  monthlyPrice: number | null // null = contacto
  yearlyPrice: number | null
  currency: string
  features: string[]
  highlighted?: boolean
  badge?: string
  ctaText: string
  ctaLink: string
}

export interface FAQ {
  question: string
  answer: string
}
```

### 1.2 Crear configuración de planes

Crea el archivo `src/config/pricing.ts`:

```typescript
// src/config/pricing.ts
import type { Plan, PlanFeature, FAQ } from '@/types/pricing'

export const plans: Plan[] = [
  {
    id: 'FREE',
    name: 'Gratis',
    description: 'Perfecto para probar la plataforma',
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'USD',
    features: [
      '1 curso activo',
      'Hasta 50 estudiantes',
      'Lecciones de texto',
      'Certificados básicos',
      'Soporte por email',
      'Branding de Next LMS',
    ],
    ctaText: 'Comenzar gratis',
    ctaLink: '/auth/register?plan=free',
  },
  {
    id: 'STARTER',
    name: 'Starter',
    description: 'Para creadores que están comenzando',
    monthlyPrice: 29,
    yearlyPrice: 279, // ~20% descuento
    currency: 'USD',
    features: [
      'Hasta 5 cursos',
      'Hasta 500 estudiantes',
      'Lecciones de video',
      'Quizzes y evaluaciones',
      'Certificados personalizados',
      'Dominio personalizado',
      'Sin marca de Next LMS',
      'Soporte prioritario',
    ],
    ctaText: 'Comenzar prueba',
    ctaLink: '/auth/register?plan=starter',
  },
  {
    id: 'PRO',
    name: 'Profesional',
    description: 'Para academias y empresas en crecimiento',
    monthlyPrice: 79,
    yearlyPrice: 759, // ~20% descuento
    currency: 'USD',
    features: [
      'Hasta 50 cursos',
      'Hasta 5,000 estudiantes',
      'Todo lo de Starter',
      'Asistente IA para contenido',
      'Análisis avanzados',
      'API access',
      'Integraciones premium',
      'Múltiples instructores',
      'Soporte 24/7',
    ],
    highlighted: true,
    badge: 'Más popular',
    ctaText: 'Comenzar prueba',
    ctaLink: '/auth/register?plan=pro',
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    description: 'Para grandes organizaciones',
    monthlyPrice: null,
    yearlyPrice: null,
    currency: 'USD',
    features: [
      'Cursos ilimitados',
      'Estudiantes ilimitados',
      'Todo lo de Pro',
      'SSO / SAML',
      'SLA garantizado',
      'Servidor dedicado',
      'Onboarding personalizado',
      'Account manager dedicado',
      'Facturación personalizada',
    ],
    ctaText: 'Contactar ventas',
    ctaLink: '/contact?plan=enterprise',
  },
]

export const featureComparison: PlanFeature[] = [
  {
    name: 'Cursos activos',
    free: 1,
    starter: 5,
    pro: 50,
    enterprise: 'Ilimitados',
  },
  {
    name: 'Estudiantes',
    free: 50,
    starter: 500,
    pro: 5000,
    enterprise: 'Ilimitados',
  },
  {
    name: 'Almacenamiento',
    free: '1 GB',
    starter: '10 GB',
    pro: '100 GB',
    enterprise: 'Ilimitado',
  },
  {
    name: 'Instructores',
    free: 1,
    starter: 2,
    pro: 10,
    enterprise: 'Ilimitados',
  },
  {
    name: 'Lecciones de texto',
    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Lecciones de video',
    free: false,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Quizzes y evaluaciones',
    free: false,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Certificados',
    free: 'Básicos',
    starter: 'Personalizados',
    pro: 'Personalizados',
    enterprise: 'Personalizados',
  },
  {
    name: 'Dominio personalizado',
    free: false,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Sin marca Next LMS',
    free: false,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Asistente IA',
    free: false,
    starter: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Análisis avanzados',
    free: false,
    starter: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'API Access',
    free: false,
    starter: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Integraciones',
    free: 'Básicas',
    starter: 'Estándar',
    pro: 'Premium',
    enterprise: 'Todas',
  },
  {
    name: 'SSO / SAML',
    free: false,
    starter: false,
    pro: false,
    enterprise: true,
  },
  {
    name: 'SLA garantizado',
    free: false,
    starter: false,
    pro: false,
    enterprise: true,
  },
  {
    name: 'Soporte',
    free: 'Email',
    starter: 'Prioritario',
    pro: '24/7',
    enterprise: 'Dedicado',
  },
]

export const pricingFAQs: FAQ[] = [
  {
    question: '¿Puedo cambiar de plan en cualquier momento?',
    answer:
      'Sí, puedes actualizar o degradar tu plan en cualquier momento. Si actualizas, el cambio es inmediato y se te cobrará la diferencia prorrateada. Si degradas, el cambio se aplicará al final de tu período de facturación actual.',
  },
  {
    question: '¿Hay un período de prueba gratuito?',
    answer:
      'Sí, todos los planes de pago incluyen una prueba gratuita de 14 días. No necesitas tarjeta de crédito para comenzar. Al finalizar la prueba, puedes elegir continuar con el plan o pasar al plan gratuito.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Aceptamos pagos a través de Mercado Pago, lo que incluye tarjetas de crédito, débito, transferencia bancaria y otros métodos locales disponibles en tu país.',
  },
  {
    question: '¿Puedo cancelar en cualquier momento?',
    answer:
      'Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de control. No hay contratos a largo plazo ni penalizaciones por cancelación. Tu acceso continuará hasta el final del período pagado.',
  },
  {
    question: '¿Qué pasa con mis datos si cancelo?',
    answer:
      'Si cancelas, tus datos se mantienen por 30 días en caso de que quieras reactivar tu cuenta. Después de ese período, los datos se eliminan permanentemente. Puedes exportar tus datos en cualquier momento antes de la eliminación.',
  },
  {
    question: '¿Ofrecen descuentos para ONGs o educación?',
    answer:
      'Sí, ofrecemos un 50% de descuento para organizaciones sin fines de lucro y instituciones educativas. Contacta a nuestro equipo de ventas con documentación que acredite tu organización.',
  },
  {
    question: '¿Los precios incluyen impuestos?',
    answer:
      'Los precios mostrados no incluyen impuestos. Los impuestos aplicables se calcularán según tu ubicación al momento del pago.',
  },
  {
    question: '¿Puedo pagar en mi moneda local?',
    answer:
      'Sí, a través de Mercado Pago puedes pagar en tu moneda local (ARS, MXN, BRL, CLP, COP, PEN, UYU). El monto se convertirá según el tipo de cambio del día.',
  },
]

// Constantes para Mercado Pago
export const MERCADOPAGO_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '',
  // Subscription plan IDs (se configurarán en Mercado Pago)
  subscriptionPlans: {
    STARTER_MONTHLY: process.env.MP_PLAN_STARTER_MONTHLY || '',
    STARTER_YEARLY: process.env.MP_PLAN_STARTER_YEARLY || '',
    PRO_MONTHLY: process.env.MP_PLAN_PRO_MONTHLY || '',
    PRO_YEARLY: process.env.MP_PLAN_PRO_YEARLY || '',
  },
}
```

### 1.3 Actualizar índice de tipos

Actualiza `src/types/index.ts`:

```typescript
// src/types/index.ts
export * from './pricing'
```

---

## Paso 2: Crear Componentes de Pricing

### 2.1 Componente Toggle de Período de Facturación

Crea el archivo `src/components/pricing/billing-toggle.tsx`:

```typescript
// src/components/pricing/billing-toggle.tsx
'use client'

import { cn } from '@/lib/utils'
import type { BillingPeriod } from '@/types/pricing'

interface BillingToggleProps {
  period: BillingPeriod
  onChange: (period: BillingPeriod) => void
}

export function BillingToggle({ period, onChange }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span
        className={cn(
          'text-sm font-medium transition-colors',
          period === 'monthly' ? 'text-secondary-900' : 'text-secondary-500'
        )}
      >
        Mensual
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={period === 'yearly'}
        onClick={() => onChange(period === 'monthly' ? 'yearly' : 'monthly')}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          period === 'yearly' ? 'bg-primary-600' : 'bg-secondary-300'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm',
            period === 'yearly' ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>

      <span
        className={cn(
          'text-sm font-medium transition-colors',
          period === 'yearly' ? 'text-secondary-900' : 'text-secondary-500'
        )}
      >
        Anual
      </span>

      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Ahorra 20%
      </span>
    </div>
  )
}
```

### 2.2 Componente Tarjeta de Plan

Crea el archivo `src/components/pricing/pricing-card.tsx`:

```typescript
// src/components/pricing/pricing-card.tsx
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button, Badge } from '@/components/ui'
import type { Plan, BillingPeriod } from '@/types/pricing'

interface PricingCardProps {
  plan: Plan
  billingPeriod: BillingPeriod
}

export function PricingCard({ plan, billingPeriod }: PricingCardProps) {
  const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
  const monthlyEquivalent = plan.yearlyPrice ? Math.round(plan.yearlyPrice / 12) : null

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border bg-white p-8 transition-all duration-300',
        plan.highlighted
          ? 'border-primary-500 shadow-xl shadow-primary-500/10 scale-105 z-10'
          : 'border-secondary-200 hover:border-secondary-300 hover:shadow-lg'
      )}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge variant="primary" size="lg">
            {plan.badge}
          </Badge>
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-secondary-900">{plan.name}</h3>
        <p className="mt-1 text-sm text-secondary-600">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        {price !== null ? (
          <>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-secondary-900">
                ${billingPeriod === 'yearly' ? monthlyEquivalent : price}
              </span>
              <span className="ml-2 text-secondary-500">/mes</span>
            </div>
            {billingPeriod === 'yearly' && plan.yearlyPrice && plan.yearlyPrice > 0 && (
              <p className="mt-1 text-sm text-secondary-500">
                ${plan.yearlyPrice} facturado anualmente
              </p>
            )}
            {price === 0 && (
              <p className="mt-1 text-sm text-secondary-500">Gratis para siempre</p>
            )}
          </>
        ) : (
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-secondary-900">
              Precio personalizado
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="mb-8 space-y-3 flex-grow">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-secondary-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link href={plan.ctaLink} className="mt-auto">
        <Button
          variant={plan.highlighted ? 'primary' : 'outline'}
          size="lg"
          className="w-full"
        >
          {plan.ctaText}
        </Button>
      </Link>
    </div>
  )
}
```

### 2.3 Componente Tabla de Comparación

Crea el archivo `src/components/pricing/comparison-table.tsx`:

```typescript
// src/components/pricing/comparison-table.tsx
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui'
import { featureComparison } from '@/config/pricing'
import type { PlanFeature } from '@/types/pricing'

function FeatureValue({ value }: { value: boolean | string | number }) {
  if (typeof value === 'boolean') {
    return value ? (
      <svg
        className="w-5 h-5 text-green-500 mx-auto"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        className="w-5 h-5 text-secondary-300 mx-auto"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    )
  }

  return <span className="text-sm text-secondary-900">{value}</span>
}

export function ComparisonTable() {
  const [isExpanded, setIsExpanded] = useState(false)
  const visibleFeatures = isExpanded
    ? featureComparison
    : featureComparison.slice(0, 8)

  return (
    <section className="py-20 bg-secondary-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Comparación detallada de planes
          </h2>
          <p className="text-lg text-secondary-600">
            Encuentra el plan perfecto para tus necesidades
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl border border-secondary-200 overflow-hidden">
            {/* Header */}
            <thead>
              <tr className="bg-secondary-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900 w-1/3">
                  Características
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-secondary-900">
                  Gratis
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-secondary-900">
                  Starter
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-secondary-900 bg-primary-50">
                  Pro
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-secondary-900">
                  Enterprise
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-secondary-100">
              {visibleFeatures.map((feature, index) => (
                <tr
                  key={index}
                  className={cn(
                    'transition-colors',
                    index % 2 === 0 ? 'bg-white' : 'bg-secondary-50/50'
                  )}
                >
                  <td className="px-6 py-4 text-sm text-secondary-700">
                    {feature.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <FeatureValue value={feature.free} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <FeatureValue value={feature.starter} />
                  </td>
                  <td className="px-6 py-4 text-center bg-primary-50/50">
                    <FeatureValue value={feature.pro} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <FeatureValue value={feature.enterprise} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expand/Collapse Button */}
        {featureComparison.length > 8 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {isExpanded ? 'Ver menos' : 'Ver todas las características'}
              <svg
                className={cn(
                  'w-4 h-4 transition-transform',
                  isExpanded && 'rotate-180'
                )}
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
          </div>
        )}
      </Container>
    </section>
  )
}
```

### 2.4 Componente FAQ Accordion

Crea el archivo `src/components/pricing/faq-section.tsx`:

```typescript
// src/components/pricing/faq-section.tsx
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui'
import { pricingFAQs } from '@/config/pricing'

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-secondary-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-base font-medium text-secondary-900">
          {question}
        </span>
        <svg
          className={cn(
            'h-5 w-5 text-secondary-500 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
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
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        )}
      >
        <p className="text-secondary-600">{answer}</p>
      </div>
    </div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20">
      <Container size="md">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-lg text-secondary-600">
            ¿Tienes dudas? Aquí encontrarás las respuestas más comunes
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-secondary-200 px-6">
          {pricingFAQs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-secondary-600 mb-4">
            ¿No encuentras lo que buscas?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700"
          >
            Contacta a nuestro equipo
            <svg
              className="w-4 h-4"
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
          </a>
        </div>
      </Container>
    </section>
  )
}
```

### 2.5 Componente Principal de Pricing

Crea el archivo `src/components/pricing/pricing-section.tsx`:

```typescript
// src/components/pricing/pricing-section.tsx
'use client'

import { useState } from 'react'
import { Container } from '@/components/ui'
import { BillingToggle } from './billing-toggle'
import { PricingCard } from './pricing-card'
import { plans } from '@/config/pricing'
import type { BillingPeriod } from '@/types/pricing'

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')

  return (
    <section className="py-20 lg:py-32">
      <Container>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            Precios
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 mt-3 mb-4">
            Planes simples, precios transparentes
          </h1>
          <p className="text-lg text-secondary-600 mb-8">
            Elige el plan que mejor se adapte a tus necesidades. Todos incluyen
            14 días de prueba gratis.
          </p>

          {/* Billing Toggle */}
          <BillingToggle period={billingPeriod} onChange={setBillingPeriod} />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingPeriod={billingPeriod}
            />
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-secondary-600">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Pagos seguros con Mercado Pago</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-600">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Cancela en cualquier momento</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-600">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Soporte incluido en todos los planes</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
```

### 2.6 Crear índice de componentes de pricing

Crea el archivo `src/components/pricing/index.ts`:

```typescript
// src/components/pricing/index.ts
export { BillingToggle } from './billing-toggle'
export { PricingCard } from './pricing-card'
export { PricingSection } from './pricing-section'
export { ComparisonTable } from './comparison-table'
export { FAQSection } from './faq-section'
```

---

## Paso 3: Crear la Página de Pricing

### 3.1 Crear la página

Crea el archivo `src/app/pricing/page.tsx`:

```typescript
// src/app/pricing/page.tsx
import { Header, Footer, CTA } from '@/components/landing'
import {
  PricingSection,
  ComparisonTable,
  FAQSection,
} from '@/components/pricing'

export const metadata = {
  title: 'Precios | Next LMS',
  description:
    'Planes flexibles para creadores, academias y empresas. Comienza gratis y escala cuando lo necesites.',
}

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <PricingSection />
        <ComparisonTable />
        <FAQSection />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
```

---

## Paso 4: Preparar Integración con Mercado Pago

### 4.1 Instalar SDK de Mercado Pago

```bash
npm install mercadopago
```

### 4.2 Crear tipos para Mercado Pago

Crea el archivo `src/types/mercadopago.ts`:

```typescript
// src/types/mercadopago.ts

export interface MercadoPagoPreference {
  id: string
  init_point: string
  sandbox_init_point: string
}

export interface MercadoPagoItem {
  id: string
  title: string
  description?: string
  quantity: number
  unit_price: number
  currency_id: string
}

export interface MercadoPagoPayer {
  email: string
  name?: string
  surname?: string
}

export interface MercadoPagoSubscription {
  id: string
  payer_id: number
  payer_email: string
  status: 'pending' | 'authorized' | 'paused' | 'cancelled'
  preapproval_plan_id: string
  init_point: string
  sandbox_init_point: string
  date_created: string
}

export interface MercadoPagoWebhookPayload {
  id: string
  live_mode: boolean
  type: 'payment' | 'subscription_preapproval' | 'subscription_authorized_payment'
  date_created: string
  application_id: string
  user_id: string
  version: number
  api_version: string
  action: string
  data: {
    id: string
  }
}

export type PaymentStatus =
  | 'pending'
  | 'approved'
  | 'authorized'
  | 'in_process'
  | 'in_mediation'
  | 'rejected'
  | 'cancelled'
  | 'refunded'
  | 'charged_back'
```

### 4.3 Crear cliente de Mercado Pago

Crea el archivo `src/lib/mercadopago.ts`:

```typescript
// src/lib/mercadopago.ts
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

// Verificar que tenemos el access token
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

if (!accessToken && process.env.NODE_ENV === 'production') {
  console.warn('[MercadoPago] ACCESS_TOKEN not configured')
}

// Configuración del cliente
const client = new MercadoPagoConfig({
  accessToken: accessToken || 'TEST-ACCESS-TOKEN',
  options: {
    timeout: 5000,
  },
})

// Instancias de los servicios
export const preferenceClient = new Preference(client)
export const paymentClient = new Payment(client)

// Helper para crear una preferencia de pago
export async function createPaymentPreference(data: {
  items: Array<{
    id: string
    title: string
    quantity: number
    unit_price: number
    currency_id?: string
  }>
  payer: {
    email: string
    name?: string
  }
  externalReference: string
  notificationUrl?: string
}) {
  const preference = await preferenceClient.create({
    body: {
      items: data.items.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: item.currency_id || 'USD',
      })),
      payer: {
        email: data.payer.email,
        name: data.payer.name,
      },
      external_reference: data.externalReference,
      notification_url: data.notificationUrl,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
      },
      auto_return: 'approved',
    },
  })

  return preference
}

// Helper para obtener información de un pago
export async function getPaymentInfo(paymentId: string) {
  const payment = await paymentClient.get({ id: paymentId })
  return payment
}
```

### 4.4 Crear modelo de suscripción en Prisma

Agrega estos modelos al archivo `prisma/schema.prisma`:

```prisma
// Agregar al final de prisma/schema.prisma

// Suscripción
model Subscription {
  id                   String             @id @default(cuid())
  tenantId             String
  tenant               Tenant             @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  plan                 Plan
  status               SubscriptionStatus @default(ACTIVE)
  billingPeriod        BillingPeriod      @default(MONTHLY)

  // Mercado Pago
  mpSubscriptionId     String?            @unique
  mpPayerId            String?

  // Fechas
  currentPeriodStart   DateTime
  currentPeriodEnd     DateTime
  cancelledAt          DateTime?
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  // Pagos
  payments             Payment[]

  @@map("subscriptions")
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  PAST_DUE
  TRIALING
  PAUSED
}

enum BillingPeriod {
  MONTHLY
  YEARLY
}

// Pago
model Payment {
  id               String        @id @default(cuid())
  subscriptionId   String
  subscription     Subscription  @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  // Mercado Pago
  mpPaymentId      String        @unique
  mpStatus         String

  amount           Decimal       @db.Decimal(10, 2)
  currency         String        @default("USD")

  paidAt           DateTime?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  @@map("payments")
}
```

**Nota:** También necesitas agregar la relación en el modelo Tenant:

```prisma
// En el modelo Tenant, agregar:
model Tenant {
  // ... campos existentes ...

  subscriptions Subscription[]

  // ... resto del modelo ...
}
```

### 4.5 Actualizar variables de entorno

Agrega a `.env.local`:

```env
# ===========================================
# MERCADO PAGO
# ===========================================
# Obtener en: https://www.mercadopago.com.ar/developers/panel
MERCADOPAGO_ACCESS_TOKEN="your-access-token"
MERCADOPAGO_PUBLIC_KEY="your-public-key"

# Webhook secret para validar notificaciones
MERCADOPAGO_WEBHOOK_SECRET="your-webhook-secret"

# IDs de planes de suscripción (crear en panel de MP)
MP_PLAN_STARTER_MONTHLY=""
MP_PLAN_STARTER_YEARLY=""
MP_PLAN_PRO_MONTHLY=""
MP_PLAN_PRO_YEARLY=""

# URL pública de la aplicación (para webhooks)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4.6 Crear placeholder para página de checkout

Crea el archivo `src/app/checkout/page.tsx`:

```typescript
// src/app/checkout/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Header, Footer } from '@/components/landing'
import { Container, Card, CardContent, Button } from '@/components/ui'
import Link from 'next/link'

export const metadata = {
  title: 'Checkout | Next LMS',
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { plan?: string; period?: string }
}) {
  const session = await auth()

  // Si no está autenticado, redirigir a login
  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=/checkout?plan=${searchParams.plan}`)
  }

  const plan = searchParams.plan || 'starter'
  const period = searchParams.period || 'monthly'

  return (
    <>
      <Header />
      <main className="pt-32 pb-20">
        <Container size="sm">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
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

              <h1 className="text-2xl font-bold text-secondary-900 mb-4">
                Checkout en construcción
              </h1>

              <p className="text-secondary-600 mb-6">
                Estamos trabajando en la integración con Mercado Pago.
                Pronto podrás suscribirte al plan <strong>{plan}</strong> ({period}).
              </p>

              <div className="space-y-3">
                <Link href="/pricing">
                  <Button variant="primary" className="w-full">
                    Volver a precios
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    Ir al dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Container>
      </main>
      <Footer />
    </>
  )
}
```

### 4.7 Crear páginas de resultado de pago

Crea `src/app/checkout/success/page.tsx`:

```typescript
// src/app/checkout/success/page.tsx
import Link from 'next/link'
import { Header, Footer } from '@/components/landing'
import { Container, Card, CardContent, Button } from '@/components/ui'

export const metadata = {
  title: 'Pago exitoso | Next LMS',
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-20">
        <Container size="sm">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
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

              <h1 className="text-2xl font-bold text-secondary-900 mb-4">
                ¡Pago exitoso!
              </h1>

              <p className="text-secondary-600 mb-6">
                Tu suscripción ha sido activada correctamente.
                Ya puedes comenzar a crear tus cursos.
              </p>

              <Link href="/dashboard">
                <Button variant="primary" size="lg">
                  Ir al dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Container>
      </main>
      <Footer />
    </>
  )
}
```

Crea `src/app/checkout/failure/page.tsx`:

```typescript
// src/app/checkout/failure/page.tsx
import Link from 'next/link'
import { Header, Footer } from '@/components/landing'
import { Container, Card, CardContent, Button } from '@/components/ui'

export const metadata = {
  title: 'Error en el pago | Next LMS',
}

export default function CheckoutFailurePage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-20">
        <Container size="sm">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
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

              <h1 className="text-2xl font-bold text-secondary-900 mb-4">
                Error en el pago
              </h1>

              <p className="text-secondary-600 mb-6">
                No pudimos procesar tu pago. Por favor, verifica los datos
                de tu tarjeta e intenta nuevamente.
              </p>

              <div className="space-y-3">
                <Link href="/pricing">
                  <Button variant="primary" className="w-full">
                    Intentar de nuevo
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="w-full">
                    Contactar soporte
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Container>
      </main>
      <Footer />
    </>
  )
}
```

Crea `src/app/checkout/pending/page.tsx`:

```typescript
// src/app/checkout/pending/page.tsx
import Link from 'next/link'
import { Header, Footer } from '@/components/landing'
import { Container, Card, CardContent, Button } from '@/components/ui'

export const metadata = {
  title: 'Pago pendiente | Next LMS',
}

export default function CheckoutPendingPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-20">
        <Container size="sm">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-secondary-900 mb-4">
                Pago pendiente
              </h1>

              <p className="text-secondary-600 mb-6">
                Tu pago está siendo procesado. Te notificaremos por email
                cuando se confirme. Esto puede tomar unos minutos.
              </p>

              <div className="space-y-3">
                <Link href="/dashboard">
                  <Button variant="primary" className="w-full">
                    Ir al dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Container>
      </main>
      <Footer />
    </>
  )
}
```

---

## Paso 5: Actualizar Navegación del Header

### 5.1 Actualizar el Header para incluir link a Precios

Actualiza `src/components/landing/header.tsx` para asegurar que el link de Precios funcione:

```typescript
// En src/components/landing/header.tsx
// La navegación ya incluye Precios, pero asegúrate de que apunte a /pricing

const navigation = [
  { name: 'Características', href: '/#features' },
  { name: 'Cómo funciona', href: '/#how-it-works' },
  { name: 'Testimonios', href: '/#testimonials' },
  { name: 'Precios', href: '/pricing' },
]
```

---

## Paso 6: Ejecutar Migraciones

### 6.1 Crear migración para los nuevos modelos

```bash
# Crear migración
npx prisma migrate dev --name add_subscriptions_payments

# Regenerar cliente
npx prisma generate
```

---

## Paso 7: Verificar Todo

### 7.1 Estructura final de archivos nuevos

```
src/
├── app/
│   ├── pricing/
│   │   └── page.tsx                 ✅ Página de precios
│   └── checkout/
│       ├── page.tsx                 ✅ Página de checkout (placeholder)
│       ├── success/
│       │   └── page.tsx             ✅ Pago exitoso
│       ├── failure/
│       │   └── page.tsx             ✅ Pago fallido
│       └── pending/
│           └── page.tsx             ✅ Pago pendiente
├── components/
│   └── pricing/
│       ├── billing-toggle.tsx       ✅ Toggle mensual/anual
│       ├── pricing-card.tsx         ✅ Tarjeta de plan
│       ├── pricing-section.tsx      ✅ Sección principal
│       ├── comparison-table.tsx     ✅ Tabla de comparación
│       ├── faq-section.tsx          ✅ Sección FAQ
│       └── index.ts                 ✅ Exportaciones
├── config/
│   └── pricing.ts                   ✅ Configuración de planes
├── lib/
│   └── mercadopago.ts               ✅ Cliente de Mercado Pago
├── types/
│   ├── pricing.ts                   ✅ Tipos de pricing
│   ├── mercadopago.ts               ✅ Tipos de Mercado Pago
│   └── index.ts                     ✅ Actualizado
└── prisma/
    └── schema.prisma                ✅ Modelos Subscription y Payment
```

### 7.2 Probar la página de precios

```bash
npm run dev
```

Visita http://localhost:3000/pricing y verifica:

- [ ] Header con navegación
- [ ] Título y descripción
- [ ] Toggle mensual/anual funciona
- [ ] Tarjetas de planes con precios correctos
- [ ] Plan Pro destacado con badge
- [ ] Tabla de comparación expandible
- [ ] FAQ accordion funciona
- [ ] CTA y Footer

### 7.3 Probar navegación

- [ ] Click en "Precios" desde landing → `/pricing`
- [ ] Click en "Comenzar" en un plan → `/auth/register?plan=xxx`
- [ ] Click en "Contactar ventas" → `/contact?plan=enterprise`

---

## Resumen de la Sesión 2.2

### ✅ Lo que aprendimos:

1. **Diseño de páginas de pricing** - Estructura y flujo de conversión
2. **Componentes interactivos** - Toggle, accordion, tablas
3. **Configuración centralizada** - Planes y características en config
4. **Preparación para pagos** - SDK de Mercado Pago
5. **Modelos de suscripción** - Prisma schemas para billing

### ✅ Tareas completadas:

- [x] Diseñar página de pricing
- [x] Crear componente de tarjetas de planes
- [x] Implementar comparador de features
- [x] Preparar integración con Mercado Pago

### ✅ Componentes creados:

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| BillingToggle | `components/pricing/` | Switch mensual/anual |
| PricingCard | `components/pricing/` | Tarjeta de plan individual |
| PricingSection | `components/pricing/` | Sección completa de precios |
| ComparisonTable | `components/pricing/` | Tabla comparativa expandible |
| FAQSection | `components/pricing/` | Accordion de preguntas |

### ✅ Configuración creada:

| Archivo | Descripción |
|---------|-------------|
| `config/pricing.ts` | Planes, features, FAQs, config MP |
| `types/pricing.ts` | Tipos para planes y billing |
| `types/mercadopago.ts` | Tipos para Mercado Pago |
| `lib/mercadopago.ts` | Cliente SDK de Mercado Pago |

### ✅ Modelos de BD agregados:

| Modelo | Descripción |
|--------|-------------|
| Subscription | Suscripciones de tenants |
| Payment | Historial de pagos |

### 📝 Variables de entorno nuevas:

```env
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_WEBHOOK_SECRET=
MP_PLAN_STARTER_MONTHLY=
MP_PLAN_STARTER_YEARLY=
MP_PLAN_PRO_MONTHLY=
MP_PLAN_PRO_YEARLY=
NEXT_PUBLIC_APP_URL=
```

---

## Próxima Sesión: 2.3 - Registro de Tenants

En la siguiente sesión:
- Formulario de registro de empresa/organización
- Validación de subdominio único
- Proceso de onboarding inicial
- Email de bienvenida

---

**Estado de la Sesión 2.2:** ✅ Completada
