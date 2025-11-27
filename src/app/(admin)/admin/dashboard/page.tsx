import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function DashboardPage() {
  const [projectsCount, categoriesCount, testimonialsCount, deletedProjectsCount] =
    await Promise.all([
      prisma.project.count({ where: { isDeleted: false } }),
      prisma.category.count(),
      prisma.testimonial.count(),
      prisma.project.count({ where: { isDeleted: true } }),
    ])

  const stats = [
    {
      label: 'Proyectos Activos',
      value: projectsCount,
      icon: '🎨',
      href: '/admin/gestion/projects',
    },
    { label: 'Categorías', value: categoriesCount, icon: '📁', href: '/admin/gestion/categories' },
    { label: 'Testimonios', value: testimonialsCount, icon: '💬', href: '/admin/testimonios' },
    { label: 'Papelera', value: deletedProjectsCount, icon: '🗑️', href: '/admin/gestion/projects' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-script text-primary mb-2 text-4xl">Panel de Administración</h1>
        <p className="text-gray-600">Bienvenida de nuevo, Paola 👋</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-4xl">{stat.icon}</span>
              <span className="text-primary text-3xl font-bold">{stat.value}</span>
            </div>
            <h3 className="font-medium text-gray-600">{stat.label}</h3>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Accesos Rápidos</h2>
          <div className="space-y-2">
            <Link
              href="/admin/gestion/projects"
              className="text-primary block rounded-md px-4 py-2 transition-colors hover:bg-gray-50"
            >
              ➕ Crear Nuevo Proyecto
            </Link>
            <Link
              href="/admin/gestion/categories"
              className="text-primary block rounded-md px-4 py-2 transition-colors hover:bg-gray-50"
            >
              ➕ Crear Nueva Categoría
            </Link>
            <Link
              href="/admin/testimonios"
              className="text-primary block rounded-md px-4 py-2 transition-colors hover:bg-gray-50"
            >
              ➕ Agregar Testimonio
            </Link>
            <Link
              href="/admin/configuracion"
              className="text-primary block rounded-md px-4 py-2 transition-colors hover:bg-gray-50"
            >
              ⚙️ Configuración del Sitio
            </Link>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Enlaces Útiles</h2>
          <div className="space-y-2">
            <Link
              href="/"
              target="_blank"
              className="text-primary block rounded-md px-4 py-2 transition-colors hover:bg-gray-50"
            >
              🌐 Ver Sitio Público
            </Link>
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="text-primary block rounded-md px-4 py-2 transition-colors hover:bg-gray-50"
            >
              🗺️ Ver Sitemap
            </Link>
            <Link
              href="/admin/analitica"
              className="text-primary block rounded-md px-4 py-2 transition-colors hover:bg-gray-50"
            >
              📊 Ver Analítica
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
