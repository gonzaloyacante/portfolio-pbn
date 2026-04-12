'use client'

import { Button } from '@/components/ui'
import { ChevronLeft, ChevronRight, Calendar, List } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { showToast } from '@/lib/toast'
import type { ViewMode } from './calendarTypes'

interface CalendarHeaderProps {
  currentDate: Date
  viewMode: ViewMode
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  onViewModeChange: (mode: ViewMode) => void
}

export function CalendarHeader({
  currentDate,
  viewMode,
  onPrevMonth,
  onNextMonth,
  onToday,
  onViewModeChange,
}: CalendarHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-foreground text-2xl font-bold capitalize">
        {format(currentDate, 'MMMM yyyy', { locale: es })}
      </h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onToday}>
          Hoy
        </Button>
        <Button variant="outline" size="sm" onClick={onNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
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
            onClick={() => onViewModeChange('calendar')}
            title="Vista Calendario"
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            title="Vista Lista"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
