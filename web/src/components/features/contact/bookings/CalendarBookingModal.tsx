'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { User, Mail, Phone, FileText, Users, Pencil, Calendar } from 'lucide-react'
import { Modal, Button, Badge } from '@/components/ui'
import type { Booking, BookingStatus } from './calendarTypes'

interface CalendarBookingModalProps {
  isOpen: boolean
  onClose: () => void
  booking: Booking | null
  selectedDate: Date | null
  onStatusUpdate: (status: BookingStatus) => Promise<void>
  onEdit: (id: string) => void
}

export function CalendarBookingModal({
  isOpen,
  onClose,
  booking,
  selectedDate,
  onStatusUpdate,
  onEdit,
}: CalendarBookingModalProps) {
  if (!booking) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de Reserva">
      <div className="space-y-6">
        <div className="border-border flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="text-foreground text-xl font-bold">
              {format(new Date(booking.date), "EEEE d 'de' MMMM", { locale: es })}
            </h3>
            <p className="text-muted-foreground flex items-center gap-2">
              <Calendar size={14} />
              {selectedDate && format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
              {format(new Date(booking.date), 'HH:mm')} hs
              {booking.service.duration && ` • ${booking.service.duration}`}
            </p>
          </div>
          <Badge
            variant={
              booking.status === 'CONFIRMED'
                ? 'success'
                : booking.status === 'CANCELLED'
                  ? 'destructive'
                  : booking.status === 'COMPLETED'
                    ? 'outline'
                    : 'warning'
            }
          >
            {booking.status}
          </Badge>
        </div>

        <div className="space-y-3">
          <h4 className="text-foreground font-semibold">Datos del Cliente</h4>
          <div className="text-muted-foreground grid gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User size={16} className="text-muted-foreground/60" />
              {booking.clientName}
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-muted-foreground/60" />
              <span>{booking.clientEmail}</span>
            </div>
            {booking.clientPhone && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-muted-foreground/60" />
                <span>{booking.clientPhone}</span>
              </div>
            )}
            {(booking.guestCount ?? 1) > 1 && (
              <div className="flex items-center gap-2">
                <Users size={16} className="text-muted-foreground/60" />
                <span>{booking.guestCount} asistentes</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-foreground font-semibold">Servicio</h4>
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="text-foreground font-medium">{booking.service.name}</p>
            {booking.clientNotes && (
              <div className="border-border mt-2 flex gap-2 border-t pt-2">
                <FileText size={16} className="text-muted-foreground/60 shrink-0" />
                <p className="text-muted-foreground italic">{booking.clientNotes}</p>
              </div>
            )}
            {booking.adminNotes && (
              <div className="border-border mt-2 flex gap-2 border-t pt-2">
                <FileText size={16} className="text-primary/60 shrink-0" />
                <p className="text-muted-foreground text-xs font-medium">
                  🔒 {booking.adminNotes}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-border flex flex-wrap justify-end gap-2 border-t pt-4">
          <Button variant="secondary" onClick={() => onEdit(booking.id)}>
            <Pencil size={14} className="mr-1.5" />
            Editar
          </Button>
          {booking.status === 'PENDING' && (
            <>
              <Button variant="destructive" onClick={() => onStatusUpdate('CANCELLED')}>
                Rechazar
              </Button>
              <Button onClick={() => onStatusUpdate('CONFIRMED')}>Confirmar Reserva</Button>
            </>
          )}
          {booking.status === 'CONFIRMED' && (
            <Button variant="secondary" onClick={() => onStatusUpdate('COMPLETED')}>
              Marcar Completada
            </Button>
          )}
          {(booking.status === 'CANCELLED' || booking.status === 'COMPLETED') && (
            <Button variant="primary" onClick={() => onStatusUpdate('PENDING')}>
              Reabrir
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
