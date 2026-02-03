'use client'

import { useState } from 'react'
import { createService, updateService } from '@/actions/services.actions'
import { Button } from '@/components/ui'
import { SmartField as FormField } from '@/components/ui'
import toast from 'react-hot-toast'
import { Service } from '@prisma/client'

interface ServiceFormProps {
  service?: Service | null
  onSuccess: () => void
  onCancel: () => void
}

export default function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!service

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const result = isEditing
        ? await updateService(service!.id, formData)
        : await createService(formData)

      if (!result.success) {
        toast.error(result.error || 'Error al guardar servicio')
        return
      }

      toast.success(isEditing ? 'Servicio actualizado' : 'Servicio creado')
      onSuccess()
    } catch {
      toast.error('Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Nombre del Servicio" name="name" defaultValue={service?.name} required />
        <FormField
          label="Slug (URL)"
          name="slug"
          defaultValue={service?.slug}
          placeholder="maquillaje-novia"
          required
        />
      </div>

      <FormField
        label="Descripción"
        name="description"
        type="textarea"
        defaultValue={service?.description || ''}
        placeholder="Descripción detallada del servicio..."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FormField
          label="Precio (€)"
          name="price"
          type="number"
          defaultValue={service?.price?.toString()}
          placeholder="150"
        />
        <FormField
          label="Tipo de Precio"
          name="priceLabel"
          type="select"
          defaultValue={service?.priceLabel || 'desde'}
          options={[
            { value: 'desde', label: 'Desde' },
            { value: 'fijo', label: 'Precio fijo' },
            { value: 'consultar', label: 'A consultar' },
          ]}
        />
        <FormField
          label="Duración"
          name="duration"
          defaultValue={service?.duration || ''}
          placeholder="2-3 horas"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          label="URL de Imagen"
          name="imageUrl"
          defaultValue={service?.imageUrl || ''}
          placeholder="https://..."
        />
        <FormField
          label="Icono (Lucide)"
          name="iconName"
          defaultValue={service?.iconName || ''}
          placeholder="sparkles"
        />
      </div>

      <div className="flex items-center gap-6 py-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            value="true"
            defaultChecked={service ? service.isActive : true}
          />
          <span className="text-sm font-medium">Activo</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            value="true"
            defaultChecked={service ? service.isFeatured : false}
          />
          <span className="text-sm font-medium">Destacado</span>
        </label>
      </div>

      <input type="hidden" name="sortOrder" value={service?.sortOrder || 0} />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" loading={isLoading}>
          {isEditing ? 'Guardar Cambios' : 'Crear Servicio'}
        </Button>
      </div>
    </form>
  )
}
