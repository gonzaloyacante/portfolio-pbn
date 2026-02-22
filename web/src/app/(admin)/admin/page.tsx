import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ROUTES } from '@/config/routes'

export const dynamic = 'force-dynamic'

/**
 * Admin Root Page - Smart Redirect Handler
 *
 * When authenticated  → /admin/panel  (rewrite → /admin/dashboard)
 * When unauthenticated → /auth/login
 */
export default async function AdminRootPage() {
  const session = await auth()

  if (session?.user) {
    redirect(ROUTES.admin.dashboard)
  } else {
    redirect(ROUTES.auth.login)
  }
}
