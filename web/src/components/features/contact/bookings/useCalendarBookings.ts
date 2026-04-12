'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
} from 'date-fns'
import { getBookingsByRange, updateBookingStatus } from '@/actions/user/bookings'
import { bulkUpdateBookingStatus } from '@/actions/cms/bookings'
import { showToast } from '@/lib/toast'
import type { Booking, BookingStatus, ViewMode } from './calendarTypes'

export function useCalendarBookings() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkStatus, setBulkStatus] = useState<BookingStatus>('CONFIRMED')
  const [isBulkLoading, setIsBulkLoading] = useState(false)

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

  useEffect(() => {
    async function fetchBookings() {
      try {
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

  const openBookingModal = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleStatusUpdate = async (newStatus: BookingStatus) => {
    if (!selectedBooking) return
    try {
      const res = await updateBookingStatus(selectedBooking.id, newStatus)
      if (res.success) {
        showToast.success('Estado actualizado')
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

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === bookings.length && bookings.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(bookings.map((b) => b.id)))
    }
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    setSelectedIds(new Set())
  }

  const clearSelection = () => setSelectedIds(new Set())

  return {
    currentDate,
    bookings,
    selectedBooking,
    selectedDate,
    setSelectedDate,
    isModalOpen,
    setIsModalOpen,
    viewMode,
    selectedIds,
    bulkStatus,
    setBulkStatus,
    isBulkLoading,
    calendarDays,
    nextMonth,
    prevMonth,
    goToToday,
    handleBookingClick,
    openBookingModal,
    handleStatusUpdate,
    handleBulkUpdate,
    handleToggleSelect,
    handleSelectAll,
    handleViewModeChange,
    clearSelection,
  }
}
