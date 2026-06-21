'use client'

import type { HomeSettingsData } from '@/actions/settings/home'
import { Input, Switch } from '@/components/ui'
import { EditorColorControl } from './components/EditorColorControl'
import { EditorImageUpload } from './components/EditorImageUpload'
import { EditorSelectControl } from './components/EditorSelectControl'
import { EditorSliderControl } from './components/EditorSliderControl'
import { ViewportSlider } from './components/ViewportSlider'
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

interface HeroBackdropPropertyEditorProps {
  settings: HomeSettingsData
  onUpdate: <K extends keyof HomeSettingsData>(field: K, value: HomeSettingsData[K]) => void
  viewportMode: ViewportMode
}

function ShadowSwitchRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string
  description: string
  checked: boolean
  onCheckedChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-(--border) p-3">
      <div className="pr-4">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
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
          checked={settings.heroImmersiveEnabled ?? true}
          onCheckedChange={(val: boolean) => onUpdate('heroImmersiveEnabled', val)}
        />
      </div>

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

      <Input
        label="O pegar el enlace del fondo"
        value={(settings.heroBackdropUrl as string) ?? ''}
        onChange={(e) => onUpdate('heroBackdropUrl', e.target.value.trim() || null)}
        placeholder="https://res.cloudinary.com/…"
      />

      <Input
        label="Imagen de portada del vídeo (opcional)"
        value={(settings.heroBackdropPosterUrl as string) ?? ''}
        onChange={(e) => onUpdate('heroBackdropPosterUrl', e.target.value || null)}
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
        onChange={(e) => onUpdate('heroBackdropObjectPosition', e.target.value.trim() || 'center')}
        placeholder="Por ejemplo: centro, izquierda arriba, 50% 20%"
      />

      <div className="space-y-4 border-t border-(--border) pt-4">
        <h4 className="text-sm font-semibold">Sombra para mejorar la lectura</h4>

        <div className="space-y-3">
          <p className="text-sm font-medium">En ordenador</p>
          <ShadowSwitchRow
            title="Mostrar sombra a la izquierda"
            description="Ayuda a que el texto destaque mejor sobre el lado izquierdo."
            checked={(settings.heroScrimShowLeft as boolean) ?? true}
            onCheckedChange={(val) => onUpdate('heroScrimShowLeft', val)}
          />
          <ShadowSwitchRow
            title="Mostrar sombra a la derecha"
            description="Útil si quieres oscurecer el lado derecho de la imagen."
            checked={(settings.heroScrimShowRight as boolean) ?? false}
            onCheckedChange={(val) => onUpdate('heroScrimShowRight', val)}
          />
          <ShadowSwitchRow
            title="Mostrar sombra arriba"
            description="Sirve para oscurecer la parte superior y mejorar el contraste."
            checked={(settings.heroScrimShowTop as boolean) ?? true}
            onCheckedChange={(val) => onUpdate('heroScrimShowTop', val)}
          />
        </div>

        <div className="space-y-3 border-t border-(--border) pt-4">
          <p className="text-sm font-medium">En móvil</p>
          <ShadowSwitchRow
            title="Mostrar sombra a la izquierda en móvil"
            description="Controla la sombra del lado izquierdo cuando la pantalla es pequeña."
            checked={(settings.heroScrimMobileShowLeft as boolean) ?? false}
            onCheckedChange={(val) => onUpdate('heroScrimMobileShowLeft', val)}
          />
          <ShadowSwitchRow
            title="Mostrar sombra a la derecha en móvil"
            description="Controla la sombra del lado derecho cuando la pantalla es pequeña."
            checked={(settings.heroScrimMobileShowRight as boolean) ?? false}
            onCheckedChange={(val) => onUpdate('heroScrimMobileShowRight', val)}
          />
          <ShadowSwitchRow
            title="Mostrar sombra arriba en móvil"
            description="Controla la sombra de la parte superior en móvil."
            checked={(settings.heroScrimMobileShowTop as boolean) ?? true}
            onCheckedChange={(val) => onUpdate('heroScrimMobileShowTop', val)}
          />
        </div>

        <ViewportSlider
          label="Cuánto espacio ocupa"
          desktopKey="heroScrimExtentPercent"
          mobileKey="heroScrimMobileExtentPercent"
          settings={settings}
          onUpdate={onUpdate}
          defaultValue={45}
          min={5}
          max={100}
          viewportMode={viewportMode}
        />

        <ViewportSlider
          label="Qué tan fuerte se ve"
          desktopKey="heroScrimOpacity"
          mobileKey="heroScrimMobileOpacity"
          settings={settings}
          onUpdate={onUpdate}
          defaultValue={80}
          min={0}
          max={100}
          viewportMode={viewportMode}
        />

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
          label="Color de la sombra"
          value={(settings.heroScrimColor as string) ?? ''}
          onChange={(val: string) => onUpdate('heroScrimColor', val ? val : null)}
        />

        <EditorColorControl
          label="Color de la sombra en modo oscuro"
          value={(settings.heroScrimColorDark as string) ?? ''}
          onChange={(val: string) => onUpdate('heroScrimColorDark', val ? val : null)}
        />
      </div>
    </div>
  )
}
