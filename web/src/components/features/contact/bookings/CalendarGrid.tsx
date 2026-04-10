'use client'

import { isSameMonth, isSameDay, isToday, format } from 'date-fns'
import { getStatusColor } from './calendarUtils'
import type { Booking } from './calendarTypes'

interface CalendarGridProps {
  calendarDays: Date[]
  currentDate: Date
  bookings: Booking[]
  onBookingClick: (booking: Booking, e: React.MouseEvent) => void
  onDayClick: (day: Date) => void
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export function CalendarGrid({
  calendarDays,
  currentDate,
  bookings,
  onBookingClick,
  onDayClick,
}: CalendarGridProps) {
  return (
    <div className="border-border bg-card hidden rounded-xl border shadow-sm md:block">
      <div className="border-border grid grid-cols-7 border-b">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-muted-foreground py-3 text-center text-sm font-semibold">
            {day}
          </div>
        ))}
      </div>

      <div className="grid auto-rows-[120px] grid-cols-7">
        {calendarDays.map((day) => {
          const dayBookings = bookings.filter((b) => isSameDay(new Date(b.date), day))
          const isCurrentMonth = isSameMonth(day, currentDate)

          return (
            <div
              key={day.toString()}
              className={`border-border hover:bg-muted/50 relative flex flex-col gap-1 border-r border-b p-2 transition-colors ${!isCurrentMonth ? 'bg-muted/30 text-muted-foreground' : ''} ${isToday(day) ? 'bg-primary/5' : ''}`}
              onClick={() => onDayClick(day)}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${isToday(day) ? 'bg-primary text-primary-foreground' : ''}`}
              >
                {format(day, 'd')}
              </div>

              <div className="flex flex-col gap-1 overflow-y-auto">
                {dayBookings.map((booking) => (
                  <button
                    key={booking.id}
                    onClick={(e) => onBookingClick(booking, e)}
                    className={`truncate rounded border px-1.5 py-0.5 text-left text-xs font-medium ${getStatusColor(booking.status)}`}
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
  )
}
