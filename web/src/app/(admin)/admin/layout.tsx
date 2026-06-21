import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { ROUTES } from '@/config/routes'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminMobileHeader from '@/components/layout/AdminMobileHeader'
import PageTransition from '@/components/layout/PageTransition'
import AdminProviders from '@/components/providers/AdminProviders'
// Importado para que las clases .public-home-page y .public-home-page-background
// (donde se aplica el background-image del Hero) funcionen también dentro del
// editor /admin/inicio. Es la misma hoja que usa la home pública.
import '@/app/(public)/public-fixed-theme.css'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect(ROUTES.auth.login)
  }

  return (
    <AdminProviders>
      <div className="bg-background flex min-h-dvh flex-col transition-colors duration-300 lg:flex-row">
        {/* Sidebar desktop (hidden en mobile, visible en lg+) */}
        <AdminSidebar />
        {/* Header mobile con hamburger (visible solo en mobile) */}
        <AdminMobileHeader />
        <main className="flex-1 overflow-auto p-4 transition-colors duration-300 sm:p-6 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </AdminProviders>
  )
}
