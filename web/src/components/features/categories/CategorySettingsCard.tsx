'use client'

import { useState, useTransition } from 'react'
import { Card, Switch } from '@/components/ui'
import { updateCategorySettings } from '@/actions/settings/categories'
import { showToast } from '@/lib/toast'
import type { CategorySettings } from '@/generated/prisma/client'

interface CategorySettingsCardProps {
  settings: CategorySettings | null
}

export default function CategorySettingsCard({ settings }: CategorySettingsCardProps) {
  const [showDescription, setShowDescription] = useState(settings?.showDescription ?? true)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (value: boolean) => {
    setShowDescription(value)
    startTransition(async () => {
      const result = await updateCategorySettings({
        showDescription: value,
        gridColumns: settings?.gridColumns ?? 4,
        isActive: settings?.isActive ?? true,
      })
      if (!result.success) {
        setShowDescription(!value)
        showToast.error('Error al guardar la configuración')
      } else {
        showToast.success('Configuración guardada')
      }
    })
  }

  return (
    <Card className="p-5">
      <h2 className="text-foreground mb-4 text-base font-semibold">⚙️ Configuración de Galería</h2>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <label htmlFor="show-description" className="text-foreground text-sm font-medium">
            Mostrar títulos en imágenes
          </label>
          <p className="text-muted-foreground text-xs">
            Cuando está activo, el nombre de la categoría aparece al pasar el cursor sobre las
            imágenes en las galerías públicas.
          </p>
        </div>
        <Switch
          id="show-description"
          checked={showDescription}
          onCheckedChange={handleToggle}
          disabled={isPending}
        />
      </div>
    </Card>
  )
}
