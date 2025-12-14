import { prisma } from '@/lib/db'
import { StatCard, QuickLink, Section } from '@/components/admin'

export default async function DashboardPage() {
  const [projectsCount, categoriesCount, testimonialsCount, deletedCount] = await Promise.all([
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
    { label: 'Papelera', value: deletedCount, icon: '🗑️', href: '/admin/gestion/projects' },
  ]

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-script text-primary mb-2 text-4xl">Panel de Administración</h1>
        <p className="text-gray-600 dark:text-gray-400">Bienvenida de nuevo, Paola 👋</p>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section title="Accesos Rápidos">
          <div className="space-y-2">
            <QuickLink href="/admin/gestion/projects" icon="➕" label="Crear Nuevo Proyecto" />
            <QuickLink href="/admin/gestion/categories" icon="➕" label="Crear Nueva Categoría" />
            <QuickLink href="/admin/testimonios" icon="➕" label="Agregar Testimonio" />
            <QuickLink href="/admin/configuracion" icon="⚙️" label="Configuración del Sitio" />
          </div>
        </Section>

        <Section title="Enlaces Útiles">
          <div className="space-y-2">
            <QuickLink href="/" icon="🌐" label="Ver Sitio Público" external />
            <QuickLink href="/sitemap.xml" icon="🗺️" label="Ver Sitemap" external />
            <QuickLink href="/admin/analitica" icon="📊" label="Ver Analítica" />
          </div>
        </Section>
      </div>
    </div>
  )
}
