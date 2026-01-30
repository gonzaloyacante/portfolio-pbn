'use client'

import { useState, useEffect } from 'react'
import { getBookingsByRange, updateBookingStatus } from '@/actions/bookings.actions'
import { Button, Modal, Badge } from '@/components/ui'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
} from 'lucide-react'
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
import toast from 'react-hot-toast'

// Types (Mirrors Prisma Model for client usage)
type Booking = {
  id: string
  date: Date
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  clientName: string
  clientEmail: string
  clientPhone: string | null
  notes: string | null
  service: {
    name: string
    duration: string | null
  }
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Modal State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
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
      setIsLoading(true)
      try {
        // Fetch slightly more than the visible range to be safe
        const data = await getBookingsByRange(startDate, endDate)
        setBookings(data as Booking[])
      } catch (error) {
        toast.error('Error al cargar reservas')
      } finally {
        setIsLoading(false)
      }
    }
    fetchBookings()
  }, [currentDate])

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
        toast.success('Estado actualizado')
        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b.id === selectedBooking.id ? { ...b, status: newStatus } : b))
        )
        setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null))
      } else {
        toast.error(res.error || 'Error')
      }
    } catch (e) {
      toast.error('Error de conexión')
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-wine dark:text-pink-light text-2xl font-bold capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoy
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="ml-2 border-l pl-2 dark:border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast('Próximamente: Bloqueo de fechas', { icon: '🔒' })}
            >
              Bloquear
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border-pink-hot/20 dark:border-pink-light/10 dark:bg-wine rounded-xl border bg-white shadow-sm md:block">
        {/* Days Header */}
        <div className="border-pink-hot/20 dark:border-pink-light/10 grid grid-cols-7 border-b">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
            <div
              key={day}
              className="text-wine/60 dark:text-pink-light/60 py-3 text-center text-sm font-semibold"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Cells */}
        <div className="grid auto-rows-[120px] grid-cols-7">
          {calendarDays.map((day, idx) => {
            const dayBookings = bookings.filter((b) => isSameDay(new Date(b.date), day))
            const isCurrentMonth = isSameMonth(day, currentDate)

            return (
              <div
                key={day.toString()}
                className={`relative flex flex-col gap-1 border-r border-b p-2 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${!isCurrentMonth ? 'bg-gray-50/50 text-gray-400 dark:bg-black/20 dark:text-gray-600' : ''} ${isToday(day) ? 'bg-pink-light/20 dark:bg-pink-light/5' : ''} border-pink-hot/10 dark:border-pink-light/5`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${isToday(day) ? 'bg-wine dark:bg-pink-light dark:text-wine text-white' : ''} `}
                >
                  {format(day, 'd')}
                </span>

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
            <div className="flex items-center justify-between border-b pb-4 dark:border-white/10">
              <div>
                <h3 className="text-wine dark:text-pink-light text-xl font-bold">
                  {format(new Date(selectedBooking.date), "EEEE d 'de' MMMM", { locale: es })}
                </h3>
                <p className="text-wine/60 dark:text-pink-light/60 flex items-center gap-2">
                  <Clock size={16} />
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
              <h4 className="text-wine dark:text-pink-light font-semibold">Datos del Cliente</h4>
              <div className="text-wine/80 dark:text-pink-light/80 grid gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-wine/40 dark:text-pink-light/40" />
                  {selectedBooking.clientName}
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-wine/40 dark:text-pink-light/40" />
                  {selectedBooking.clientEmail}
                </div>
                {selectedBooking.clientPhone && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-wine/40 dark:text-pink-light/40" />
                    {selectedBooking.clientPhone}
                  </div>
                )}
              </div>
            </div>

            {/* Service & Notes */}
            <div className="space-y-3">
              <h4 className="text-wine dark:text-pink-light font-semibold">Servicio</h4>
              <div className="bg-pink-light/20 rounded-lg p-3 text-sm dark:bg-white/5">
                <p className="text-wine dark:text-pink-light font-medium">
                  {selectedBooking.service.name}
                </p>
                {selectedBooking.notes && (
                  <div className="border-wine/10 mt-2 flex gap-2 border-t pt-2 dark:border-white/10">
                    <FileText size={16} className="text-wine/40 dark:text-pink-light/40 shrink-0" />
                    <p className="text-wine/70 dark:text-pink-light/70 italic">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 border-t pt-4 dark:border-white/10">
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
