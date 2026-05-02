'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { motion } from '@/components/ui'
import ThemeToggle from '@/components/layout/ThemeToggle'
import { ROUTES } from '@/config/routes'
import type { PageVisibility } from '@/actions/settings/site'

/**
 * Navbar - Block-Active Design (Canva Spec)
 * - Rectángulos perfectos (rounded-none)
 * - Animación suave del fondo activo con framer-motion layoutId
 * - Mobile: Links apilados verticalmente
 */

const allNavItems = [
  { href: ROUTES.home, label: 'Inicio', key: 'home' as const },
  { href: ROUTES.public.about, label: 'Sobre mi', key: 'about' as const },
  { href: ROUTES.public.portfolio, label: 'Portfolio', key: 'galleries' as const },
  { href: ROUTES.public.services, label: 'Servicios', key: 'services' as const },
  { href: ROUTES.public.contact, label: 'Contacto', key: 'contact' as const },
]

interface NavbarProps {
  brandName?: string | null
  visibility?: PageVisibility | null
}

export default function Navbar({ brandName, visibility }: NavbarProps) {
  const pathname = usePathname()
  const displayBrand = visibility?.navbarBrandText ?? brandName ?? 'PBN'
  const showBrand = visibility?.navbarShowBrand ?? true

  const navItems = useMemo(() => {
    if (!visibility) return allNavItems
    return allNavItems.filter((item) => {
      if (item.key === 'home') return true
      if (item.key === 'about') return visibility.showAboutPage
      if (item.key === 'galleries') return visibility.showGalleryPage
      if (item.key === 'services') return visibility.showServicesPage
      if (item.key === 'contact') return visibility.showContactPage
      return true
    })
  }, [visibility])

  const isActive = (href: string) => {
    if (href === ROUTES.home) return pathname === ROUTES.home
    return pathname?.startsWith(href) ?? false
  }

  return (
    <nav
      aria-label="Navegación principal"
      className="bg-background/95 sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-500"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-4 md:flex-row md:justify-between md:px-8 lg:px-16">
        {/* Logo - visible en pantallas grandes */}
        {showBrand && (
          <Link
            href={ROUTES.home}
            className="nb-brand font-script text-foreground mb-4 text-3xl transition-transform duration-200 hover:scale-105 md:mb-0"
          >
            {displayBrand}
          </Link>
        )}

        {/* Navegación: columna en móvil (mejor táctil); fila desde md */}
        <div className="relative flex w-full max-w-full flex-col items-center gap-2 md:flex-row md:flex-wrap md:justify-center md:gap-1 md:gap-x-0">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="font-heading relative inline-flex min-h-11 min-w-[44px] items-center justify-center px-5 py-3 text-sm font-semibold tracking-wide uppercase transition-colors duration-300 md:px-8 md:text-base"
              >
                {/* Fondo animado para el estado activo */}
                {active && (
                  <motion.span
                    layoutId="navbar-active-bg"
                    className="bg-primary absolute inset-0 rounded-none"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {/* Texto */}
                <span
                  className={`relative z-10 ${
                    active ? 'text-primary-foreground' : 'text-foreground hover:text-primary'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}

          {/* Theme Toggle — mismo ancho táctil que enlaces */}
          <div className="flex items-center justify-center gap-2 pt-1 md:ml-4 md:pt-0">
            <ThemeToggle />
            {/* <LanguageToggle /> */}
          </div>
        </div>
      </div>
    </nav>
  )
}
