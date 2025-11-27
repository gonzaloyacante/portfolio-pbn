'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  isActive: boolean
}

function NavLink({ href, children, isActive }: NavLinkProps) {
  if (isActive) {
    return (
      <Link
        href={href}
        className="bg-purple-dark text-pink-light hover:bg-purple-dark/90 dark:bg-wine dark:text-pink-light rounded-2xl px-5 py-2.5 font-semibold shadow-md transition-all hover:shadow-lg"
      >
        {children}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="text-wine hover:bg-wine/5 dark:text-pink-hot dark:hover:bg-pink-hot/10 rounded-xl px-4 py-2 font-medium transition-all"
    >
      {children}
    </Link>
  )
}

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(path)
  }

  return (
    <nav className="z-10 w-full bg-transparent px-4 py-6 md:px-12">
      {/* Desktop Layout */}
      <div className="hidden items-center justify-between md:flex">
        {/* Logo / Signature */}
        <Link
          href="/"
          className="font-script text-wine dark:text-pink-hot text-4xl transition-opacity hover:opacity-90 md:text-5xl"
        >
          Pin-up
        </Link>

        {/* Navigation Links + Theme Toggle */}
        <div className="flex items-center gap-6">
          <NavLink href="/" isActive={isActive('/')}>
            Inicio
          </NavLink>
          <NavLink href="/sobre-mi" isActive={isActive('/sobre-mi')}>
            Sobre mí
          </NavLink>
          <NavLink href="/proyectos" isActive={isActive('/proyectos')}>
            Proyectos
          </NavLink>
          <NavLink href="/contacto" isActive={isActive('/contacto')}>
            Contacto
          </NavLink>

          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 md:hidden">
        {/* Top Row: Logo + Theme Toggle */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-script text-wine dark:text-pink-hot text-3xl transition-opacity hover:opacity-90"
          >
            Pin-up
          </Link>
          <ThemeToggle />
        </div>

        {/* Signature */}
        <div className="text-center">
          <p className="font-script text-pink-hot dark:text-pink-dark text-2xl">
            Paola Bolívar Nievas
          </p>
        </div>

        {/* Navigation Links (Horizontal Row) */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <NavLink href="/" isActive={isActive('/')}>
            Inicio
          </NavLink>
          <NavLink href="/sobre-mi" isActive={isActive('/sobre-mi')}>
            Sobre mí
          </NavLink>
          <NavLink href="/proyectos" isActive={isActive('/proyectos')}>
            Proyectos
          </NavLink>
          <NavLink href="/contacto" isActive={isActive('/contacto')}>
            Contacto
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
