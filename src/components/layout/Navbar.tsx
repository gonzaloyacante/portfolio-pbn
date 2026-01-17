'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/ui'

/**
 * Navbar - Block-Active Design (Canva Spec)
 * - Rectángulos perfectos (rounded-none)
 * - Animación suave del fondo activo con framer-motion layoutId
 * - Mobile: Links apilados verticalmente
 */

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/sobre-mi', label: 'Sobre mi' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/contacto', label: 'Contacto' },
]

interface NavbarProps {
  brandName?: string | null
}

export default function Navbar({ brandName }: NavbarProps) {
  const pathname = usePathname()
  const displayBrand = brandName || 'PBN'

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href) ?? false
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/95 backdrop-blur-md transition-all duration-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-4 md:flex-row md:justify-between md:px-8 lg:px-16">
        {/* Logo - visible en pantallas grandes */}
        <Link
          href="/"
          className="mb-4 hidden font-script text-3xl text-foreground transition-transform duration-200 hover:scale-105 md:mb-0 md:block"
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
                className="relative px-6 py-3 font-heading text-sm font-semibold uppercase tracking-wide transition-colors duration-300 md:px-8 md:text-base"
              >
                {/* Fondo animado para el estado activo */}
                {active && (
                  <motion.span
                    layoutId="navbar-active-bg"
                    className="absolute inset-0 bg-primary rounded-none"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {/* Texto */}
                <span
                  className={`relative z-10 ${active
                    ? 'text-background'
                    : 'text-foreground hover:text-accent'
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
