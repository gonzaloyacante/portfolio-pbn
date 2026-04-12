import { Input, Switch } from '@/components/ui'
import { BRAND } from '@/lib/design-tokens'

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
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Texto del nombre</label>
              <Input
                value={navbarBrandText}
                onChange={(e) => onNavbarBrandTextChange(e.target.value)}
                placeholder="Paola BN"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tamaño (px)</label>
              <Input
                type="number"
                min={8}
                max={120}
                value={navbarBrandFontSize}
                onChange={(e) => onNavbarBrandFontSizeChange(Number(e.target.value))}
                placeholder="30"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Fuente (nombre)</label>
              <Input
                value={navbarBrandFont}
                onChange={(e) => onNavbarBrandFontChange(e.target.value)}
                placeholder="Great Vibes"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">URL Google Fonts</label>
              <Input
                value={navbarBrandFontUrl}
                onChange={(e) => onNavbarBrandFontUrlChange(e.target.value)}
                placeholder="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Color (modo claro)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={navbarBrandColor || DEFAULT_BRAND_COLOR_LIGHT}
                  onChange={(e) => onNavbarBrandColorChange(e.target.value)}
                  className="border-border h-9 w-9 cursor-pointer rounded border p-0.5"
                  aria-label="Color modo claro"
                />
                <Input
                  value={navbarBrandColor}
                  onChange={(e) => onNavbarBrandColorChange(e.target.value)}
                  placeholder={DEFAULT_BRAND_COLOR_LIGHT}
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Color (modo oscuro)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={navbarBrandColorDark || DEFAULT_BRAND_COLOR_DARK}
                  onChange={(e) => onNavbarBrandColorDarkChange(e.target.value)}
                  className="border-border h-9 w-9 cursor-pointer rounded border p-0.5"
                  aria-label="Color modo oscuro"
                />
                <Input
                  value={navbarBrandColorDark}
                  onChange={(e) => onNavbarBrandColorDarkChange(e.target.value)}
                  placeholder={DEFAULT_BRAND_COLOR_DARK}
                  className="font-mono"
                />
              </div>
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
