import { SkeletonCalendarPage } from '@/components/ui'

export default function CalendarLoading() {
  return (
    <div className="page-transition">
      <SkeletonCalendarPage />
    </div>
  )
}
