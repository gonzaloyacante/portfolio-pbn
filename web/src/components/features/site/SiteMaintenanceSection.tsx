import { AlertTriangle } from 'lucide-react'
import { Switch, TextArea } from '@/components/ui'

interface SiteMaintenanceSectionProps {
  maintenanceMode: boolean
  onMaintenanceModeChange: (v: boolean) => void
  maintenanceMessage: string
  onMaintenanceMessageChange: (v: string) => void
}

export function SiteMaintenanceSection({
  maintenanceMode,
  onMaintenanceModeChange,
  maintenanceMessage,
  onMaintenanceMessageChange,
}: SiteMaintenanceSectionProps) {
  return (
    <section
      className={`space-y-4 rounded-2xl border p-6 transition-colors ${
        maintenanceMode ? 'border-warning/50 bg-warning/10' : 'border-border bg-card'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle
            className={`mt-0.5 size-5 shrink-0 ${maintenanceMode ? 'text-warning' : 'text-muted-foreground'}`}
          />
          <div>
            <p className="font-semibold">Modo mantenimiento</p>
            <p className="text-muted-foreground text-sm">
              Cuando está activo, el sitio público muestra una página de mantenimiento en lugar del
              contenido.
            </p>
          </div>
        </div>
        <Switch
          checked={maintenanceMode}
          onCheckedChange={onMaintenanceModeChange}
          aria-label="Activar modo mantenimiento"
        />
      </div>
      {maintenanceMode && (
        <TextArea
          value={maintenanceMessage}
          onChange={(e) => onMaintenanceMessageChange(e.target.value)}
          placeholder="Estamos realizando mejoras. Volvemos pronto."
          rows={2}
        />
      )}
      {maintenanceMode && (
        <p className="text-warning text-sm font-medium">
          ⚠️ El sitio público está en mantenimiento — los visitantes no pueden ver el contenido.
        </p>
      )}
    </section>
  )
}
