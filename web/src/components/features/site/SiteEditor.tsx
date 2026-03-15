'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Save } from 'lucide-react'
import { Button, Input, Switch } from '@/components/ui'
import { showToast } from '@/lib/toast'
import type { SiteSettingsData } from '@/actions/settings/site'
import { updateSiteSettings } from '@/actions/settings/site'

interface SiteEditorProps {
  settings: SiteSettingsData | null
}

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

  // — Visibilidad de páginas
  const [showAboutPage, setShowAboutPage] = useState(settings?.showAboutPage ?? true)
  const [showProjectsPage, setShowProjectsPage] = useState(settings?.showProjectsPage ?? true)
  const [showServicesPage, setShowServicesPage] = useState(settings?.showServicesPage ?? false)
  const [showContactPage, setShowContactPage] = useState(settings?.showContactPage ?? true)
  const [allowIndexing, setAllowIndexing] = useState(settings?.allowIndexing ?? true)

  async function handleSave() {
    setSaving(true)
    try {
      const result = await updateSiteSettings({
        siteName: siteName.trim() || undefined,
        siteTagline: siteTagline.trim() || null,
        maintenanceMode,
        maintenanceMessage: maintenanceMessage.trim() || null,
        showAboutPage,
        showProjectsPage,
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

      {/* ── Visibilidad de páginas ─────────────────────────────────── */}
      <section className="border-border bg-card space-y-4 rounded-2xl border p-6">
        <div>
          <h2 className="font-heading text-lg font-semibold">Visibilidad de páginas</h2>
          <p className="text-muted-foreground text-sm">
            Activa o desactiva secciones del sitio público. Las páginas desactivadas no aparecen en
            el menú.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: 'Sobre Mí', value: showAboutPage, setter: setShowAboutPage },
            { label: 'Proyectos', value: showProjectsPage, setter: setShowProjectsPage },
            { label: 'Servicios', value: showServicesPage, setter: setShowServicesPage },
            { label: 'Contacto', value: showContactPage, setter: setShowContactPage },
          ].map(({ label, value, setter }) => (
            <div
              key={label}
              className="border-border flex items-center justify-between rounded-xl border px-4 py-3"
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
      </section>

      {/* ── SEO ───────────────────────────────────────────────────── */}
      <section className="border-border bg-card space-y-4 rounded-2xl border p-6">
        <div>
          <h2 className="font-heading text-lg font-semibold">SEO</h2>
          <p className="text-muted-foreground text-sm">
            Configuración de indexación para buscadores.
          </p>
        </div>
        <div className="border-border flex items-center justify-between rounded-xl border px-4 py-3">
          <div>
            <p className="text-sm font-medium">Permitir indexación</p>
            <p className="text-muted-foreground text-xs">
              Habilita que Google y otros motores indexen el sitio.
            </p>
          </div>
          <Switch
            checked={allowIndexing}
            onCheckedChange={setAllowIndexing}
            aria-label="Permitir indexación por buscadores"
          />
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
