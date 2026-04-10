'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Save } from 'lucide-react'
import { Button, Input, Switch } from '@/components/ui'
import { showToast } from '@/lib/toast'
import type { SiteSettingsData } from '@/actions/settings/site'
import { updateSiteSettings } from '@/actions/settings/site'
import { BRAND } from '@/lib/design-tokens'

interface SiteEditorProps {
  settings: SiteSettingsData | null
}

// Default brand colors for the color-picker editor fields — sourced from design-tokens.
const DEFAULT_BRAND_COLOR_LIGHT = BRAND.foreground
const DEFAULT_BRAND_COLOR_DARK = BRAND.darkPrimary

export function SiteEditor({ settings }: SiteEditorProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  // — Identidad del sitio
  const [siteName, setSiteName] = useState(
    settings?.siteName ?? 'Paola Bolívar Nievas - Make-up Artist'
  )
  const [siteTagline, setSiteTagline] = useState(settings?.siteTagline ?? '')

  // — Modo mantenimiento
  const [maintenanceMode, setMaintenanceMode] = useState(settings?.maintenanceMode ?? false)
  const [maintenanceMessage, setMaintenanceMessage] = useState(settings?.maintenanceMessage ?? '')

  // — Encabezado / Navbar brand
  const [navbarShowBrand, setNavbarShowBrand] = useState(settings?.navbarShowBrand ?? true)
  const [navbarBrandText, setNavbarBrandText] = useState(settings?.navbarBrandText ?? '')
  const [navbarBrandFont, setNavbarBrandFont] = useState(settings?.navbarBrandFont ?? '')
  const [navbarBrandFontUrl, setNavbarBrandFontUrl] = useState(settings?.navbarBrandFontUrl ?? '')
  const [navbarBrandFontSize, setNavbarBrandFontSize] = useState(
    settings?.navbarBrandFontSize ?? 30
  )
  const [navbarBrandColor, setNavbarBrandColor] = useState(settings?.navbarBrandColor ?? '')
  const [navbarBrandColorDark, setNavbarBrandColorDark] = useState(
    settings?.navbarBrandColorDark ?? ''
  )

  // — Visibilidad de páginas
  const [showAboutPage, setShowAboutPage] = useState(settings?.showAboutPage ?? true)
  const [showGalleryPage, setShowGalleryPage] = useState(settings?.showGalleryPage ?? true)
  const [showServicesPage, setShowServicesPage] = useState(settings?.showServicesPage ?? false)
  const [showContactPage, setShowContactPage] = useState(settings?.showContactPage ?? true)
  const [allowIndexing] = useState(settings?.allowIndexing ?? true)

  async function handleSave() {
    setSaving(true)
    try {
      const result = await updateSiteSettings({
        siteName: siteName.trim() || undefined,
        siteTagline: siteTagline.trim() || null,
        maintenanceMode,
        maintenanceMessage: maintenanceMessage.trim() || null,
        navbarShowBrand,
        navbarBrandText: navbarBrandText.trim() || null,
        navbarBrandFont: navbarBrandFont.trim() || null,
        navbarBrandFontUrl: navbarBrandFontUrl.trim() || null,
        navbarBrandFontSize: navbarBrandFontSize || null,
        navbarBrandColor: navbarBrandColor.trim() || null,
        navbarBrandColorDark: navbarBrandColorDark.trim() || null,
        showAboutPage,
        showGalleryPage,
        showServicesPage,
        showContactPage,
        allowIndexing,
      })
      if (!result.success) {
        showToast.error(result.error ?? 'Error al guardar')
        return
      }
      showToast.success('Configuración del sitio guardada')
      router.refresh()
    } catch {
      showToast.error('Error inesperado al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* ── Modo Mantenimiento ─────────────────────────────────────── */}
      <section
        className={`space-y-4 rounded-2xl border p-6 transition-colors ${
          maintenanceMode
            ? 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-950/30'
            : 'border-border bg-card'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className={`mt-0.5 size-5 shrink-0 ${maintenanceMode ? 'text-orange-500' : 'text-muted-foreground'}`}
            />
            <div>
              <p className="font-semibold">Modo mantenimiento</p>
              <p className="text-muted-foreground text-sm">
                Cuando está activo, el sitio público muestra una página de mantenimiento en lugar
                del contenido.
              </p>
            </div>
          </div>
          <Switch
            checked={maintenanceMode}
            onCheckedChange={setMaintenanceMode}
            aria-label="Activar modo mantenimiento"
          />
        </div>
        {maintenanceMode && (
          <textarea
            value={maintenanceMessage}
            onChange={(e) => setMaintenanceMessage(e.target.value)}
            placeholder="Estamos realizando mejoras. Volvemos pronto."
            rows={2}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary/50 w-full resize-none rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        )}
        {maintenanceMode && (
          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
            ⚠️ El sitio público está en mantenimiento — los visitantes no pueden ver el contenido.
          </p>
        )}
      </section>

      {/* ── Identidad del sitio ────────────────────────────────────── */}
      <section className="border-border bg-card space-y-5 rounded-2xl border p-6">
        <h2 className="font-heading text-lg font-semibold">Identidad del sitio</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Nombre del sitio</label>
            <Input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Paola Bolívar Nievas - Make-up Artist"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Eslogan</label>
            <Input
              value={siteTagline}
              onChange={(e) => setSiteTagline(e.target.value)}
              placeholder="Make-up Artist & Fotografía"
            />
          </div>
        </div>
      </section>

      {/* ── Encabezado ─────────────────────────────────────────────── */}
      <section className="border-border bg-card space-y-5 rounded-2xl border p-6">
        <div>
          <h2 className="font-heading text-lg font-semibold">Encabezado</h2>
          <p className="text-muted-foreground text-sm">
            Personaliza el nombre visible en la barra de navegación pública y controla qué páginas
            aparecen en el menú.
          </p>
        </div>

        {/* Mostrar nombre en navbar */}
        <div className="border-border flex items-center justify-between rounded-xl border px-4 py-3">
          <div>
            <p className="text-sm font-medium">Mostrar nombre en navbar</p>
            <p className="text-muted-foreground text-xs">
              Muestra u oculta el nombre de marca en la cabecera del sitio.
            </p>
          </div>
          <Switch
            checked={navbarShowBrand}
            onCheckedChange={setNavbarShowBrand}
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
                  onChange={(e) => setNavbarBrandText(e.target.value)}
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
                  onChange={(e) => setNavbarBrandFontSize(Number(e.target.value))}
                  placeholder="30"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Fuente (nombre)</label>
                <Input
                  value={navbarBrandFont}
                  onChange={(e) => setNavbarBrandFont(e.target.value)}
                  placeholder="Great Vibes"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">URL Google Fonts</label>
                <Input
                  value={navbarBrandFontUrl}
                  onChange={(e) => setNavbarBrandFontUrl(e.target.value)}
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
                    onChange={(e) => setNavbarBrandColor(e.target.value)}
                    className="border-border h-9 w-9 cursor-pointer rounded border p-0.5"
                    aria-label="Color modo claro"
                  />
                  <Input
                    value={navbarBrandColor}
                    onChange={(e) => setNavbarBrandColor(e.target.value)}
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
                    onChange={(e) => setNavbarBrandColorDark(e.target.value)}
                    className="border-border h-9 w-9 cursor-pointer rounded border p-0.5"
                    aria-label="Color modo oscuro"
                  />
                  <Input
                    value={navbarBrandColorDark}
                    onChange={(e) => setNavbarBrandColorDark(e.target.value)}
                    placeholder={DEFAULT_BRAND_COLOR_DARK}
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visibilidad de páginas (dentro de Encabezado) */}
        <div className="border-border space-y-3 rounded-xl border p-4">
          <p className="text-sm font-semibold">Visibilidad de páginas</p>
          <p className="text-muted-foreground text-xs">
            Las páginas desactivadas no aparecen en el menú de navegación.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Sobre Mí', value: showAboutPage, setter: setShowAboutPage },
              { label: 'Portfolio', value: showGalleryPage, setter: setShowGalleryPage },
              { label: 'Servicios', value: showServicesPage, setter: setShowServicesPage },
              { label: 'Contacto', value: showContactPage, setter: setShowContactPage },
            ].map(({ label, value, setter }) => (
              <div
                key={label}
                className="bg-background flex items-center justify-between rounded-lg px-3 py-2"
              >
                <span className="text-sm font-medium">{label}</span>
                <Switch
                  checked={value}
                  onCheckedChange={setter}
                  aria-label={`Mostrar página ${label}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guardar ───────────────────────────────────────────────── */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="size-4" />
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  )
}
