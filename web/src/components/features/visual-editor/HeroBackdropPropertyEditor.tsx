'use client'

import type { HomeSettingsData } from '@/actions/settings/home'
import { Input, Switch } from '@/components/ui'
import { EditorColorControl } from './components/EditorColorControl'
import { EditorImageUpload } from './components/EditorImageUpload'
import { EditorSelectControl } from './components/EditorSelectControl'
import { EditorSliderControl } from './components/EditorSliderControl'
import { MobileOverridableSlider } from './components/MobileOverridableSlider'
import type { ViewportMode } from './types'

const MEDIA_KIND = [
  { value: 'auto', label: 'Auto (detectar)' },
  { value: 'image', label: 'Imagen / GIF' },
  { value: 'video', label: 'Vídeo' },
] as const

const SCRIM_EDGE = [
  { value: 'left', label: 'Izquierda → derecha' },
  { value: 'right', label: 'Derecha → izquierda' },
  { value: 'both', label: 'Ambos lados' },
  { value: 'none', label: 'Sin degradado lateral' },
] as const

const OBJECT_FIT = [
  { value: 'cover', label: 'Cubrir (cover)' },
  { value: 'contain', label: 'Contener (contain)' },
] as const

interface HeroBackdropPropertyEditorProps {
  settings: HomeSettingsData
  onUpdate: <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => void
  viewportMode: ViewportMode
}

export function HeroBackdropPropertyEditor({
  settings,
  onUpdate,
  viewportMode,
}: HeroBackdropPropertyEditorProps) {
  const mobileActive = viewportMode === 'mobile'

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-(--border) bg-(--muted)/30 p-3 text-xs leading-relaxed text-(--muted-foreground)">
        El fondo animado viene del archivo (vídeo en loop o GIF desde Cloudinary). No hay efecto al
        mover el ratón: así funciona igual en móvil y escritorio.
      </div>

      <div className="flex items-center justify-between rounded-lg border border-(--border) p-3">
        <div>
          <p className="text-sm font-medium">Hero inmersivo</p>
          <p className="text-muted-foreground text-xs">
            Imagen o vídeo a pantalla detrás del contenido y bajo la barra de navegación
          </p>
        </div>
        <Switch
          checked={settings.heroImmersiveEnabled ?? true}
          onCheckedChange={(val: boolean) => onUpdate('heroImmersiveEnabled', val)}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-(--border) p-3">
        <div>
          <p className="text-sm font-medium">
            Mostrar retrato en columna (solo vista previa editor)
          </p>
          <p className="text-muted-foreground text-xs">
            En la web pública con hero inmersivo, el retrato no se duplica: solo el fondo. Aquí
            sigues viendo la imagen para editarla.
          </p>
        </div>
        <Switch
          checked={settings.heroForegroundPortraitShow ?? false}
          onCheckedChange={(val: boolean) => onUpdate('heroForegroundPortraitShow', val)}
        />
      </div>

      <EditorSelectControl
        label="Tipo de medio"
        value={(settings.heroBackdropMediaKind as string) ?? 'auto'}
        options={MEDIA_KIND.map((o) => ({ value: o.value, label: o.label }))}
        onChange={(val: string) => onUpdate('heroBackdropMediaKind', val)}
      />

      <EditorImageUpload
        label="Archivo de fondo (Cloudinary)"
        value={(settings.heroBackdropUrl as string) ?? null}
        onChange={(val: string | null) => onUpdate('heroBackdropUrl', val)}
      />
      <p className="text-muted-foreground -mt-2 text-xs">
        Sube imagen o GIF, o pega después una URL de vídeo (.mp4 / Cloudinary{' '}
        <code className="text-[11px]">video/upload</code>) desde tu biblioteca.
      </p>

      <Input
        label="O pegar URL del medio directamente"
        value={(settings.heroBackdropUrl as string) ?? ''}
        onChange={(e) => onUpdate('heroBackdropUrl', e.target.value.trim() || null)}
        placeholder="https://res.cloudinary.com/…"
      />

      <Input
        label="Poster del vídeo (URL imagen, opcional)"
        value={(settings.heroBackdropPosterUrl as string) ?? ''}
        onChange={(e) => onUpdate('heroBackdropPosterUrl', e.target.value || null)}
      />

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={settings.heroBackdropLoop ?? true}
            onCheckedChange={(v) => onUpdate('heroBackdropLoop', v)}
          />
          <span className="text-sm">Loop</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={settings.heroBackdropMuted ?? true}
            onCheckedChange={(v) => onUpdate('heroBackdropMuted', v)}
          />
          <span className="text-sm">Silenciado (recomendado autoplay)</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={settings.heroBackdropPlaysInline ?? true}
            onCheckedChange={(v) => onUpdate('heroBackdropPlaysInline', v)}
          />
          <span className="text-sm">Reproducir inline (iOS)</span>
        </div>
      </div>

      <EditorSelectControl
        label="Ajuste del medio"
        value={(settings.heroBackdropObjectFit as string) ?? 'cover'}
        options={OBJECT_FIT.map((o) => ({ value: o.value, label: o.label }))}
        onChange={(val: string) => onUpdate('heroBackdropObjectFit', val)}
      />

      <Input
        label="Posición del medio (CSS object-position)"
        value={(settings.heroBackdropObjectPosition as string) ?? ''}
        onChange={(e) => onUpdate('heroBackdropObjectPosition', e.target.value.trim() || 'center')}
        placeholder="center / 50% 20% / left top"
      />

      <div className="space-y-4 border-t border-(--border) pt-4">
        <h4 className="text-sm font-semibold">Overrides móvil (opcional)</h4>
        <EditorImageUpload
          label="Fondo distinto en móvil"
          value={(settings.heroBackdropMobileUrl as string) ?? null}
          onChange={(val: string | null) => onUpdate('heroBackdropMobileUrl', val)}
        />
        <Input
          label="Posición en móvil (object-position)"
          value={(settings.heroBackdropMobileObjectPosition as string) ?? ''}
          onChange={(e) => {
            const t = e.target.value.trim()
            onUpdate('heroBackdropMobileObjectPosition', t === '' ? null : t)
          }}
          placeholder="Vacío = mismo que escritorio"
        />
      </div>

      <div className="space-y-4 border-t border-(--border) pt-4">
        <h4 className="text-sm font-semibold">Degradado lateral (legibilidad textos)</h4>

        <EditorSelectControl
          label="Dirección / forma"
          value={(settings.heroScrimEdge as string) ?? 'left'}
          options={SCRIM_EDGE.map((o) => ({ value: o.value, label: o.label }))}
          onChange={(val: string) => onUpdate('heroScrimEdge', val)}
        />

        <MobileOverridableSlider
          label="Alcance (% del ancho)"
          desktopKey="heroScrimExtentPercent"
          mobileKey={mobileActive ? 'heroScrimMobileExtentPercent' : undefined}
          settings={settings}
          onUpdate={onUpdate}
          defaultValue={45}
          min={5}
          max={100}
        />

        <MobileOverridableSlider
          label="Opacidad máxima en el borde"
          desktopKey="heroScrimOpacity"
          mobileKey={mobileActive ? 'heroScrimMobileOpacity' : undefined}
          settings={settings}
          onUpdate={onUpdate}
          defaultValue={80}
          min={0}
          max={100}
        />

        <EditorSliderControl
          label="Suavidad del degradado"
          value={(settings.heroScrimFeatherPercent as number) ?? 50}
          onChange={(val: number) => onUpdate('heroScrimFeatherPercent', val)}
          min={0}
          max={100}
          suffix="%"
        />

        <EditorSliderControl
          label="Tinte uniforme oscuro (toda la escena)"
          value={(settings.heroBackdropTintOpacity as number) ?? 0}
          onChange={(val: number) => onUpdate('heroBackdropTintOpacity', val)}
          min={0}
          max={100}
          suffix="%"
        />

        <EditorColorControl
          label="Color del degradado (claro)"
          value={(settings.heroScrimColor as string) ?? ''}
          onChange={(val: string) => onUpdate('heroScrimColor', val ? val : null)}
        />

        <EditorColorControl
          label="Color del degradado (oscuro)"
          value={(settings.heroScrimColorDark as string) ?? ''}
          onChange={(val: string) => onUpdate('heroScrimColorDark', val ? val : null)}
        />
      </div>
    </div>
  )
}
