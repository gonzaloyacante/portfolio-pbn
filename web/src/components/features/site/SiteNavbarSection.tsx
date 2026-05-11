'use client'

import dynamic from 'next/dynamic'
import { Input, Switch, ColorPicker } from '@/components/ui'
import { BRAND } from '@/lib/design-tokens'

const GoogleFontPicker = dynamic(
  () =>
    import('@/components/ui/forms/GoogleFontPicker').then((m) => ({
      default: m.GoogleFontPicker,
    })),
  {
    ssr: false,
    loading: () => <div className="bg-muted h-14 w-full animate-pulse rounded-md" />,
  }
)

const DEFAULT_BRAND_COLOR_LIGHT = BRAND.foreground
const DEFAULT_BRAND_COLOR_DARK = BRAND.darkPrimary

interface PageVisibility {
  showAboutPage: boolean
  showGalleryPage: boolean
  showServicesPage: boolean
  showContactPage: boolean
}

interface SiteNavbarSectionProps {
  navbarShowBrand: boolean
  onNavbarShowBrandChange: (v: boolean) => void
  navbarBrandText: string
  onNavbarBrandTextChange: (v: string) => void
  navbarBrandFont: string
  onNavbarBrandFontChange: (v: string) => void
  navbarBrandFontUrl: string
  onNavbarBrandFontUrlChange: (v: string) => void
  navbarBrandFontSize: number
  onNavbarBrandFontSizeChange: (v: number) => void
  navbarBrandColor: string
  onNavbarBrandColorChange: (v: string) => void
  navbarBrandColorDark: string
  onNavbarBrandColorDarkChange: (v: string) => void
  pages: PageVisibility
  onPageChange: (key: keyof PageVisibility, value: boolean) => void
}

export function SiteNavbarSection({
  navbarShowBrand,
  onNavbarShowBrandChange,
  navbarBrandText,
  onNavbarBrandTextChange,
  navbarBrandFont,
  onNavbarBrandFontChange,
  navbarBrandFontUrl,
  onNavbarBrandFontUrlChange,
  navbarBrandFontSize,
  onNavbarBrandFontSizeChange,
  navbarBrandColor,
  onNavbarBrandColorChange,
  navbarBrandColorDark,
  onNavbarBrandColorDarkChange,
  pages,
  onPageChange,
}: SiteNavbarSectionProps) {
  const pageToggles: { label: string; key: keyof PageVisibility }[] = [
    { label: 'Sobre Mí', key: 'showAboutPage' },
    { label: 'Portfolio', key: 'showGalleryPage' },
    { label: 'Servicios', key: 'showServicesPage' },
    { label: 'Contacto', key: 'showContactPage' },
  ]

  return (
    <section className="border-border bg-card space-y-5 rounded-2xl border p-6">
      <div>
        <h2 className="font-heading text-lg font-semibold">Encabezado</h2>
        <p className="text-muted-foreground text-sm">
          Personaliza el nombre visible en la barra de navegación pública y controla qué páginas
          aparecen en el menú.
        </p>
      </div>

      <div className="border-border flex items-center justify-between rounded-xl border px-4 py-3">
        <div>
          <p className="text-sm font-medium">Mostrar nombre en navbar</p>
          <p className="text-muted-foreground text-xs">
            Muestra u oculta el nombre de marca en la cabecera del sitio.
          </p>
        </div>
        <Switch
          checked={navbarShowBrand}
          onCheckedChange={onNavbarShowBrandChange}
          aria-label="Mostrar nombre en navbar"
        />
      </div>

      {navbarShowBrand && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Texto del nombre"
              value={navbarBrandText}
              onChange={(e) => onNavbarBrandTextChange(e.target.value)}
              placeholder="Paola BN"
            />
          </div>

          <GoogleFontPicker
            value={navbarBrandFont || ''}
            onValueChange={(fontName, url) => {
              onNavbarBrandFontChange(fontName)
              onNavbarBrandFontUrlChange(url)
            }}
            label="Tipografía del nombre"
            description="Misma fuente que en el editor de tema (Google Fonts)."
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <label className="text-muted-foreground w-full shrink-0 text-xs font-medium tracking-wider uppercase sm:w-36">
              Tamaño (px)
            </label>
            <div className="flex w-full flex-1 items-center gap-4">
              <input
                type="range"
                min={8}
                max={120}
                step={1}
                className="bg-muted accent-primary h-2 flex-1 cursor-pointer appearance-none rounded-full"
                value={navbarBrandFontSize}
                onChange={(e) => onNavbarBrandFontSizeChange(Number(e.target.value))}
                aria-label="Tamaño fuente navbar"
              />
              <Input
                type="number"
                min={8}
                max={120}
                value={navbarBrandFontSize}
                onChange={(e) => onNavbarBrandFontSizeChange(Number(e.target.value))}
                className="w-24 text-right font-mono"
                aria-label="Tamaño fuente navbar en píxeles"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Color (modo claro)</p>
              <ColorPicker
                color={navbarBrandColor || DEFAULT_BRAND_COLOR_LIGHT}
                onChange={onNavbarBrandColorChange}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Color (modo oscuro)</p>
              <ColorPicker
                color={navbarBrandColorDark || DEFAULT_BRAND_COLOR_DARK}
                onChange={onNavbarBrandColorDarkChange}
              />
            </div>
          </div>
        </div>
      )}

      <div className="border-border space-y-3 rounded-xl border p-4">
        <p className="text-sm font-semibold">Visibilidad de páginas</p>
        <p className="text-muted-foreground text-xs">
          Las páginas desactivadas no aparecen en el menú de navegación.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {pageToggles.map(({ label, key }) => (
            <div
              key={key}
              className="bg-background flex items-center justify-between rounded-lg px-3 py-2"
            >
              <span className="text-sm font-medium">{label}</span>
              <Switch
                checked={pages[key]}
                onCheckedChange={(v) => onPageChange(key, v)}
                aria-label={`Mostrar página ${label}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
