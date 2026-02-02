import { AdminSidebar } from '@/components/admin'
import ToastProvider from '@/components/layout/ToastProvider'
import PageTransition from '@/components/layout/PageTransition'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen transition-colors duration-300">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-4 transition-colors duration-300 sm:p-6 lg:p-8">
        <PageTransition>{children}</PageTransition>
      </main>
      <ToastProvider />
    </div>
  )
}
