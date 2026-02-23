'use client'

import dynamic from 'next/dynamic'

const CalendarView = dynamic(() => import('./CalendarView'), {
  ssr: false,
  loading: () => <div className="text-muted-foreground p-6">Cargando calendario...</div>,
})

export default function CalendarViewClient() {
  return <CalendarView />
}
