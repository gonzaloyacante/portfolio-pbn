'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { clsx } from 'clsx'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  isActive: boolean
}

function NavLink({ href, children, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        'font-primary rounded-xl px-4 py-2 text-sm font-bold transition-all md:text-base',
        isActive
          ? 'bg-navlink-bg text-navlink-text shadow-md'
          : 'text-navlink-bg hover:bg-navlink-bg/10'
      )}
    >
      {children}
    </Link>
  )
}

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname?.startsWith(path)
  }

  return (
    <nav className="z-50 w-full">
      {/* Bloque Header Móvil (lg:hidden) */}
      <div className="bg-bg/80 border-primary/10 flex w-full items-center justify-between border-b px-4 py-3 backdrop-blur-md lg:hidden">
        {/* Logo + Firma */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-2xl">
            💄
          </Link>
          <Link href="/" className="font-script text-name text-xl">
            Paola Bolívar
          </Link>
        </div>

        {/* ThemeToggle */}
        <ThemeToggle />
      </div>

      {/* Bloque Navegación (Común) */}
      <div
        className={clsx(
          'flex flex-row items-center',
          // Móvil: Debajo del header, fondo rosa claro
          'bg-pink-light dark:bg-purple-dark/20 justify-center gap-4 py-3 lg:bg-transparent lg:dark:bg-transparent',
          // Desktop: Solo, margen superior, gap grande
          'lg:mt-8 lg:justify-center lg:gap-12'
        )}
      >
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

        {/* Desktop Theme Toggle (Hidden on Mobile since it's in the header) */}
        <div className="hidden lg:block">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
