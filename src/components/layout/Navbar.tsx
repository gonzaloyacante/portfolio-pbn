'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import ThemeToggle from '@/components/layout/ThemeToggle'
import { ROUTES } from '@/config/routes'

/**
 * Navbar - Block-Active Design (Canva Spec)
 * - Rectángulos perfectos (rounded-none)
 * - Animación suave del fondo activo con framer-motion layoutId
 * - Mobile: Links apilados verticalmente
 */

const navItems = [
  { href: ROUTES.home, label: 'Inicio' },
  { href: ROUTES.public.about, label: 'Sobre mi' },
  { href: ROUTES.public.projects, label: 'Proyectos' },
  { href: ROUTES.public.services, label: 'Servicios' },
  { href: ROUTES.public.contact, label: 'Contacto' },
]

interface NavbarProps {
  brandName?: string | null
}

export default function Navbar({ brandName }: NavbarProps) {
  const pathname = usePathname()
  const displayBrand = brandName || 'PBN'

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
        <Link
          href={ROUTES.home}
          className="font-script text-foreground mb-4 hidden text-3xl transition-transform duration-200 hover:scale-105 md:mb-0 md:block"
        >
          {displayBrand}
        </Link>

        {/* Navegación con block-active */}
        <div className="relative flex flex-wrap items-center justify-center gap-1 md:gap-0">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="font-heading relative px-6 py-3 text-sm font-semibold tracking-wide uppercase transition-colors duration-300 md:px-8 md:text-base"
              >
                {/* Fondo animado para el estado activo */}
                {active && (
                  <motion.span
                    layoutId="navbar-active-bg"
                    className="bg-primary absolute inset-0 rounded-none"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {/* Texto */}
                <span
                  className={`relative z-10 ${
                    active ? 'text-background' : 'text-foreground hover:text-accent'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}

          {/* Theme Toggle */}
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
