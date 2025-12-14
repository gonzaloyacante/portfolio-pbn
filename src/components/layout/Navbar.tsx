'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

/**
 * Navbar - Diseño exacto de Canva
 * Desktop: Horizontal con botón activo con fondo wine
 * Mobile: Hamburger menu
 */

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/sobre-mi', label: 'Sobre mi' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href) ?? false
  }

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: 'var(--color-background, #fff1f9)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-12 lg:px-16">
        {/* Logo móvil */}
        <Link
          href="/"
          className="font-script text-2xl lg:hidden"
          style={{ color: 'var(--color-text-primary, #6c0a0a)' }}
        >
          PBN
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden w-full items-center justify-center gap-4 lg:flex lg:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-heading px-5 py-2.5 text-base font-bold transition-all duration-200"
              style={{
                backgroundColor: isActive(item.href)
                  ? 'var(--color-text-primary, #6c0a0a)'
                  : 'transparent',
                color: isActive(item.href) ? '#ffffff' : 'var(--color-text-primary, #6c0a0a)',
                fontWeight: 'var(--font-heading-weight, 700)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center lg:hidden"
          style={{ color: 'var(--color-text-primary, #6c0a0a)' }}
          aria-label="Menu"
        >
          {isMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="flex flex-col gap-1 pb-4 lg:hidden"
          style={{ backgroundColor: 'var(--color-background, #fff1f9)' }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="font-heading mx-4 px-4 py-3 text-center text-lg font-bold"
              style={{
                backgroundColor: isActive(item.href)
                  ? 'var(--color-text-primary, #6c0a0a)'
                  : 'transparent',
                color: isActive(item.href) ? '#ffffff' : 'var(--color-text-primary, #6c0a0a)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
