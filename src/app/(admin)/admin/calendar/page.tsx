import CalendarView from '@/components/admin/bookings/CalendarView'

export const dynamic = 'force-dynamic'

export default function CalendarPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-foreground text-3xl font-bold">Calendario de Reservas</h1>
        <p className="text-muted-foreground">Gestiona tus citas y disponibilidad</p>
      </div>

      <CalendarView />
    </div>
  )
}
