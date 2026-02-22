import { redirect } from 'next/navigation'
import { ROUTES } from '@/config/routes'

/**
 * Analytics page has been merged into the dashboard.
 * Redirect any existing links automatically.
 */
export default function AnalyticsPage() {
  redirect(ROUTES.admin.dashboard)
}
