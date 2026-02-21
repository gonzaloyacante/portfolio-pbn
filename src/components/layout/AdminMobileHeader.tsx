'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Menu, X } from 'lucide-react'
import { showToast } from '@/lib/toast'
import ThemeToggle from '@/components/layout/ThemeToggle'
import { menuItems } from '@/config/admin-sidebar'
import { ROUTES } from '@/config/routes'

export default function AdminMobileHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Cerrar con ESC y bloquear scroll del body
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleSignOut = async () => {
    try {
      setIsOpen(false)
      await signOut({ callbackUrl: ROUTES.auth.login })
      showToast.success('Sesión cerrada exitosamente')
    } catch {
      showToast.error('Error al cerrar sesión')
    }
  }

  return (
    <>
      {/* Barra superior mobile */}
      <header className="bg-card border-border sticky top-0 z-40 flex h-14 items-center justify-between border-b px-4 backdrop-blur-md transition-colors duration-300 lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={isOpen}
          aria-controls="admin-mobile-nav"
          className="text-foreground hover:bg-accent rounded-lg p-2 transition-colors duration-200"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link
          href={ROUTES.admin.dashboard}
          className="font-script text-primary text-xl transition-all duration-200 hover:scale-105"
        >
          Admin Panel
        </Link>

        <ThemeToggle />
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <nav
        id="admin-mobile-nav"
        role="dialog"
        aria-label="Menú de navegación admin"
        aria-modal="true"
        className={`bg-card border-border fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabecera del drawer */}
        <div className="border-border flex items-center justify-between border-b p-5">
          <Link
            href={ROUTES.admin.dashboard}
            onClick={() => setIsOpen(false)}
            className="font-script text-primary text-2xl transition-all duration-200 hover:scale-105"
          >
            Admin Panel
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
            className="text-muted-foreground hover:bg-accent rounded-lg p-2 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items de navegación */}
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1" role="list">
            {menuItems.map((item: { href: string; icon: string; label: string }) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 active:scale-[0.98] ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-current opacity-50" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Footer del drawer */}
        <div className="border-border mt-auto border-t p-4">
          <Link
            href={ROUTES.home}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all duration-200"
          >
            <span>🌐</span>
            <span>Ver sitio público</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </nav>
    </>
  )
}
