'use client'

import { ROUTES } from '@/config/routes'
import type { HomeSettingsData } from '@/actions/settings/home'

const navItems = [
  { href: ROUTES.public.about, label: 'Sobre mí' },
  { href: ROUTES.public.portfolio, label: 'Portfolio' },
  { href: ROUTES.public.services, label: 'Servicios' },
  { href: ROUTES.public.contact, label: 'Contacto' },
]

interface HomePreviewNavbarProps {
  settings: HomeSettingsData | null
}

/**
 * Navbar estático SOLO para el preview del editor (no se usa en la página pública).
 * Replica visualmente el navbar público home:
 * - Brand oculto (variante home)
 * - Nav items siempre visibles (sin hamburger)
 * - pointer-events-none: no bloquea clicks sobre los items del hero
 * - position absolute: overlayea el hero desde arriba
 * - Non-functional: usa <span> en vez de <Link>, no navega
 *
 * Tamaño único generoso: el preview usa `transform: scale()` para ajustar el
 * viewport simulado al container. Las clases responsive de Tailwind (md:/lg:)
 * responden al viewport del browser (que en admin siempre es lg+), por eso
 * aquí usamos tamaños grandes fijos. El scale externo reduce proporcionalmente
 * para desktop/tablet/mobile — más legible que clases responsive por viewport.
 */
export function HomePreviewNavbar({ settings: _settings }: HomePreviewNavbarProps) {
  return (
    <>
      {/* Scrim superior — replica el gradiente del navbar público home */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[45vh]"
        style={{
          background: `linear-gradient(180deg, color-mix(in srgb, var(--foreground) 85%, transparent) 0%, color-mix(in srgb, var(--foreground) 35%, transparent) 41.67%, transparent 100%)`,
        }}
      />

      {/* Navbar — variante home: sin brand, sin hamburger */}
      <nav
        aria-label="Navbar (vista previa)"
        className="pointer-events-none absolute inset-x-0 top-4 z-50 w-full"
      >
        <div className="public-navbar-home-surface transition-all duration-300">
          <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pt-3 pb-0 md:px-8 lg:px-12">
            <div className="flex w-full items-center justify-center">
              <div className="relative flex w-full flex-row items-center justify-between gap-2 md:gap-4">
                {navItems.map((item) => (
                  <span
                    key={item.href}
                    className="public-navbar-link font-heading relative inline-flex min-h-14 flex-1 items-center justify-center py-3 text-xl font-semibold tracking-wide uppercase opacity-70 lg:min-h-16 lg:py-4 lg:text-2xl"
                  >
                    <span className="relative z-10">{item.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
