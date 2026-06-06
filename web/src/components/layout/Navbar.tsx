'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { motion, AnimatePresence, OptimizedImage } from '@/components/ui'
import { Menu, X } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils'
import type { PageVisibility } from '@/actions/settings/site'

const allNavItems = [
  { href: ROUTES.public.about, label: 'Sobre mí', key: 'about' as const },
  { href: ROUTES.public.portfolio, label: 'Portfolio', key: 'galleries' as const },
  { href: ROUTES.public.services, label: 'Servicios', key: 'services' as const },
  { href: ROUTES.public.contact, label: 'Contacto', key: 'contact' as const },
]

const homeNavItem = { href: ROUTES.home, label: 'Inicio', key: 'home' as const }

interface NavbarProps {
  brandName?: string | null
  visibility?: PageVisibility | null
  brandLogoUrl?: string | null
  brandLogoAlt?: string | null
}

function NavbarBrand({
  href,
  displayBrand,
  brandLogoUrl,
  brandLogoAlt,
  imageClassName,
}: {
  href: string
  displayBrand: string
  brandLogoUrl?: string | null
  brandLogoAlt?: string | null
  imageClassName?: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 transition-transform duration-200 hover:scale-105"
    >
      {brandLogoUrl ? (
        <motion.div
          layoutId="public-brand-mark"
          className={cn('relative h-14 w-14 shrink-0', imageClassName)}
        >
          <OptimizedImage
            src={brandLogoUrl}
            alt={brandLogoAlt || displayBrand}
            fill
            sizes="72px"
            objectFit="contain"
            placeholder="empty"
            priority
          />
        </motion.div>
      ) : (
        <span className="nb-brand font-script text-3xl text-[var(--public-owner-name)]">
          {displayBrand}
        </span>
      )}
    </Link>
  )
}

export default function Navbar({ brandName, visibility, brandLogoUrl, brandLogoAlt }: NavbarProps) {
  const pathname = usePathname()
  const isHome = pathname === ROUTES.home
  const displayBrand = visibility?.navbarBrandText ?? brandName ?? 'PBN'
  const showBrand = visibility?.navbarShowBrand ?? true

  const visibleSectionItems = useMemo(() => {
    if (!visibility) return allNavItems
    return allNavItems.filter((item) => {
      if (item.key === 'about') return visibility.showAboutPage
      if (item.key === 'galleries') return visibility.showGalleryPage
      if (item.key === 'services') return visibility.showServicesPage
      if (item.key === 'contact') return visibility.showContactPage
      return true
    })
  }, [visibility])

  const navItems = useMemo(
    () => (isHome ? visibleSectionItems : [homeNavItem, ...visibleSectionItems]),
    [isHome, visibleSectionItems]
  )
  const mobileNavItems = useMemo(
    () => (isHome ? [homeNavItem, ...visibleSectionItems] : navItems),
    [isHome, navItems, visibleSectionItems]
  )

  const isActive = (href: string) => {
    if (href === ROUTES.home) return pathname === ROUTES.home
    return pathname?.startsWith(href) ?? false
  }

  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScrollY = useRef(0)

  useMotionValueEvent(scrollY, 'change', (current: number) => {
    const prev = lastScrollY.current
    lastScrollY.current = current

    if (current < prev) setVisible(true)
    else if (current > prev && current > 80 && !menuOpen) setVisible(false)
  })

  const showBrandInBar = showBrand && !isHome
  const showCollapsedMobileNav = !isHome
  const navSurfaceClass = isHome ? 'public-navbar-home-surface' : 'public-navbar-surface'
  const navPositionClass = isHome ? 'absolute inset-x-0 top-0' : 'sticky top-0'

  return (
    <motion.nav
      aria-label="Navegación principal"
      className={cn('z-50 w-full', navPositionClass)}
      animate={{ y: visible ? 0 : '-100%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className={cn('transition-all duration-300', navSurfaceClass)}>
        <div
          className={cn(
            'mx-auto max-w-7xl px-4 py-0 md:px-8 lg:px-16',
            isHome ? 'flex flex-col items-center' : 'flex items-center justify-between'
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            {showBrandInBar ? (
              <NavbarBrand
                href={ROUTES.home}
                displayBrand={displayBrand}
                brandLogoUrl={brandLogoUrl}
                brandLogoAlt={brandLogoAlt}
                imageClassName="h-16 w-16 md:h-[4.5rem] md:w-[4.5rem]"
              />
            ) : null}
          </div>

          <div className={cn('items-center justify-center', isHome ? 'flex' : 'hidden md:flex')}>
            <div className="relative flex flex-row flex-wrap items-center justify-center">
              {navItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'public-navbar-link font-heading relative inline-flex min-h-11 min-w-[44px] items-center justify-center px-4 py-2.5 text-sm font-semibold tracking-wide uppercase transition-colors duration-300 focus-visible:outline-none lg:px-8 lg:py-3 lg:text-base',
                      !active && 'hover:opacity-80'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="navbar-active-bg"
                        className="public-navbar-active absolute inset-0 rounded-none"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {showCollapsedMobileNav ? (
            <button
              type="button"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              onClick={() => {
                setVisible(true)
                setMenuOpen((open) => !open)
              }}
              className="public-navbar-toggle inline-flex h-11 w-11 items-center justify-center transition-colors md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          ) : null}
        </div>

        <AnimatePresence initial={false}>
          {showCollapsedMobileNav && menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.24, ease: 'easeInOut' }}
              className="public-navbar-menu-surface absolute top-full right-0 left-0 z-50 overflow-hidden border-t shadow-md md:hidden"
            >
              <div className="px-4 pb-4">
                <div className="grid gap-2 pt-3">
                  {mobileNavItems.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          'font-heading inline-flex min-h-11 items-center rounded-xl px-4 py-3 text-sm font-semibold uppercase transition-colors',
                          active ? 'public-navbar-active' : 'public-navbar-toggle hover:opacity-80'
                        )}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
