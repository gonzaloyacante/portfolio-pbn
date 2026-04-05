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
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
  CONFIRMED: {
    label: 'Confirmada',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  },
  IN_PROGRESS: {
    label: 'En curso',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  },
  COMPLETED: {
    label: 'Completada',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
  CANCELLED: {
    label: 'Cancelada',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  },
}

export default function RecentBookingsWidget({ bookings }: RecentBookingsWidgetProps) {
  if (bookings.length === 0) return null

  return (
    <div className="bg-card border-border rounded-xl border p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-xl font-bold">📅 Reservas Recientes</h2>
        <Link
          href={ROUTES.admin.calendar}
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          Ver todas →
        </Link>
      </div>
      <div className="space-y-3">
        {bookings.map((booking) => {
          const status = STATUS_LABELS[booking.status] ?? {
            label: booking.status,
            className: 'bg-gray-100 text-gray-700',
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
    </div>
  )
}
