'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CheckSquare, Square } from 'lucide-react'
import { Button } from '@/components/ui'
import { getStatusColor, getStatusLabel } from './calendarUtils'
import type { Booking, BookingStatus } from './calendarTypes'

interface CalendarListViewProps {
  bookings: Booking[]
  selectedIds: Set<string>
  bulkStatus: BookingStatus
  isBulkLoading: boolean
  onSelectAll: () => void
  onToggleSelect: (id: string) => void
  onBulkStatusChange: (status: BookingStatus) => void
  onBulkUpdate: () => void
  onClearSelection: () => void
  onViewBooking: (booking: Booking) => void
}

export function CalendarListView({
  bookings,
  selectedIds,
  bulkStatus,
  isBulkLoading,
  onSelectAll,
  onToggleSelect,
  onBulkStatusChange,
  onBulkUpdate,
  onClearSelection,
  onViewBooking,
}: CalendarListViewProps) {
  const allSelected = selectedIds.size === bookings.length && bookings.length > 0

  return (
    <div className="space-y-3">
      {selectedIds.size > 0 && (
        <div className="bg-primary/10 border-primary/20 flex flex-wrap items-center gap-3 rounded-lg border p-3">
          <span className="text-primary text-sm font-medium">
            {selectedIds.size} seleccionada{selectedIds.size !== 1 ? 's' : ''}
          </span>
          <select
            value={bulkStatus}
            onChange={(e) => onBulkStatusChange(e.target.value as BookingStatus)}
            className="border-border bg-background text-foreground rounded border px-2 py-1 text-sm"
          >
            <option value="CONFIRMED">Confirmar</option>
            <option value="COMPLETED">Completar</option>
            <option value="CANCELLED">Cancelar</option>
            <option value="PENDING">Pendiente</option>
          </select>
          <Button size="sm" onClick={onBulkUpdate} disabled={isBulkLoading}>
            {isBulkLoading ? 'Actualizando...' : 'Aplicar'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            Limpiar
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2 px-1">
        <button
          onClick={onSelectAll}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm"
        >
          {allSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
          {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
        </button>
        <span className="text-muted-foreground text-sm">({bookings.length} reservas)</span>
      </div>

      {bookings.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">No hay reservas este mes</p>
      ) : (
        <div className="border-border divide-border divide-y rounded-xl border">
          {[...bookings]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((booking) => (
              <div
                key={booking.id}
                className={`flex items-center gap-3 p-4 transition-colors ${selectedIds.has(booking.id) ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
              >
                <button onClick={() => onToggleSelect(booking.id)} className="shrink-0">
                  {selectedIds.has(booking.id) ? (
                    <CheckSquare className="text-primary h-5 w-5" />
                  ) : (
                    <Square className="text-muted-foreground h-5 w-5" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-foreground font-medium">{booking.clientName}</span>
                    <span className="text-muted-foreground text-sm">
                      {format(new Date(booking.date), "d MMM 'a las' HH:mm", { locale: es })}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">{booking.service.name}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onViewBooking(booking)}>
                  Ver
                </Button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
