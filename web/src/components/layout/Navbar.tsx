'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { motion } from '@/components/ui'
// import ThemeToggle from '@/components/layout/ThemeToggle'
import { ROUTES } from '@/config/routes'
import type { PageVisibility } from '@/actions/settings/site'

/**
 * Navbar - Block-Active Design (Canva Spec)
 * - Rectángulos perfectos (rounded-none)
 * - Animación suave del fondo activo con framer-motion layoutId
 * - Siempre horizontal: los items NUNCA se apilan verticalmente
 * - El logo/firma es el link a Inicio — no existe "Inicio" en los nav items
 */

const allNavItems = [
  { href: ROUTES.public.about, label: 'Sobre mí', key: 'about' as const },
  { href: ROUTES.public.portfolio, label: 'Portfolio', key: 'galleries' as const },
  { href: ROUTES.public.services, label: 'Servicios', key: 'services' as const },
  { href: ROUTES.public.contact, label: 'Contacto', key: 'contact' as const },
]

interface NavbarProps {
  brandName?: string | null
  visibility?: PageVisibility | null
  /** Home con hero full-bleed: barra más translúcida para ver el fondo */
  immersiveHeroBackdrop?: boolean
}

export default function Navbar({ brandName, visibility }: NavbarProps) {
  const pathname = usePathname()
  const displayBrand = visibility?.navbarBrandText ?? brandName ?? 'PBN'
  const showBrand = visibility?.navbarShowBrand ?? true

  const navItems = useMemo(() => {
    if (!visibility) return allNavItems
    return allNavItems.filter((item) => {
      if (item.key === 'about') return visibility.showAboutPage
      if (item.key === 'galleries') return visibility.showGalleryPage
      if (item.key === 'services') return visibility.showServicesPage
      if (item.key === 'contact') return visibility.showContactPage
      return true
    })
  }, [visibility])

  const isActive = (href: string) => {
    return pathname?.startsWith(href) ?? false
  }

  return (
    <nav
      aria-label="Navegación principal"
      className="sticky top-0 z-50 w-full transition-all duration-500"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-4 md:flex-row md:justify-between md:px-8 lg:px-16">
        {/* Logo / Firma — link a Inicio */}
        {showBrand && (
          <Link
            href={ROUTES.home}
            className="nb-brand font-script text-foreground mb-3 text-3xl transition-transform duration-200 hover:scale-105 md:mb-0"
          >
            {displayBrand}
          </Link>
        )}

        {/*
          Nav items: SIEMPRE fila horizontal.
          px-4/text-xs en mobile → 4 items caben en una sola fila incluso en 320px.
          flex-wrap + justify-center: si algún item forzara wrap, queda centrado.
        */}
        <div className="relative flex flex-row flex-wrap items-center justify-center">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-heading focus-visible:bg-accent focus-visible:text-accent-foreground relative inline-flex min-h-11 min-w-[44px] items-center justify-center px-4 py-2.5 text-xs font-semibold tracking-normal uppercase transition-colors duration-300 focus-visible:outline-none sm:px-5 sm:text-sm sm:tracking-wide md:px-8 md:py-3 md:text-base ${
                  active
                    ? 'text-primary-foreground'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
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
                <span className="relative z-10">{item.label}</span>
              </Link>
            )
          })}

          {/*
            Modo oscuro deshabilitado temporalmente.
            Reactivar cuando bug esté resuelto:
            <div className="flex items-center justify-center gap-2 pt-1 md:ml-4 md:pt-0">
              <ThemeToggle />
            </div>
          */}
        </div>
      </div>
    </nav>
  )
}
