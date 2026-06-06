import Link from 'next/link'
import { ROUTES } from '@/config/routes'

interface RecentBooking {
  id: string
  clientName: string
  date: Date
  status: string
  service: { name: string }
}

interface RecentBookingsWidgetProps {
  bookings: RecentBooking[]
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: 'Pendiente',
    className: 'bg-warning/10 text-warning',
  },
  CONFIRMED: {
    label: 'Confirmada',
    className: 'bg-success/10 text-success',
  },
  IN_PROGRESS: {
    label: 'En curso',
    className: 'bg-info/10 text-info',
  },
  COMPLETED: {
    label: 'Completada',
    className: 'bg-muted text-muted-foreground',
  },
  CANCELLED: {
    label: 'Cancelada',
    className: 'bg-destructive/10 text-destructive',
  },
}

export default function RecentBookingsWidget({ bookings }: RecentBookingsWidgetProps) {
  return (
    <div className="bg-card border-border h-full rounded-xl border p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-xl font-bold">Próximos trabajos</h2>
        <Link
          href={ROUTES.admin.calendar}
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          Ver todas →
        </Link>
      </div>
      {bookings.length === 0 ? (
        <div className="border-border bg-muted/20 rounded-2xl border border-dashed p-5">
          <p className="text-foreground font-semibold">No hay trabajos próximos cargados.</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Cuando haya reservas pendientes o confirmadas, van a aparecer acá.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const status = STATUS_LABELS[booking.status] ?? {
              label: booking.status,
              className: 'bg-muted text-muted-foreground',
            }
            const formattedDate = new Intl.DateTimeFormat('es-AR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }).format(new Date(booking.date))

            return (
              <Link
                key={booking.id}
                href={ROUTES.admin.calendar}
                className="bg-card hover:border-primary/30 flex items-center justify-between gap-4 rounded-2xl border border-transparent p-4 transition-all duration-200 hover:shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate font-semibold">{booking.clientName}</p>
                  <p className="text-muted-foreground truncate text-sm">{booking.service.name}</p>
                  <p className="text-muted-foreground text-xs">{formattedDate}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                >
                  {status.label}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
