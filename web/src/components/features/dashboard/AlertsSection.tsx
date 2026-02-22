import Link from 'next/link'
import { Section } from '@/components/layout'
import { ROUTES } from '@/config/routes'

interface AlertsSectionProps {
  contactsCount: number
  pendingTestimonials: number
  deletedCount: number
}

export default function AlertsSection({
  contactsCount,
  pendingTestimonials,
  deletedCount,
}: AlertsSectionProps) {
  if (!contactsCount && !pendingTestimonials && !deletedCount) return null

  return (
    <Section title="⚡ Requiere tu atención">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {contactsCount > 0 && (
          <Link
            href={ROUTES.admin.contacts}
            className="group bg-card flex cursor-pointer items-center gap-3 rounded-2xl border border-yellow-400/50 p-4 transition-all duration-200 hover:scale-[1.02] hover:border-yellow-400 hover:shadow-md active:scale-[0.98]"
          >
            <span className="text-3xl transition-transform group-hover:scale-110">📬</span>
            <div>
              <p className="text-foreground font-bold">
                {contactsCount} mensaje{contactsCount > 1 ? 's' : ''} nuevo
                {contactsCount > 1 ? 's' : ''}
              </p>
              <p className="text-muted-foreground text-sm">Responder para mejor conversión</p>
            </div>
          </Link>
        )}

        {pendingTestimonials > 0 && (
          <Link
            href={ROUTES.admin.testimonials}
            className="group bg-card flex cursor-pointer items-center gap-3 rounded-2xl border border-blue-400/50 p-4 transition-all duration-200 hover:scale-[1.02] hover:border-blue-400 hover:shadow-md active:scale-[0.98]"
          >
            <span className="text-3xl transition-transform group-hover:scale-110">⭐</span>
            <div>
              <p className="text-foreground font-bold">
                {pendingTestimonials} testimonio{pendingTestimonials > 1 ? 's' : ''} pendiente
                {pendingTestimonials > 1 ? 's' : ''}
              </p>
              <p className="text-muted-foreground text-sm">Esperando aprobación</p>
            </div>
          </Link>
        )}

        {deletedCount > 0 && (
          <Link
            href={ROUTES.admin.trash}
            className="group bg-card flex cursor-pointer items-center gap-3 rounded-2xl border border-red-400/50 p-4 transition-all duration-200 hover:scale-[1.02] hover:border-red-400 hover:shadow-md active:scale-[0.98]"
          >
            <span className="text-3xl transition-transform group-hover:scale-110">🗑️</span>
            <div>
              <p className="text-foreground font-bold">{deletedCount} en papelera</p>
              <p className="text-muted-foreground text-sm">Se borrarán en 30 días</p>
            </div>
          </Link>
        )}
      </div>
    </Section>
  )
}
