import Link from 'next/link'
import { Section } from '@/components/layout'
import { ROUTES } from '@/config/routes'

interface DashboardPrioritySectionProps {
  contactsCount: number
  pendingBookings: number
  pendingTestimonials: number
  deletedCount: number
}

type PriorityItem = {
  label: string
  detail: string
  value: number
  icon: string
  href: string
  tone: string
}

export default function DashboardPrioritySection({
  contactsCount,
  pendingBookings,
  pendingTestimonials,
  deletedCount,
}: DashboardPrioritySectionProps) {
  const items: PriorityItem[] = [
    {
      label: 'Mensajes sin leer',
      detail: 'Responder cuanto antes',
      value: contactsCount,
      icon: '📬',
      href: ROUTES.admin.messages,
      tone: 'border-warning/40 bg-warning/10',
    },
    {
      label: 'Reservas pendientes',
      detail: 'Confirmar o reprogramar',
      value: pendingBookings,
      icon: '📅',
      href: ROUTES.admin.calendar,
      tone: 'border-primary/30 bg-primary/10',
    },
    {
      label: 'Testimonios pendientes',
      detail: 'Revisar antes de publicar',
      value: pendingTestimonials,
      icon: '⭐',
      href: ROUTES.admin.testimonials,
      tone: 'border-info/40 bg-info/10',
    },
    {
      label: 'Elementos en papelera',
      detail: 'Recuperar o dejar vencer',
      value: deletedCount,
      icon: '🗑️',
      href: ROUTES.admin.trash,
      tone: 'border-destructive/30 bg-destructive/10',
    },
  ].filter((item) => item.value > 0)

  return (
    <Section title="Qué necesita atención">
      {items.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex min-h-28 items-center gap-4 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${item.tone}`}
            >
              <span className="text-3xl transition-transform group-hover:scale-110">
                {item.icon}
              </span>
              <span className="min-w-0">
                <span className="text-foreground block text-lg font-bold">{item.value}</span>
                <span className="text-foreground block font-semibold">{item.label}</span>
                <span className="text-muted-foreground block text-sm">{item.detail}</span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border-success/30 bg-success/10 rounded-2xl border p-5">
          <p className="text-foreground font-semibold">Todo al día.</p>
          <p className="text-muted-foreground mt-1 text-sm">
            No hay mensajes, reservas, testimonios ni papelera que requieran atención ahora.
          </p>
        </div>
      )}
    </Section>
  )
}
