import type { BookingStatus } from './calendarTypes'

export function getStatusColor(status: BookingStatus | string): string {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-success/15 text-success border-success/20'
    case 'PENDING':
      return 'bg-warning/15 text-warning border-warning/20'
    case 'CANCELLED':
      return 'bg-destructive/10 text-destructive border-destructive/20'
    case 'COMPLETED':
      return 'bg-info/15 text-info border-info/20'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function getStatusLabel(status: BookingStatus | string): string {
  switch (status) {
    case 'CONFIRMED':
      return 'Confirmada'
    case 'PENDING':
      return 'Pendiente'
    case 'COMPLETED':
      return 'Completada'
    case 'CANCELLED':
      return 'Cancelada'
    default:
      return status
  }
}
