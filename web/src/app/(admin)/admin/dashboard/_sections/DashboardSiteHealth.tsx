import Link from 'next/link'
import { Section } from '@/components/layout'
import { ROUTES } from '@/config/routes'

interface DashboardSiteHealthProps {
  imagesCount: number
  categoriesCount: number
  servicesCount: number
  categoriesWithoutImages: number
  servicesWithoutImage: number
}

export default function DashboardSiteHealth({
  imagesCount,
  categoriesCount,
  servicesCount,
  categoriesWithoutImages,
  servicesWithoutImage,
}: DashboardSiteHealthProps) {
  const issues = [
    imagesCount === 0
      ? {
          label: 'Todavía no hay imágenes cargadas.',
          href: ROUTES.admin.categories,
        }
      : null,
    categoriesCount === 0
      ? {
          label: 'Todavía no hay categorías de portfolio.',
          href: ROUTES.admin.newCategory,
        }
      : null,
    servicesCount === 0
      ? {
          label: 'Todavía no hay servicios publicados.',
          href: ROUTES.admin.newService,
        }
      : null,
    categoriesWithoutImages > 0
      ? {
          label: `${categoriesWithoutImages} categoría${
            categoriesWithoutImages > 1 ? 's' : ''
          } sin imagen visible.`,
          href: ROUTES.admin.categories,
        }
      : null,
    servicesWithoutImage > 0
      ? {
          label: `${servicesWithoutImage} servicio${servicesWithoutImage > 1 ? 's' : ''} sin imagen.`,
          href: ROUTES.admin.services,
        }
      : null,
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <Section title="Estado de la web">
      {issues.length > 0 ? (
        <div className="space-y-3">
          {issues.map((issue) => (
            <Link
              key={issue.label}
              href={issue.href}
              className="border-warning/35 bg-warning/10 text-foreground hover:border-warning/60 block rounded-2xl border p-4 text-sm font-medium transition-colors"
            >
              {issue.label}
            </Link>
          ))}
        </div>
      ) : (
        <div className="border-success/30 bg-success/10 rounded-2xl border p-5">
          <p className="text-foreground font-semibold">La web está lista para mostrarse.</p>
          <p className="text-muted-foreground mt-1 text-sm">
            El contenido principal tiene imágenes y secciones básicas cargadas.
          </p>
        </div>
      )}
    </Section>
  )
}
