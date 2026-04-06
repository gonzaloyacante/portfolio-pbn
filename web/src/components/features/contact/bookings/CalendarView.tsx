'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getBookingsByRange, updateBookingStatus } from '@/actions/user/bookings'
import { bulkUpdateBookingStatus } from '@/actions/cms/bookings'
import { Button, Modal, Badge } from '@/components/ui'
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  FileText,
  Users,
  Pencil,
  List,
  Calendar,
  CheckSquare,
  Square,
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
import { showToast } from '@/lib/toast'
import { ROUTES } from '@/config/routes'

// Types (Mirrors Prisma Model for client usage)
type Booking = {
  id: string
  date: Date
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  clientName: string
  clientEmail: string
  clientPhone: string | null
  clientNotes: string | null
  guestCount: number | null
  adminNotes: string | null
  service: {
    name: string
    duration: string | null
  }
}

export default function CalendarView() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])

  // Modal State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()) // Default to today
  const [isModalOpen, setIsModalOpen] = useState(false)

  // List/Bulk State
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkStatus, setBulkStatus] = useState<Booking['status']>('CONFIRMED')
  const [isBulkLoading, setIsBulkLoading] = useState(false)

  // Calendar calculations (memoized to prevent infinite re-fetch in useEffect)
  const { startDate, endDate, calendarDays } = useMemo(() => {
    const ms = startOfMonth(currentDate)
    const sd = startOfWeek(ms, { weekStartsOn: 1 })
    const ed = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
    return {
      startDate: sd,
      endDate: ed,
      calendarDays: eachDayOfInterval({ start: sd, end: ed }),
    }
  }, [currentDate])

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

  const handleBulkUpdate = async () => {
    if (selectedIds.size === 0) return
    setIsBulkLoading(true)
    try {
      const res = await bulkUpdateBookingStatus(Array.from(selectedIds), bulkStatus)
      if (res.success) {
        showToast.success(
          `${res.count} reserva${res.count !== 1 ? 's' : ''} actualizada${res.count !== 1 ? 's' : ''}`
        )
        setBookings((prev) =>
          prev.map((b) => (selectedIds.has(b.id) ? { ...b, status: bulkStatus } : b))
        )
        setSelectedIds(new Set())
      } else {
        showToast.error(res.error || 'Error al actualizar')
      }
    } catch {
      showToast.error('Error de conexión')
    } finally {
      setIsBulkLoading(false)
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
        return 'bg-muted text-muted-foreground'
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
          <div className="border-border ml-2 flex items-center gap-1 border-l pl-2">
            <Button
              variant={viewMode === 'calendar' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setViewMode('calendar')
                setSelectedIds(new Set())
              }}
              title="Vista Calendario"
            >
              <Calendar className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setViewMode('list')
                setSelectedIds(new Set())
              }}
              title="Vista Lista"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {viewMode === 'calendar' && (
        <div className="border-border bg-card hidden rounded-xl border shadow-sm md:block">
          {/* Header Días */}
          <div className="border-border grid grid-cols-7 border-b">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
              <div
                key={day}
                className="text-muted-foreground py-3 text-center text-sm font-semibold"
              >
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
      )}

      {/* List View with Bulk Selection */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {selectedIds.size > 0 && (
            <div className="bg-primary/10 border-primary/20 flex flex-wrap items-center gap-3 rounded-lg border p-3">
              <span className="text-primary text-sm font-medium">
                {selectedIds.size} seleccionada{selectedIds.size !== 1 ? 's' : ''}
              </span>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value as Booking['status'])}
                className="border-border bg-background text-foreground rounded border px-2 py-1 text-sm"
              >
                <option value="CONFIRMED">Confirmar</option>
                <option value="COMPLETED">Completar</option>
                <option value="CANCELLED">Cancelar</option>
                <option value="PENDING">Pendiente</option>
              </select>
              <Button size="sm" onClick={handleBulkUpdate} disabled={isBulkLoading}>
                {isBulkLoading ? 'Actualizando...' : 'Aplicar'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
                Limpiar
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2 px-1">
            <button
              onClick={() => {
                if (selectedIds.size === bookings.length && bookings.length > 0) {
                  setSelectedIds(new Set())
                } else {
                  setSelectedIds(new Set(bookings.map((b) => b.id)))
                }
              }}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm"
            >
              {selectedIds.size === bookings.length && bookings.length > 0 ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              {selectedIds.size === bookings.length && bookings.length > 0
                ? 'Deseleccionar todo'
                : 'Seleccionar todo'}
            </button>
            <span className="text-muted-foreground text-sm">({bookings.length} reservas)</span>
          </div>

          {bookings.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No hay reservas este mes
            </p>
          ) : (
            <div className="border-border divide-border divide-y rounded-xl border">
              {[...bookings]
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((booking) => (
                  <div
                    key={booking.id}
                    className={`flex items-center gap-3 p-4 transition-colors ${selectedIds.has(booking.id) ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
                  >
                    <button
                      onClick={() => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev)
                          if (next.has(booking.id)) next.delete(booking.id)
                          else next.add(booking.id)
                          return next
                        })
                      }}
                      className="shrink-0"
                    >
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
                          {booking.status === 'CONFIRMED'
                            ? 'Confirmada'
                            : booking.status === 'PENDING'
                              ? 'Pendiente'
                              : booking.status === 'COMPLETED'
                                ? 'Completada'
                                : booking.status === 'CANCELLED'
                                  ? 'Cancelada'
                                  : booking.status}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">{booking.service.name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking)
                        setIsModalOpen(true)
                      }}
                    >
                      Ver
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

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
                {(selectedBooking.guestCount ?? 1) > 1 && (
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-muted-foreground/60" />
                    <span>{selectedBooking.guestCount} asistentes</span>
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
                {selectedBooking.adminNotes && (
                  <div className="border-border mt-2 flex gap-2 border-t pt-2">
                    <FileText size={16} className="text-primary/60 shrink-0" />
                    <p className="text-muted-foreground text-xs font-medium">
                      🔒 {selectedBooking.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-border flex flex-wrap justify-end gap-2 border-t pt-4">
              {/* Edit button always shown */}
              <Button
                variant="secondary"
                onClick={() => router.push(ROUTES.admin.calendarEdit(selectedBooking.id))}
              >
                <Pencil size={14} className="mr-1.5" />
                Editar
              </Button>
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
