'use client'

import { SessionProvider } from 'next-auth/react'

interface AdminProvidersProps {
  children: React.ReactNode
}

/**
 * Admin-only providers.
 * Wraps admin pages with SessionProvider so auth session is only
 * fetched when navigating admin routes — not on public pages.
 */
export default function AdminProviders({ children }: AdminProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>
}
