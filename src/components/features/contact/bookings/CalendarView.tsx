'use client'

import { useState, useEffect } from 'react'
import { getBookingsByRange, updateBookingStatus } from '@/actions/user/bookings'
import { Button, Modal, Badge } from '@/components/ui'
import { ChevronLeft, User, Mail, Phone, FileText } from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { showToast } from '@/lib/toast'

// Types (Mirrors Prisma Model for client usage)
type Booking = {
  id: string
  date: Date
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  clientName: string
  clientEmail: string
  clientPhone: string | null
  clientNotes: string | null
  service: {
    name: string
    duration: string | null
  }
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])

  // Modal State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()) // Default to today
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calendar calculations
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  // Fetch bookings when month changes
  useEffect(() => {
    async function fetchBookings() {
      try {
        // Fetch slightly more than the visible range to be safe
        const data = await getBookingsByRange(startDate, endDate)
        setBookings(data as Booking[])
      } catch {
        showToast.error('Error al cargar reservas')
      }
    }
    fetchBookings()
  }, [currentDate, startDate, endDate])

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  const handleBookingClick = (booking: Booking, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleStatusUpdate = async (newStatus: Booking['status']) => {
    if (!selectedBooking) return
    try {
      const res = await updateBookingStatus(selectedBooking.id, newStatus)
      if (res.success) {
        showToast.success('Estado actualizado')
        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b.id === selectedBooking.id ? { ...b, status: newStatus } : b))
        )
        setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null))
      } else {
        showToast.error(res.error || 'Error')
      }
    } catch {
      showToast.error('Error de conexión')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-bold capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoy
          </Button>
          <button
            onClick={nextMonth}
            className="text-muted-foreground hover:text-foreground p-2 text-2xl"
          >
            →
          </button>
          <div className="border-border ml-2 border-l pl-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => showToast.info('Próximamente: Bloqueo de fechas')}
            >
              Bloquear
            </Button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="border-border bg-card hidden rounded-xl border shadow-sm md:block">
        {/* Header Días */}
        <div className="border-border grid grid-cols-7 border-b">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
            <div key={day} className="text-muted-foreground py-3 text-center text-sm font-semibold">
              {day}
            </div>
          ))}
        </div>

        {/* Days Cells */}
        <div className="grid auto-rows-[120px] grid-cols-7">
          {calendarDays.map((day) => {
            const dayBookings = bookings.filter((b) => isSameDay(new Date(b.date), day))
            const isCurrentMonth = isSameMonth(day, currentDate)

            return (
              <div
                key={day.toString()}
                className={`border-border hover:bg-muted/50 relative flex flex-col gap-1 border-r border-b p-2 transition-colors ${!isCurrentMonth ? 'bg-muted/30 text-muted-foreground' : ''} ${isToday(day) ? 'bg-primary/5' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${isToday(day) ? 'bg-primary text-primary-foreground' : ''} `}
                >
                  {format(day, 'd')}
                </div>

                {/* Booking Dots/Bars */}
                <div className="flex flex-col gap-1 overflow-y-auto">
                  {dayBookings.map((booking) => (
                    <button
                      key={booking.id}
                      onClick={(e) => handleBookingClick(booking, e)}
                      className={`truncate rounded border px-1.5 py-0.5 text-left text-xs font-medium ${getStatusColor(booking.status)} `}
                    >
                      {format(new Date(booking.date), 'HH:mm')} {booking.clientName}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detalle de Reserva">
        {selectedBooking && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="border-border flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-foreground text-xl font-bold">
                  {format(new Date(selectedBooking.date), "EEEE d 'de' MMMM", { locale: es })}
                </h3>
                <p className="text-muted-foreground flex items-center gap-2">
                  📅 {format(selectedDate!, "d 'de' MMMM, yyyy", { locale: es })}
                  {format(new Date(selectedBooking.date), 'HH:mm')} hs
                  {selectedBooking.service.duration && ` • ${selectedBooking.service.duration}`}
                </p>
              </div>
              <Badge
                variant={
                  selectedBooking.status === 'CONFIRMED'
                    ? 'success'
                    : selectedBooking.status === 'CANCELLED'
                      ? 'destructive'
                      : selectedBooking.status === 'COMPLETED'
                        ? 'outline'
                        : 'warning'
                }
              >
                {selectedBooking.status}
              </Badge>
            </div>

            {/* Client Info */}
            <div className="space-y-3">
              <h4 className="text-foreground font-semibold">Datos del Cliente</h4>
              <div className="text-muted-foreground grid gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-muted-foreground/60" />
                  {selectedBooking.clientName}
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-muted-foreground/60" />
                  <span>{selectedBooking.clientEmail}</span>
                </div>
                {selectedBooking.clientPhone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-muted-foreground/60" />
                    <span>{selectedBooking.clientPhone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service & Notes */}
            <div className="space-y-3">
              <h4 className="text-foreground font-semibold">Servicio</h4>
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="text-foreground font-medium">{selectedBooking.service.name}</p>
                {selectedBooking.clientNotes && (
                  <div className="border-border mt-2 flex gap-2 border-t pt-2">
                    <FileText size={16} className="text-muted-foreground/60 shrink-0" />
                    <p className="text-muted-foreground italic">{selectedBooking.clientNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-border flex justify-end gap-2 border-t pt-4">
              {selectedBooking.status === 'PENDING' && (
                <>
                  <Button variant="destructive" onClick={() => handleStatusUpdate('CANCELLED')}>
                    Rechazar
                  </Button>
                  <Button onClick={() => handleStatusUpdate('CONFIRMED')}>Confirmar Reserva</Button>
                </>
              )}
              {selectedBooking.status === 'CONFIRMED' && (
                <Button variant="secondary" onClick={() => handleStatusUpdate('COMPLETED')}>
                  Marcar Completada
                </Button>
              )}
              {(selectedBooking.status === 'CANCELLED' ||
                selectedBooking.status === 'COMPLETED') && (
                <Button variant="primary" onClick={() => handleStatusUpdate('PENDING')}>
                  Reabrir
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
