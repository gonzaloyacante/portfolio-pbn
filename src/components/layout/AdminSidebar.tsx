'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Globe, LogOut } from 'lucide-react'
import { showToast } from '@/lib/toast'
import ThemeToggle from '@/components/layout/ThemeToggle'
import { menuItems, type SidebarItem } from '@/config/admin-sidebar'
import { ROUTES } from '@/config/routes'

export default function AdminSidebar() {
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: ROUTES.auth.login })
      showToast.success('Sesión cerrada exitosamente')
    } catch {
      showToast.error('Error al cerrar sesión')
    }
  }

  return (
    <aside className="bg-card border-border sticky top-0 hidden h-screen w-64 flex-col border-r backdrop-blur-md transition-colors duration-300 lg:flex">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b p-6">
        <Link
          href={ROUTES.admin.dashboard}
          className="block cursor-pointer transition-all duration-200 hover:scale-105"
        >
          <h1 className="font-script text-primary text-2xl">Admin Panel</h1>
        </Link>
        <ThemeToggle />
      </div>

      {/* Navigation - Scrollable */}
      <nav
        aria-label="Navegación del panel de administración"
        className="flex-1 space-y-1 overflow-y-auto p-4"
      >
        {menuItems.map((item: SidebarItem) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const IconComponent = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <IconComponent size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="font-medium">{item.label}</span>
              {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-current opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer - Sticky */}
      <div className="border-border mt-auto border-t p-4">
        <Link
          href={ROUTES.home}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground mb-2 flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Globe size={16} />
          <span>Ver sitio público</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="text-destructive hover:bg-destructive/10 flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <LogOut size={18} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
