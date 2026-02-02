'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSettingsSchema, type ProjectSettingsFormData } from '@/lib/validations'
import { updateProjectSettings } from '@/actions/project-settings.actions'
import { Button, Card, Switch } from '@/components/ui'
import toast from 'react-hot-toast'
import React from 'react'

interface ProjectSettingsEditorProps {
  initialSettings: ProjectSettingsFormData | null
}

export default function ProjectSettingsEditor({ initialSettings }: ProjectSettingsEditorProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const { handleSubmit, watch, setValue } = useForm<ProjectSettingsFormData>({
    resolver: zodResolver(projectSettingsSchema),
    defaultValues: {
      showCardTitles: initialSettings?.showCardTitles ?? true,
      showCardCategory: initialSettings?.showCardCategory ?? true,
      gridColumns: initialSettings?.gridColumns ?? 3,
    },
  })

  // Watch values for immediate UI feedback if needed (optional)
  const showCardTitles = watch('showCardTitles')
  const showCardCategory = watch('showCardCategory')

  async function onSubmit(data: ProjectSettingsFormData) {
    setIsSaving(true)
    try {
      const result = await updateProjectSettings(data)
      if (result.success) {
        toast.success('Configuración actualizada')
        router.refresh()
      } else {
        toast.error('Error al guardar configuración')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Visualización de Proyectos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Controla cómo se ven las tarjetas de proyectos en la web pública.
          </p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} loading={isSaving}>
          Guardar Cambios
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card Content Settings */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Contenido de la Tarjeta</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Mostrar Títulos</label>
                <p className="text-xs text-gray-500">
                  Si se desactiva, solo se verá la imagen del proyecto.
                </p>
              </div>
              <Switch
                checked={showCardTitles}
                onCheckedChange={(checked) => setValue('showCardTitles', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Mostrar Categoría</label>
                <p className="text-xs text-gray-500">
                  Indica la categoría (ej. &quot;Novias&quot;) sobre la imagen.
                </p>
              </div>
              <Switch
                checked={showCardCategory}
                onCheckedChange={(checked) => setValue('showCardCategory', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Preview / Instructions Card */}
        <Card className="bg-muted/30 p-6">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Vista Previa</h3>
          <p className="mb-4 text-sm text-gray-500">
            Así se verá aproximadamente una tarjeta de proyecto según tu configuración actual:
          </p>

          <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-3xl bg-gray-200 shadow-md dark:bg-gray-700">
            {/* Mock Image */}
            <div className="flex h-full w-full items-center justify-center text-4xl opacity-20">
              📷
            </div>

            {/* Mock Overlay */}
            {(showCardTitles || showCardCategory) && (
              <div className="absolute inset-x-0 bottom-0 p-4">
                {showCardCategory && (
                  <p className="mb-1 text-[10px] font-bold tracking-wider text-black/70 uppercase">
                    CATEGORÍA
                  </p>
                )}
                {showCardTitles && (
                  <h3 className="text-lg leading-tight font-bold text-black">
                    Título del Proyecto
                  </h3>
                )}
              </div>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            * El diseño real dependerá de las imágenes subidas.
          </p>
        </Card>
      </div>
    </div>
  )
}
