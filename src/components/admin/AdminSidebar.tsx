'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { ThemeToggle } from '@/components/ui'

import { menuItems } from '@/config/admin-sidebar'

export default function AdminSidebar() {
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/auth/login' })
      toast.success('Sesión cerrada exitosamente')
    } catch {
      toast.error('Error al cerrar sesión')
    }
  }

  return (
    <aside className="bg-pink-light/80 dark:bg-purple-dark/20 border-wine/10 dark:border-pink-light/10 sticky top-0 flex h-screen w-64 flex-col border-r backdrop-blur-md transition-colors duration-300">
      {/* Header */}
      <div className="border-wine/10 dark:border-pink-light/10 flex items-center justify-between border-b p-6">
        <Link
          href="/admin/dashboard"
          className="block cursor-pointer transition-all duration-200 hover:scale-105"
        >
          <h1 className="font-script text-wine dark:text-pink-hot text-2xl">Admin Panel</h1>
        </Link>
        <ThemeToggle />
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menuItems.map((item: { href: string; icon: string; label: string }) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isActive
                  ? 'bg-wine text-pink-light dark:bg-pink-hot dark:text-purple-dark shadow-md'
                  : 'text-wine/80 hover:bg-wine/10 dark:text-pink-light/80 dark:hover:bg-pink-light/10'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-current opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer - Sticky */}
      <div className="border-wine/10 dark:border-pink-light/10 mt-auto border-t p-4">
        <Link
          href="/"
          target="_blank"
          className="text-wine hover:bg-wine/10 dark:text-pink-light dark:hover:bg-pink-light/10 mb-2 flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>🌐</span>
          <span>Ver sitio público</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-red-600 transition-all duration-200 hover:scale-[1.02] hover:bg-red-100 active:scale-[0.98] dark:text-red-400 dark:hover:bg-red-900/30"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
