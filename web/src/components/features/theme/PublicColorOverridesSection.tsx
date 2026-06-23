'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui'
import { ColorPicker } from '@/components/ui'
import { showToast } from '@/lib/toast'
import {
  upsertPublicColorOverrides,
  deletePublicColorOverride,
} from '@/actions/settings/public-colors'
import type { PublicColorOverrides } from '@/actions/settings/public-colors'
import { ChevronDown, ChevronUp, X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type ColorKey = { key: string; label: string }
type ColorGroup = {
  id: string
  label: string
  emoji: string
  primary: ColorKey[]
  advanced?: ColorKey[]
}

const GROUPS: ColorGroup[] = [
  {
    id: 'nav',
    label: 'Navegación',
    emoji: '🧭',
    primary: [
      { key: 'nav-bg', label: 'Fondo navbar' },
      { key: 'nav-text', label: 'Texto navbar' },
    ],
  },
  {
    id: 'hero',
    label: 'Hero',
    emoji: '✨',
    primary: [
      { key: 'makeup', label: 'Texto "Make-up"' },
      { key: 'portfolio', label: 'Texto "Portfolio"' },
      { key: 'owner-name', label: 'Nombre propietario' },
      { key: 'hero-cta-bg', label: 'Botón CTA fondo' },
      { key: 'hero-cta-text', label: 'Botón CTA texto' },
      { key: 'hero-cta-border', label: 'Botón CTA borde' },
    ],
  },
  {
    id: 'about',
    label: 'Sobre mí',
    emoji: '👩',
    primary: [
      { key: 'about-title', label: 'Título principal' },
      { key: 'about-heading', label: 'Subtítulo' },
      { key: 'about-text', label: 'Texto' },
      { key: 'about-page-bg', label: 'Fondo página' },
      { key: 'about-skill-chip-bg', label: 'Chip habilidad fondo' },
      { key: 'about-skill-chip-border', label: 'Chip habilidad borde' },
      { key: 'about-skill-chip-text', label: 'Chip habilidad texto' },
    ],
    advanced: [
      { key: 'about-portrait-fallback-start', label: 'Retrato gradiente inicio' },
      { key: 'about-portrait-fallback-end', label: 'Retrato gradiente fin' },
      { key: 'about-portrait-fallback-icon', label: 'Retrato ícono' },
      { key: 'about-testimonials-section-bg', label: 'Sección testimonios fondo' },
      { key: 'about-testimonial-card-bg', label: 'Tarjeta testimonio fondo' },
      { key: 'about-testimonial-card-border', label: 'Tarjeta borde' },
      { key: 'about-testimonial-cta-bg', label: 'CTA fondo' },
      { key: 'about-testimonial-cta-text', label: 'CTA texto' },
      { key: 'about-testimonial-title', label: 'Título' },
      { key: 'about-testimonial-text', label: 'Texto' },
      { key: 'about-testimonial-meta', label: 'Meta' },
    ],
  },
  {
    id: 'gallery',
    label: 'Galería',
    emoji: '🖼️',
    primary: [
      { key: 'category-title', label: 'Título categoría' },
      { key: 'category-back-bg', label: 'Botón volver fondo' },
      { key: 'category-back-text', label: 'Botón volver texto' },
    ],
  },
  {
    id: 'services',
    label: 'Servicios',
    emoji: '💄',
    primary: [
      { key: 'services-title', label: 'Título' },
      { key: 'services-text', label: 'Texto' },
      { key: 'services-page-bg', label: 'Fondo página' },
      { key: 'services-accent-bg', label: 'Acento fondo' },
      { key: 'services-accent-text', label: 'Acento texto' },
    ],
    advanced: [
      { key: 'services-chip-bg', label: 'Chip fondo' },
      { key: 'services-chip-border', label: 'Chip borde' },
      { key: 'services-chip-text', label: 'Chip texto' },
      { key: 'services-hero-text', label: 'Hero texto' },
      { key: 'services-hero-subtext', label: 'Hero subtexto' },
      { key: 'services-hero-overlay', label: 'Hero overlay' },
      { key: 'services-muted', label: 'Muted' },
      { key: 'services-surface', label: 'Superficie' },
      { key: 'services-surface-border', label: 'Superficie borde' },
    ],
  },
  {
    id: 'contact',
    label: 'Contacto',
    emoji: '📬',
    primary: [
      { key: 'contact-submit-bg', label: 'Botón enviar fondo' },
      { key: 'contact-submit-text', label: 'Botón enviar texto' },
      { key: 'contact-link', label: 'Link' },
    ],
    advanced: [
      { key: 'contact-field-bg', label: 'Campo fondo' },
      { key: 'contact-field-border', label: 'Campo borde' },
      { key: 'contact-field-placeholder', label: 'Placeholder' },
      { key: 'contact-field-text', label: 'Campo texto' },
      { key: 'contact-form-surface', label: 'Superficie' },
      { key: 'contact-form-title', label: 'Título' },
      { key: 'contact-form-text', label: 'Texto' },
      { key: 'contact-form-muted', label: 'Muted' },
      { key: 'contact-form-border', label: 'Borde' },
      { key: 'contact-form-link', label: 'Link' },
      { key: 'contact-info-text', label: 'Info texto' },
      { key: 'contact-info-border', label: 'Info borde' },
      { key: 'contact-option-bg', label: 'Opción fondo' },
      { key: 'contact-option-text', label: 'Opción texto' },
      { key: 'contact-option-border', label: 'Opción borde' },
      { key: 'contact-option-active-bg', label: 'Opción activa fondo' },
      { key: 'contact-option-active-text', label: 'Opción activa texto' },
      { key: 'contact-privacy-bg', label: 'Privacidad fondo' },
      { key: 'contact-privacy-text', label: 'Privacidad texto' },
      { key: 'contact-privacy-border', label: 'Privacidad borde' },
      { key: 'contact-privacy-link', label: 'Privacidad link' },
      { key: 'contact-instagram-bg', label: 'Instagram fondo' },
      { key: 'contact-instagram-border', label: 'Instagram borde' },
      { key: 'contact-error', label: 'Error' },
    ],
  },
  {
    id: 'testimonials',
    label: 'Testimonios',
    emoji: '⭐',
    primary: [
      { key: 'testimonial-section-bg', label: 'Sección fondo' },
      { key: 'testimonial-card-bg', label: 'Tarjeta fondo' },
      { key: 'testimonial-title', label: 'Título' },
      { key: 'testimonial-star', label: 'Estrella activa' },
      { key: 'testimonial-cta-bg', label: 'CTA fondo' },
      { key: 'testimonial-cta-text', label: 'CTA texto' },
    ],
    advanced: [
      { key: 'testimonial-card-border', label: 'Tarjeta borde' },
      { key: 'testimonial-text', label: 'Texto' },
      { key: 'testimonial-meta', label: 'Meta' },
      { key: 'testimonial-verified', label: 'Verificado' },
      { key: 'testimonial-star-inactive', label: 'Estrella inactiva' },
      { key: 'testimonial-dot-active', label: 'Punto activo' },
      { key: 'testimonial-dot-inactive', label: 'Punto inactivo' },
      { key: 'testimonial-nav-bg', label: 'Nav fondo' },
      { key: 'testimonial-nav-border', label: 'Nav borde' },
      { key: 'testimonial-nav-text', label: 'Nav texto' },
      { key: 'testimonial-avatar-bg', label: 'Avatar fondo' },
      { key: 'testimonial-avatar-border', label: 'Avatar borde' },
      { key: 'testimonial-avatar-text', label: 'Avatar texto' },
      { key: 'testimonial-page-bg', label: 'Página fondo' },
      { key: 'testimonial-field-bg', label: 'Campo fondo' },
      { key: 'testimonial-field-border', label: 'Campo borde' },
      { key: 'testimonial-field-text', label: 'Campo texto' },
      { key: 'testimonial-field-placeholder', label: 'Placeholder' },
      { key: 'testimonial-form-surface', label: 'Form superficie' },
      { key: 'testimonial-success-surface', label: 'Éxito superficie' },
      { key: 'testimonial-success-title', label: 'Éxito título' },
      { key: 'testimonial-success-text', label: 'Éxito texto' },
      { key: 'testimonial-success-icon', label: 'Éxito ícono' },
      { key: 'testimonial-success-link', label: 'Éxito link' },
      { key: 'testimonial-success-border', label: 'Éxito borde' },
    ],
  },
  {
    id: 'cookie',
    label: 'Cookie Banner',
    emoji: '🍪',
    primary: [
      { key: 'cookie-primary-bg', label: 'Botón aceptar fondo' },
      { key: 'cookie-primary-text', label: 'Botón aceptar texto' },
      { key: 'cookie-secondary-bg', label: 'Botón rechazar fondo' },
      { key: 'cookie-secondary-text', label: 'Botón rechazar texto' },
      { key: 'cookie-surface', label: 'Superficie fondo' },
      { key: 'cookie-text', label: 'Texto' },
    ],
    advanced: [
      { key: 'cookie-title', label: 'Título' },
      { key: 'cookie-link', label: 'Link' },
      { key: 'cookie-muted', label: 'Muted' },
      { key: 'cookie-secondary-border', label: 'Botón rechazar borde' },
      { key: 'cookie-surface-border', label: 'Superficie borde' },
      { key: 'cookie-detail-bg', label: 'Detalle fondo' },
      { key: 'cookie-detail-border', label: 'Detalle borde' },
      { key: 'cookie-toggle-on', label: 'Toggle on' },
      { key: 'cookie-toggle-off', label: 'Toggle off' },
      { key: 'cookie-toggle-knob', label: 'Toggle knob' },
    ],
  },
]

const FALLBACK_LIGHT = '#6c0a0a'
const FALLBACK_DARK = '#ffaadd'

interface Props {
  initialOverrides: PublicColorOverrides
}

export function PublicColorOverridesSection({ initialOverrides }: Props) {
  const [overrides, setOverrides] = useState<PublicColorOverrides>(initialOverrides)
  const [expandedAdvanced, setExpandedAdvanced] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const [deletingKey, setDeletingKey] = useState<string | null>(null)

  const setColor = (key: string, mode: 'light' | 'dark', value: string) => {
    setOverrides((prev) => ({
      ...prev,
      [key]: {
        light: prev[key]?.light ?? FALLBACK_LIGHT,
        dark: prev[key]?.dark ?? FALLBACK_DARK,
        [mode]: value,
      },
    }))
  }

  const addOverride = (key: string) => {
    setOverrides((prev) => ({
      ...prev,
      [key]: { light: FALLBACK_LIGHT, dark: FALLBACK_DARK },
    }))
  }

  const removeOverride = (key: string) => {
    if (!(key in initialOverrides)) {
      setOverrides((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
      return
    }
    setDeletingKey(key)
    startTransition(async () => {
      const result = await deletePublicColorOverride(key)
      if (result.success) {
        setOverrides((prev) => {
          const next = { ...prev }
          delete next[key]
          return next
        })
        showToast.success('Override eliminado')
      } else {
        showToast.error(result.error ?? 'Error al eliminar')
      }
      setDeletingKey(null)
    })
  }

  const handleSave = () => {
    const rows = Object.entries(overrides).map(([key, val]) => ({ key, ...val }))
    if (rows.length === 0) {
      showToast.success('Sin cambios que guardar')
      return
    }
    startTransition(async () => {
      const result = await upsertPublicColorOverrides(rows)
      if (result.success) showToast.success('Colores de elementos guardados')
      else showToast.error(result.error ?? 'Error al guardar')
    })
  }

  const toggleAdvanced = (groupId: string) => {
    setExpandedAdvanced((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-lg border p-4">
        <p className="text-muted-foreground text-sm">
          Sobreescribe el color de elementos individuales del sitio público. Sin override, cada
          elemento hereda del tema global.
        </p>
      </div>

      {GROUPS.map((group) => (
        <div key={group.id} className="rounded-lg border">
          <div className="bg-muted/20 px-4 py-2">
            <h3 className="text-sm font-semibold">
              {group.emoji} {group.label}
            </h3>
          </div>
          <div className="space-y-0 divide-y p-4">
            {group.primary.map((item) => (
              <ColorRow
                key={item.key}
                item={item}
                override={overrides[item.key]}
                onAdd={() => addOverride(item.key)}
                onRemove={() => removeOverride(item.key)}
                onChangeLight={(v) => setColor(item.key, 'light', v)}
                onChangeDark={(v) => setColor(item.key, 'dark', v)}
                isDeleting={deletingKey === item.key}
              />
            ))}
            {group.advanced && group.advanced.length > 0 && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAdvanced(group.id)}
                  className="text-muted-foreground w-full justify-start pt-3 hover:underline"
                >
                  {expandedAdvanced.has(group.id) ? (
                    <ChevronUp size={12} />
                  ) : (
                    <ChevronDown size={12} />
                  )}
                  {expandedAdvanced.has(group.id) ? 'Ocultar' : 'Mostrar'} controles avanzados
                </Button>
                {expandedAdvanced.has(group.id) &&
                  group.advanced.map((item) => (
                    <ColorRow
                      key={item.key}
                      item={item}
                      override={overrides[item.key]}
                      onAdd={() => addOverride(item.key)}
                      onRemove={() => removeOverride(item.key)}
                      onChangeLight={(v) => setColor(item.key, 'light', v)}
                      onChangeDark={(v) => setColor(item.key, 'dark', v)}
                      isDeleting={deletingKey === item.key}
                    />
                  ))}
              </>
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <Button type="button" variant="primary" onClick={handleSave} disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar colores de elementos'}
        </Button>
      </div>
    </div>
  )
}

interface ColorRowProps {
  item: ColorKey
  override: { light: string; dark: string } | undefined
  onAdd: () => void
  onRemove: () => void
  onChangeLight: (v: string) => void
  onChangeDark: (v: string) => void
  isDeleting: boolean
}

function ColorRow({
  item,
  override,
  onAdd,
  onRemove,
  onChangeLight,
  onChangeDark,
  isDeleting,
}: ColorRowProps) {
  if (!override) {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm">{item.label}</span>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground bg-muted rounded px-2 py-0.5 text-xs">
            Hereda del tema
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onAdd}
            className="text-muted-foreground hover:text-foreground gap-1"
          >
            <Plus size={12} /> Personalizar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('py-3', isDeleting && 'pointer-events-none opacity-50')}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{item.label}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
          title="Quitar override"
        >
          <X size={14} />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-muted-foreground mb-1 text-xs">☀️ Claro</p>
          <ColorPicker color={override.light} onChange={onChangeLight} />
        </div>
        <div>
          <p className="text-muted-foreground mb-1 text-xs">🌙 Oscuro</p>
          <ColorPicker color={override.dark} onChange={onChangeDark} />
        </div>
      </div>
    </div>
  )
}
