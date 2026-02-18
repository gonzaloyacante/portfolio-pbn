import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminMobileHeader from '@/components/layout/AdminMobileHeader'
import ToastProvider from '@/components/layout/ToastProvider'
import PageTransition from '@/components/layout/PageTransition'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen flex-col transition-colors duration-300 lg:flex-row">
      {/* Sidebar desktop (hidden en mobile, visible en lg+) */}
      <AdminSidebar />
      {/* Header mobile con hamburger (visible solo en mobile) */}
      <AdminMobileHeader />
      <main className="flex-1 overflow-auto p-4 transition-colors duration-300 sm:p-6 lg:p-8">
        <PageTransition>{children}</PageTransition>
      </main>
      <ToastProvider />
    </div>
  )
}
