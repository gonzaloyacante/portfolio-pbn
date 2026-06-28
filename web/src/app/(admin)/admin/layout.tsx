import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { ROUTES } from '@/config/routes'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminMobileHeader from '@/components/layout/AdminMobileHeader'
import PageTransition from '@/components/layout/PageTransition'
import AdminProviders from '@/components/providers/AdminProviders'
import '@/app/(public)/public-fixed-theme.css'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect(ROUTES.auth.login)
  }

  return (
    <AdminProviders>
      {/* `public-fixed-theme` define las CSS vars (--primary, --background,
          --foreground, --border, etc.) que usan las clases del Button y otros
          componentes. Sin este wrapper, las vars quedan huérfanas en admin y
          los botones aparecen sin fondo ni color. El admin hereda el theme
          público (fondo rosado). Si querés un theme admin separado, hay que
          mover las vars a un bloque `:root` o un wrapper admin-específico. */}
      <div className="public-fixed-theme bg-background flex min-h-dvh flex-col transition-colors duration-300 lg:flex-row">
        <a
          href="#admin-main-content"
          className="bg-primary text-primary-foreground sr-only z-200 rounded px-4 py-2 text-sm font-semibold focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:ring-2 focus:ring-white focus:outline-none"
        >
          Saltar al contenido principal
        </a>
        {/* Sidebar desktop (hidden en mobile, visible en lg+) */}
        <AdminSidebar />
        {/* Header mobile con hamburger (visible solo en mobile) */}
        <AdminMobileHeader />
        <main
          id="admin-main-content"
          className="flex-1 overflow-auto p-4 transition-colors duration-300 sm:p-6 lg:p-8"
          tabIndex={-1}
        >
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </AdminProviders>
  )
}
