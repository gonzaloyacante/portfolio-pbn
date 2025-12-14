'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import ThemeToggle from '@/components/ui/ThemeToggle'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/admin/analitica', label: 'Analítica', icon: '📊' },
  { href: '/admin/gestion/projects', label: 'Proyectos', icon: '🎨' },
  { href: '/admin/gestion/categories', label: 'Categorías', icon: '📁' },
  { href: '/admin/testimonios', label: 'Testimonios', icon: '💬' },
  { href: '/admin/contactos', label: 'Contactos', icon: '📧' },
  { href: '/admin/tema', label: 'Editor de Tema', icon: '🎨' },
  { href: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
  { href: '/admin/ayuda', label: 'Centro de Ayuda', icon: '📘' },
]

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
    <aside className="flex min-h-screen w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
        <Link href="/admin/dashboard" className="block">
          <h1 className="font-script text-2xl" style={{ color: 'var(--color-primary, #ffaadd)' }}>
            Admin Panel
          </h1>
        </Link>
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-white" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <Link
          href="/"
          target="_blank"
          className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <span>🌐</span>
          <span>Ver sitio público</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
