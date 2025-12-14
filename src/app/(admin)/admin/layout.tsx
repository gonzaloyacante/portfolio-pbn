import { AdminSidebar } from '@/components/admin'
import ToastProvider from '@/components/layout/ToastProvider'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8 dark:bg-gray-900">{children}</main>
      <ToastProvider />
    </div>
  )
}
