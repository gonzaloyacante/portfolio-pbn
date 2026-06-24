'use client'

import { Monitor, Smartphone, Tablet } from 'lucide-react'
import type { HomeSettingsData } from '@/actions/settings/home'
import { Input, Switch } from '@/components/ui'
import { cn } from '@/lib/utils'
import { EditorColorControl } from './components/EditorColorControl'
import { EditorImageUpload } from './components/EditorImageUpload'
import { EditorSelectControl } from './components/EditorSelectControl'
import { EditorSliderControl } from './components/EditorSliderControl'
import { ScrimViewportSlider } from './components/ScrimViewportSlider'
import { ScrimViewportSwitch } from './components/ScrimViewportSwitch'
import type { ViewportMode } from './types'

const MEDIA_KIND = [
  { value: 'auto', label: 'Automático (recomendado)' },
  { value: 'image', label: 'Imagen o GIF' },
  { value: 'video', label: 'Vídeo' },
] as const

const OBJECT_FIT = [
  { value: 'cover', label: 'Llenar el espacio' },
  { value: 'contain', label: 'Mostrar completo' },
] as const

interface ViewportBlockInfo {
  mode: ViewportMode
  label: string
  description: string
  Icon: typeof Monitor
}

const VIEWPORT_BLOCKS: ViewportBlockInfo[] = [
  {
    mode: 'desktop',
    label: 'Bloque escritorio',
    description: 'Se aplica a partir de 1024 px de ancho.',
    Icon: Monitor,
  },
  {
    mode: 'tablet',
    label: 'Bloque tablet',
    description: 'Se aplica entre 768 px y 1023 px de ancho.',
    Icon: Tablet,
  },
  {
    mode: 'mobile',
    label: 'Bloque móvil',
    description: 'Se aplica por debajo de 768 px de ancho.',
    Icon: Smartphone,
  },
]

interface HeroBackdropPropertyEditorProps {
  settings: HomeSettingsData
  onUpdate: <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => void
  viewportMode: ViewportMode
}

/**
 * Encabezado que muestra QUÉ bloque viewport se está editando. Importante:
 * el panel solo renderiza los controles del viewport activo, así que este
 * header evita que el admin se confunda sobre qué cosa está editando.
 */
function ViewportBlockHeader({ viewportMode }: { viewportMode: ViewportMode }) {
  const block = VIEWPORT_BLOCKS.find((b) => b.mode === viewportMode)
  if (!block) return null
  const Icon = block.Icon
  const others = VIEWPORT_BLOCKS.filter((b) => b.mode !== viewportMode)
    .map((b) => b.label.toLowerCase())
    .join(' y ')
  return (
    <div className="flex items-center gap-2 rounded-md border border-dashed border-(--border) bg-(--muted)/40 px-3 py-2">
      <Icon className="text-primary h-4 w-4 shrink-0" />
      <div className="flex-1 text-xs">
        <p className="font-semibold">{block.label}</p>
        <p className="text-muted-foreground">{block.description}</p>
      </div>
      <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
        Distinto de {others}
      </p>
    </div>
  )
}

export function HeroBackdropPropertyEditor({
  settings,
  onUpdate,
  viewportMode,
}: HeroBackdropPropertyEditorProps) {
  const immersiveOff = (settings.heroImmersiveEnabled ?? true) === false

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-(--border) bg-(--muted)/30 p-3 text-xs leading-relaxed text-(--muted-foreground)">
        El fondo sale del archivo que subas. Puede ser una imagen, un GIF o un vídeo. No responde al
        ratón para que se vea igual en ordenador y en móvil.
      </div>

      <div className="flex items-center justify-between rounded-lg border border-(--border) p-3">
        <div>
          <p className="text-sm font-medium">Hero inmersivo</p>
          <p className="text-muted-foreground text-xs">
            Mostrar un fondo a pantalla completa detrás del contenido y por debajo de la barra de
            navegación
          </p>
        </div>
        <Switch
          checked={!immersiveOff}
          onCheckedChange={(val: boolean) => onUpdate('heroImmersiveEnabled', val)}
        />
      </div>

      {immersiveOff && (
        <div className="text-muted-foreground border-muted-foreground/30 rounded-lg border border-dashed bg-(--muted)/40 px-3 py-2 text-xs italic">
          El fondo está desactivado en la web pública. Los controles siguen activos para que puedas
          volver a activarlo o ajustar el archivo.
        </div>
      )}

      <div className="flex items-center justify-between rounded-lg border border-(--border) p-3">
        <div>
          <p className="text-sm font-medium">Mostrar el retrato en la vista previa del editor</p>
          <p className="text-muted-foreground text-xs">
            En la web pública, cuando el fondo está activo, no se duplica el retrato. Aquí lo sigues
            viendo para poder editarlo con comodidad.
          </p>
        </div>
        <Switch
          checked={settings.heroForegroundPortraitShow ?? false}
          onCheckedChange={(val: boolean) => onUpdate('heroForegroundPortraitShow', val)}
        />
      </div>

      <div
        className={cn('space-y-6', immersiveOff && 'opacity-40 [&_input]:line-through')}
        aria-disabled={immersiveOff}
      >
        <EditorSelectControl
          label="Tipo de fondo"
          value={(settings.heroBackdropMediaKind as string) ?? 'auto'}
          options={MEDIA_KIND.map((o) => ({ value: o.value, label: o.label }))}
          onChange={(val: string) => onUpdate('heroBackdropMediaKind', val)}
        />

        <EditorImageUpload
          label="Archivo de fondo"
          value={(settings.heroBackdropUrl as string) ?? null}
          onChange={(val: string | null) => onUpdate('heroBackdropUrl', val)}
        />
        <p className="text-muted-foreground -mt-2 text-xs">
          Puedes subir una imagen o un GIF, o pegar luego el enlace de un vídeo desde tu biblioteca.
        </p>

        <EditorImageUpload
          label="Imagen de portada del vídeo (opcional)"
          value={(settings.heroBackdropPosterUrl as string) ?? null}
          onChange={(val: string | null) => onUpdate('heroBackdropPosterUrl', val || null)}
        />

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Switch
              checked={settings.heroBackdropLoop ?? true}
              onCheckedChange={(v) => onUpdate('heroBackdropLoop', v)}
            />
            <span className="text-sm">Repetir automáticamente</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={settings.heroBackdropMuted ?? true}
              onCheckedChange={(v) => onUpdate('heroBackdropMuted', v)}
            />
            <span className="text-sm">Sin sonido</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={settings.heroBackdropPlaysInline ?? true}
              onCheckedChange={(v) => onUpdate('heroBackdropPlaysInline', v)}
            />
            <span className="text-sm">Reproducir dentro de la página</span>
          </div>
        </div>

        <EditorSelectControl
          label="Cómo encaja el fondo"
          value={(settings.heroBackdropObjectFit as string) ?? 'cover'}
          options={OBJECT_FIT.map((o) => ({ value: o.value, label: o.label }))}
          onChange={(val: string) => onUpdate('heroBackdropObjectFit', val)}
        />

        <Input
          label="Ubicación del fondo"
          value={(settings.heroBackdropObjectPosition as string) ?? ''}
          onChange={(e) =>
            onUpdate('heroBackdropObjectPosition', e.target.value.trim() || 'center')
          }
          placeholder="Por ejemplo: centro, izquierda arriba, 50% 20%"
        />

        {/* ════════════════════════════════════════════════════════════════
            SOMBRA DE ARRIBA DEL NAVBAR
            3 bloques (escritorio / tablet / móvil) con sus 3 controles:
            enabled + intensity + heightVh
            ════════════════════════════════════════════════════════════════ */}
        <div className="space-y-4 border-t border-(--border) pt-4">
          <div>
            <h4 className="text-sm font-semibold">Sombra de arriba del navbar</h4>
            <p className="text-muted-foreground text-xs">
              Capa oscura fija en la parte superior de la página principal. Se desvanece al hacer
              scroll. Cada viewport tiene su propio bloque; si está vacío se usa el default de ese
              viewport.
            </p>
          </div>

          <ViewportBlockHeader viewportMode={viewportMode} />

          <ScrimViewportSwitch
            title="Mostrar la sombra"
            description="Enciende o apaga la sombra superior del navbar en este viewport."
            desktopKey="navbarScrimEnabled"
            tabletKey="navbarScrimTabletEnabled"
            mobileKey="navbarScrimMobileEnabled"
            settings={settings}
            onUpdate={onUpdate}
            defaultChecked
            viewportMode={viewportMode}
          />

          <ScrimViewportSlider
            label="Qué tan oscura se ve"
            desktopKey="navbarScrimIntensity"
            tabletKey="navbarScrimTabletIntensity"
            mobileKey="navbarScrimMobileIntensity"
            settings={settings}
            onUpdate={onUpdate}
            defaultValue={80}
            min={0}
            max={100}
            viewportMode={viewportMode}
            suffix="%"
          />

          <ScrimViewportSlider
            label="Cuánto espacio ocupa"
            desktopKey="navbarScrimHeightVh"
            tabletKey="navbarScrimTabletHeightVh"
            mobileKey="navbarScrimMobileHeightVh"
            settings={settings}
            onUpdate={onUpdate}
            defaultValue={45}
            min={5}
            max={100}
            viewportMode={viewportMode}
            suffix="vh"
          />
        </div>

        {/* ════════════════════════════════════════════════════════════════
            SOMBRAS DEL HERO (izquierda, derecha y arriba)
            Cada sombra tiene 3 bloques viewport con su `show`.
            Los params del gradiente (extentPercent + opacity) son comunes
            a las 3 sombras y se triplican por viewport.
            ════════════════════════════════════════════════════════════════ */}
        <div className="space-y-4 border-t border-(--border) pt-4">
          <div>
            <h4 className="text-sm font-semibold">Sombras del hero (izquierda, derecha, arriba)</h4>
            <p className="text-muted-foreground text-xs">
              Capas que oscurecen los bordes del fondo del hero para mejorar la lectura. Cada sombra
              y cada viewport son independientes.
            </p>
          </div>

          <ViewportBlockHeader viewportMode={viewportMode} />

          <ScrimViewportSwitch
            title="Mostrar sombra a la izquierda"
            description="Capa oscura en el borde izquierdo del hero en este viewport."
            desktopKey="heroScrimShowLeft"
            tabletKey="heroScrimTabletShowLeft"
            mobileKey="heroScrimMobileShowLeft"
            settings={settings}
            onUpdate={onUpdate}
            defaultChecked
            viewportMode={viewportMode}
          />

          <ScrimViewportSwitch
            title="Mostrar sombra a la derecha"
            description="Capa oscura en el borde derecho del hero en este viewport."
            desktopKey="heroScrimShowRight"
            tabletKey="heroScrimTabletShowRight"
            mobileKey="heroScrimMobileShowRight"
            settings={settings}
            onUpdate={onUpdate}
            defaultChecked={false}
            viewportMode={viewportMode}
          />

          <ScrimViewportSwitch
            title="Mostrar sombra de arriba"
            description="Capa oscura en el borde superior del hero en este viewport (distinta del navbar)."
            desktopKey="heroScrimShowTop"
            tabletKey="heroScrimTabletShowTop"
            mobileKey="heroScrimMobileShowTop"
            settings={settings}
            onUpdate={onUpdate}
            defaultChecked
            viewportMode={viewportMode}
          />

          <ScrimViewportSlider
            label="Cuánto espacio ocupa el degradado"
            desktopKey="heroScrimExtentPercent"
            tabletKey="heroScrimTabletExtentPercent"
            mobileKey="heroScrimMobileExtentPercent"
            settings={settings}
            onUpdate={onUpdate}
            defaultValue={45}
            min={5}
            max={100}
            viewportMode={viewportMode}
            suffix="%"
          />

          <ScrimViewportSlider
            label="Qué tan fuerte se ve"
            desktopKey="heroScrimOpacity"
            tabletKey="heroScrimTabletOpacity"
            mobileKey="heroScrimMobileOpacity"
            settings={settings}
            onUpdate={onUpdate}
            defaultValue={80}
            min={0}
            max={100}
            viewportMode={viewportMode}
            suffix="%"
          />
        </div>

        {/* ════════════════════════════════════════════════════════════════
            APARIENCIA COMPARTIDA DE LAS SOMBRAS DEL HERO
            Color (light/dark), suavizado y tint de fondo: únicos para
            los 3 viewports y para las 3 sombras.
            ════════════════════════════════════════════════════════════════ */}
        <div className="space-y-4 border-t border-(--border) pt-4">
          <div>
            <h4 className="text-sm font-semibold">Apariencia de las sombras del hero</h4>
            <p className="text-muted-foreground text-xs">
              Color, suavidad y oscurecimiento general del fondo. Se aplican a las 3 sombras y a los
              3 viewports por igual.
            </p>
          </div>

          <EditorSliderControl
            label="Qué tan suave se desvanece"
            value={(settings.heroScrimFeatherPercent as number) ?? 50}
            onChange={(val: number) => onUpdate('heroScrimFeatherPercent', val)}
            min={0}
            max={100}
            suffix="%"
          />

          <EditorSliderControl
            label="Oscurecer toda la imagen"
            value={(settings.heroBackdropTintOpacity as number) ?? 0}
            onChange={(val: number) => onUpdate('heroBackdropTintOpacity', val)}
            min={0}
            max={100}
            suffix="%"
          />

          <EditorColorControl
            label="Color de la sombra (modo claro)"
            value={(settings.heroScrimColor as string) ?? ''}
            onChange={(val: string) => onUpdate('heroScrimColor', val ? val : null)}
          />

          <EditorColorControl
            label="Color de la sombra (modo oscuro)"
            value={(settings.heroScrimColorDark as string) ?? ''}
            onChange={(val: string) => onUpdate('heroScrimColorDark', val ? val : null)}
          />
        </div>
      </div>
    </div>
  )
}
