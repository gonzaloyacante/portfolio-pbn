import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/security-server'
import { getBookingForEdit } from '@/actions/cms/bookings'
import { getServices } from '@/actions/cms/services'
import { Section } from '@/components/layout'
import BookingEditForm from '@/components/features/contact/bookings/BookingEditForm'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Editar Reserva #${id.slice(0, 8)} | Admin` }
}

export default async function BookingEditPage({ params }: Props) {
  await requireAdmin()
  const { id } = await params

  const [booking, services] = await Promise.all([
    getBookingForEdit(id).catch(() => null),
    getServices(),
  ])

  if (!booking) notFound()

  const dateLabel = format(new Date(booking.date), "EEEE d 'de' MMMM yyyy, HH:mm 'hs'", {
    locale: es,
  })

  return (
    <div className="mx-auto max-w-3xl">
      <Section title={`Editar Reserva — ${booking.clientName}`}>
        <p className="text-muted-foreground mb-6 text-sm">{dateLabel}</p>
        <BookingEditForm
          booking={booking}
          services={services.map((s) => ({ id: s.id, name: s.name }))}
        />
      </Section>
    </div>
  )
}
