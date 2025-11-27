import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

/**
 * Admin Root Page - Smart Redirect Handler
 *
 * This page acts as a "traffic light" for the /admin route:
 * - If the user has a valid session -> redirect to /admin/dashboard
 * - If the user is not authenticated -> redirect to /auth/login
 *
 * This ensures /admin is never blank and provides intelligent routing.
 */
export default async function AdminRootPage() {
  const session = await auth()

  if (session?.user) {
    redirect('/admin/dashboard')
  } else {
    redirect('/auth/login')
  }
}
