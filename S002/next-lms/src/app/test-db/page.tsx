import { prisma } from '@/lib/prisma'

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