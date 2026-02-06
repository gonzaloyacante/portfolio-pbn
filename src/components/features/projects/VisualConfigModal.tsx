'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, DefaultValues, Path, PathValue, FieldValues } from 'react-hook-form'
import { Button, Modal, Switch } from '@/components/ui'
import toast from 'react-hot-toast'
import PreviewCard from '@/components/ui/data-display/PreviewCard'

export interface ConfigField<T extends FieldValues> {
  key: Path<T>
  label: string
  description?: string
  type?: 'boolean' | 'number'
  min?: number
  max?: number
}

interface VisualConfigModalProps<T extends FieldValues> {
  triggerLabel?: string
  title?: string
  description?: string
  initialSettings: T | null
  fields: ConfigField<T>[]
  previewVariant: 'project' | 'category'
  onSave: (data: T) => Promise<{ success: boolean; error?: string }>
}

export default function VisualConfigModal<T extends FieldValues>({
  triggerLabel = 'Config. Visual',
  title = 'Configuración de Visualización',
  description,
  initialSettings,
  fields,
  previewVariant,
  onSave,
}: VisualConfigModalProps<T>) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // We cast initialSettings as DefaultValues<T> just for hook form
  // In a real generic scenario we might need checks, but this is internal use.
  const { setValue, watch, handleSubmit } = useForm<T>({
    defaultValues: (initialSettings || {}) as DefaultValues<T>,
  })

  async function onSubmit(data: T) {
    setIsSaving(true)
    try {
      const result = await onSave(data)
      if (result.success) {
        toast.success('Configuración actualizada')
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || 'Error al guardar')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setIsSaving(false)
    }
  }

  // Type-safe value helper
  const getValue = (key: Path<T>) => {
    return watch(key)
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="gap-2"
        leftIcon={<span>⚙️</span>}
      >
        {triggerLabel}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        <div className="space-y-6 py-4">
          {description && <p className="text-muted-foreground text-sm">{description}</p>}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Controls */}
            <div className="border-border bg-card space-y-4 rounded-xl border p-4">
              {fields.map((field) => (
                <div key={field.key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-foreground text-sm font-medium">{field.label}</label>
                    {field.description && (
                      <p className="text-muted-foreground text-xs">{field.description}</p>
                    )}
                  </div>

                  {field.type === 'number' ? (
                    <input
                      type="number"
                      min={field.min ?? 1}
                      max={field.max ?? 10}
                      value={(getValue(field.key) as number) ?? field.min ?? 1}
                      onChange={(e) =>
                        setValue(field.key, parseInt(e.target.value) as PathValue<T, Path<T>>)
                      }
                      className="border-border bg-background text-foreground w-20 rounded-md border px-3 py-1.5 text-sm"
                    />
                  ) : (
                    <Switch
                      checked={!!getValue(field.key)}
                      onCheckedChange={(checked) =>
                        setValue(field.key, checked as PathValue<T, Path<T>>)
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="bg-muted/30 flex flex-col items-center justify-center rounded-xl p-4">
              <p className="text-muted-foreground mb-4 text-xs font-semibold">Vista Previa</p>
              <div className="w-48">
                <PreviewCard
                  variant={previewVariant}
                  title="Título Ejemplo"
                  // Adapt props based on type
                  subtitle={previewVariant === 'project' ? 'Categoría' : '8 Proyectos'}
                  // Map specific field keys to preview props if they match known patterns
                  // OR pass generic boolean.
                  // For now, we map hardcoded knowledges of our schema keys:
                  // Projects: showCardTitles, showCardCategory
                  // Categories: showDescription, showProjectCount ??
                  showTitle={
                    previewVariant === 'project'
                      ? (getValue('showCardTitles' as Path<T>) ?? true)
                      : true
                  }
                  showSubtitle={
                    previewVariant === 'project'
                      ? (getValue('showCardCategory' as Path<T>) ?? true)
                      : (getValue('showProjectCount' as Path<T>) ?? true)
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit(onSubmit)} loading={isSaving}>
              Guardar Cambios
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
