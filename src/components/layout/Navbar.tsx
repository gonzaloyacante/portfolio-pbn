'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ui'

/**
 * Navbar - Sin menú hamburguesa
 * Navegación siempre visible en todas las resoluciones
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
    <nav className="bg-pink-light/80 dark:bg-purple-dark/20 border-wine/10 dark:border-pink-light/10 sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-2 py-3 sm:flex-row sm:justify-between sm:px-4 md:px-8 lg:px-16">
        {/* Logo - solo visible en pantallas grandes */}
        <Link
          href="/"
          className="font-script text-wine dark:text-pink-hot mb-2 hidden text-2xl transition-all duration-200 hover:scale-105 sm:mb-0 sm:block"
        >
          {displayBrand}
        </Link>

        {/* Navegación siempre visible */}
        <div className="flex w-full items-center justify-center gap-1 sm:w-auto sm:gap-2 md:gap-4 lg:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-heading cursor-pointer rounded-xl px-2 py-1.5 text-xs font-bold transition-all duration-200 sm:px-3 sm:py-2 sm:text-sm md:px-4 md:text-base lg:px-5 lg:py-2.5 ${
                isActive(item.href)
                  ? 'bg-wine text-pink-light dark:bg-pink-hot dark:text-purple-dark shadow-md'
                  : 'text-wine/80 hover:bg-wine/10 dark:text-pink-light/80 dark:hover:bg-pink-light/10'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Theme Toggle */}
          <div className="ml-1 sm:ml-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
