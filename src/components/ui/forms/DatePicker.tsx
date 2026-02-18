'use client'

import { useState, useRef, useEffect } from 'react'

interface DatePickerProps {
  name: string
  label?: string
  value?: string
  defaultValue?: string
  onChange?: (date: string) => void
  required?: boolean
  placeholder?: string
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

export default function DatePicker({
  name,
  label,
  value,
  defaultValue,
  onChange,
  required = false,
  placeholder = 'Seleccionar fecha',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const initial = value || defaultValue
    return initial ? new Date(initial) : null
  })
  const [viewDate, setViewDate] = useState(() => {
    const initial = value || defaultValue
    return initial ? new Date(initial) : new Date()
  })
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const handleSelectDate = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    setSelectedDate(newDate)
    setIsOpen(false)
    const isoDate = newDate.toISOString().split('T')[0]
    onChange?.(isoDate)
  }

  const renderCalendar = () => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days: (number | null)[] = []

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewDate.getMonth() &&
      selectedDate.getFullYear() === viewDate.getFullYear()
    )
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === viewDate.getMonth() &&
      today.getFullYear() === viewDate.getFullYear()
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="text-foreground mb-2 block text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
        required={required}
      />

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={selectedDate ? `Fecha seleccionada: ${formatDate(selectedDate)}` : placeholder}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="border-input hover:border-ring focus:border-ring focus:ring-ring/20 bg-background flex w-full cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-left transition-all focus:ring-2 focus:outline-none"
      >
        <span className={selectedDate ? 'text-foreground' : 'text-muted-foreground'}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        <svg
          className={`text-muted-foreground h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Calendar dropdown */}
      {isOpen && (
        <div className="border-border bg-popover text-popover-foreground absolute z-50 mt-2 w-full rounded-xl border p-4 shadow-xl">
          {/* Month/Year navigation */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Mes anterior"
              className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-lg p-2 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <span className="text-foreground font-semibold">
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Mes siguiente"
              className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-lg p-2 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {DAYS.map((day) => (
              <div key={day} className="text-muted-foreground py-1 text-center text-xs font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar().map((day, index) => (
              <div key={index} className="aspect-square">
                {day !== null ? (
                  <button
                    type="button"
                    onClick={() => handleSelectDate(day)}
                    className={`flex h-full w-full cursor-pointer items-center justify-center rounded-lg text-sm transition-all ${
                      isSelected(day)
                        ? 'bg-primary text-primary-foreground'
                        : isToday(day)
                          ? 'border-primary text-primary border-2'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {day}
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          {/* Today button */}
          <div className="border-border mt-4 border-t pt-4">
            <button
              type="button"
              onClick={() => {
                const today = new Date()
                setViewDate(today)
                setSelectedDate(today)
                setIsOpen(false)
                onChange?.(today.toISOString().split('T')[0])
              }}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 w-full cursor-pointer rounded-lg py-2 text-center text-sm font-medium transition-colors"
            >
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
