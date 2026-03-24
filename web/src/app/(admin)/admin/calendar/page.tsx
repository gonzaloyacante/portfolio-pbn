import CalendarViewClient from '@/components/features/contact/bookings/CalendarViewClient'
import { PageHeader } from '@/components/layout'

export const dynamic = 'force-dynamic'

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="📅 Calendario de Reservas"
        description="Gestiona tus citas y disponibilidad"
      />
      <CalendarViewClient />
    </div>
  )
}
