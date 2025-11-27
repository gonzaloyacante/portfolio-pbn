'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/admin/analitica', label: 'Analítica', icon: '📊' },
  { href: '/admin/gestion/projects', label: 'Proyectos', icon: '🎨' },
  { href: '/admin/gestion/categories', label: 'Categorías', icon: '📁' },
  { href: '/admin/testimonios', label: 'Testimonios', icon: '💬' },
  { href: '/admin/contactos', label: 'Contactos', icon: '📧' },
  { href: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
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
    <aside className="flex min-h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <Link href="/admin/dashboard" className="block">
          <h1 className="font-script text-primary text-2xl">Admin Panel</h1>
          <p className="mt-1 text-sm text-gray-500">Paola Biaggini</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer - Logout */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
