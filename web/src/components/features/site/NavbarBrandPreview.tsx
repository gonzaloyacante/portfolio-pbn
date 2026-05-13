'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun, ExternalLink } from 'lucide-react'
import { BRAND } from '@/lib/design-tokens'
import { ROUTES } from '@/config/routes'

interface PageVisibility {
  showAboutPage: boolean
  showGalleryPage: boolean
  showServicesPage: boolean
  showContactPage: boolean
}

interface NavbarBrandPreviewProps {
  navbarShowBrand: boolean
  navbarBrandText: string
  navbarBrandFont: string
  navbarBrandFontUrl: string
  navbarBrandFontSize: number
  navbarBrandColor: string
  navbarBrandColorDark: string
  pages: PageVisibility
}

const NAV_ITEMS = [
  { label: 'Inicio', key: 'home' as const, always: true },
  { label: 'Sobre mí', key: 'about' as const, pageKey: 'showAboutPage' as keyof PageVisibility },
  {
    label: 'Portfolio',
    key: 'galleries' as const,
    pageKey: 'showGalleryPage' as keyof PageVisibility,
  },
  {
    label: 'Servicios',
    key: 'services' as const,
    pageKey: 'showServicesPage' as keyof PageVisibility,
  },
  {
    label: 'Contacto',
    key: 'contact' as const,
    pageKey: 'showContactPage' as keyof PageVisibility,
  },
]

export function NavbarBrandPreview({
  navbarShowBrand,
  navbarBrandText,
  navbarBrandFont,
  navbarBrandFontUrl,
  navbarBrandFontSize,
  navbarBrandColor,
  navbarBrandColorDark,
  pages,
}: NavbarBrandPreviewProps) {
  const [isDark, setIsDark] = useState(false)
  const [activeItem, setActiveItem] = useState<string>('home')

  // Load custom brand font if provided
  useEffect(() => {
    if (!navbarBrandFontUrl) return
    const id = `preview-brand-font-${navbarBrandFont?.replace(/\s+/g, '-')}`
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = navbarBrandFontUrl
    document.head.appendChild(link)
  }, [navbarBrandFont, navbarBrandFontUrl])

  const bg = isDark ? BRAND.darkBackground : BRAND.background
  const fg = isDark ? BRAND.darkForeground : BRAND.foreground
  const primary = isDark ? BRAND.darkPrimary : BRAND.primary
  const borderColor = isDark ? '#2a1015' : '#e5e5e5'
  const accentBg = isDark ? '#2a1015' : '#fff1f9'

  const brandColor = isDark
    ? navbarBrandColorDark || BRAND.darkPrimary
    : navbarBrandColor || BRAND.foreground

  const fontFamily = navbarBrandFont
    ? `"${navbarBrandFont}", var(--font-script, 'Great Vibes'), cursive`
    : `var(--font-script, 'Great Vibes'), cursive`

  const visibleItems = NAV_ITEMS.filter((item) => (item.always ? true : pages[item.pageKey!]))

  return (
    <div
      className="border-border bg-card space-y-3 rounded-2xl border p-4"
      aria-label="Vista previa de la barra de navegación"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Vista previa — Navbar
        </p>
        <div className="flex items-center gap-2">
          <a
            href={ROUTES.home}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Ver en la web"
          >
            <ExternalLink className="size-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setIsDark((d) => !d)}
            className="text-muted-foreground hover:text-foreground bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors"
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? <Sun className="size-3" /> : <Moon className="size-3" />}
            {isDark ? 'Claro' : 'Oscuro'}
          </button>
        </div>
      </div>

      {/* Navbar simulation */}
      <div
        className="overflow-hidden rounded-xl border shadow-sm"
        style={{ background: `${bg}f2`, borderColor }}
      >
        <div
          className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b px-4 py-3"
          style={{ borderColor }}
        >
          {/* Brand */}
          {navbarShowBrand && (
            <span
              style={{
                fontFamily,
                fontSize: Math.max(14, Math.min(navbarBrandFontSize * 0.6, 36)),
                color: brandColor,
                lineHeight: 1.2,
                transition: 'color 0.3s',
              }}
            >
              {navbarBrandText || 'Paola BN'}
            </span>
          )}

          {/* Nav items */}
          <div className="flex flex-wrap items-center gap-0.5">
            {visibleItems.map((item) => {
              const isActive = activeItem === item.key
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveItem(item.key)}
                  className="relative inline-flex items-center justify-center rounded-none px-3 py-2 text-xs font-semibold tracking-wide uppercase transition-colors duration-300"
                  style={{
                    color: isActive ? (isDark ? BRAND.darkBackground : '#fff') : fg,
                    background: isActive ? primary : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = accentBg
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Page content hint */}
        <div className="px-4 py-3 text-center text-xs" style={{ color: `${fg}66` }}>
          Contenido de la página…
        </div>
      </div>

      {/* Info: hidden brand */}
      {!navbarShowBrand && (
        <p className="text-muted-foreground rounded-lg bg-yellow-50 px-3 py-2 text-xs dark:bg-yellow-900/20">
          El nombre de marca está oculto en el navbar.
        </p>
      )}

      {/* Font info */}
      {navbarShowBrand && navbarBrandFont && (
        <p className="text-muted-foreground text-xs">
          Fuente: <span className="font-medium">{navbarBrandFont}</span>
          {' · '}
          {navbarBrandFontSize}px
        </p>
      )}
    </div>
  )
}
