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