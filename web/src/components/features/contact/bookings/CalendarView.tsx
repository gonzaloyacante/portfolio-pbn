'use client'

import { useRouter } from 'next/navigation'
import { ROUTES } from '@/config/routes'
import { useCalendarBookings } from './useCalendarBookings'
import { CalendarHeader } from './CalendarHeader'
import { CalendarGrid } from './CalendarGrid'
import { CalendarListView } from './CalendarListView'
import { CalendarBookingModal } from './CalendarBookingModal'

export default function CalendarView() {
  const router = useRouter()
  const {
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
  } = useCalendarBookings()

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onToday={goToToday}
        onViewModeChange={handleViewModeChange}
      />

      {viewMode === 'calendar' && (
        <CalendarGrid
          calendarDays={calendarDays}
          currentDate={currentDate}
          bookings={bookings}
          onBookingClick={handleBookingClick}
          onDayClick={setSelectedDate}
        />
      )}

      {viewMode === 'list' && (
        <CalendarListView
          bookings={bookings}
          selectedIds={selectedIds}
          bulkStatus={bulkStatus}
          isBulkLoading={isBulkLoading}
          onSelectAll={handleSelectAll}
          onToggleSelect={handleToggleSelect}
          onBulkStatusChange={setBulkStatus}
          onBulkUpdate={handleBulkUpdate}
          onClearSelection={clearSelection}
          onViewBooking={openBookingModal}
        />
      )}

      <CalendarBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={selectedBooking}
        selectedDate={selectedDate}
        onStatusUpdate={handleStatusUpdate}
        onEdit={(id) => router.push(ROUTES.admin.calendarEdit(id))}
      />
    </div>
  )
}
