import { prisma } from '@/lib/db'
import { StatCard, QuickLink, Section } from '@/components/admin'
import { auth } from '@/lib/auth'
import { getSiteConfig } from '@/actions/settings.actions'

export default async function DashboardPage() {
  const [
    session,
    siteConfig,
    projectsCount,
    categoriesCount,
    testimonialsCount,
    deletedCount,
    contactsCount,
  ] = await Promise.all([
    auth(),
    getSiteConfig(),
    prisma.project.count({ where: { isDeleted: false } }),
    prisma.category.count(),
    prisma.testimonial.count(),
    prisma.project.count({ where: { isDeleted: true } }),
    prisma.contact.count({ where: { isRead: false } }),
  ])

  const userName = session?.user?.name || 'Administrador'

  const stats = [
    {
      label: 'Proyectos Activos',
      value: projectsCount,
      icon: '🎨',
      href: '/admin/gestion/projects',
    },
    {
      label: 'Categorías',
      value: categoriesCount,
      icon: '📁',
      href: '/admin/gestion/categories',
    },
    {
      label: 'Testimonios',
      value: testimonialsCount,
      icon: '💬',
      href: '/admin/testimonios',
    },
    {
      label: 'Mensajes Sin Leer',
      value: contactsCount,
      icon: '📬',
      href: '/admin/contactos',
    },
  ]

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-script text-primary mb-2 text-4xl">Panel de Administración</h1>
        <p className="text-gray-600 dark:text-gray-400">Bienvenid@ de nuevo, {userName} 👋</p>
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
            <QuickLink href="/admin/tema" icon="🎨" label="Editar Diseño del Sitio" />
          </div>
        </Section>

        <Section title="Enlaces Útiles">
          <div className="space-y-2">
            <QuickLink href="/" icon="🌐" label="Ver Sitio Público" external />
            <QuickLink href="/admin/analitica" icon="📊" label="Ver Analítica Completa" />
            <QuickLink href="/admin/configuracion" icon="⚙️" label="Configuración General" />
            {deletedCount > 0 && (
              <QuickLink
                href="/admin/gestion/projects?deleted=true"
                icon="🗑️"
                label={`Papelera (${deletedCount} proyectos)`}
              />
            )}
          </div>
        </Section>
      </div>

      {/* Resumen del sitio */}
      {siteConfig && (
        <div className="mt-8">
          <Section title="Estado del Sitio">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Color Principal</p>
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded-full border"
                    style={{ backgroundColor: siteConfig.primaryColor }}
                  />
                  <p className="font-mono text-sm text-gray-900 dark:text-white">
                    {siteConfig.primaryColor}
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Color de Fondo</p>
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded-full border"
                    style={{ backgroundColor: siteConfig.bgColor }}
                  />
                  <p className="font-mono text-sm text-gray-900 dark:text-white">
                    {siteConfig.bgColor}
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Imagen Hero</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {siteConfig.heroImageUrl ? '✅ Configurada' : '❌ Sin configurar'}
                </p>
              </div>
            </div>
          </Section>
        </div>
      )}
    </div>
  )
}
