import Link from 'next/link'
import { Section } from '@/components/layout'
import { ROUTES } from '@/config/routes'

const ACTIONS = [
  {
    label: 'Editar inicio',
    detail: 'Portada, textos y presentación',
    href: ROUTES.admin.home,
    icon: '🏠',
  },
  {
    label: 'Actualizar portfolio',
    detail: 'Categorías e imágenes',
    href: ROUTES.admin.categories,
    icon: '🎨',
  },
  {
    label: 'Revisar servicios',
    detail: 'Precios, duración y disponibilidad',
    href: ROUTES.admin.services,
    icon: '💄',
  },
  {
    label: 'Datos de contacto',
    detail: 'Email, redes y formulario',
    href: ROUTES.admin.contacts,
    icon: '📱',
  },
] as const

export default function DashboardQuickActions() {
  return (
    <Section title="Accesos rápidos" className="h-full">
      <div className="grid gap-3 sm:grid-cols-2">
        {ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="border-border bg-background/50 hover:border-primary/40 flex min-h-24 items-center gap-3 rounded-2xl border p-4 transition-all hover:shadow-sm active:scale-[0.99]"
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="min-w-0">
              <span className="text-foreground block font-semibold">{action.label}</span>
              <span className="text-muted-foreground block text-sm leading-snug">
                {action.detail}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </Section>
  )
}
