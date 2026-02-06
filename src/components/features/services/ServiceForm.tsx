'use client'

import { useState } from 'react'
import { createService, updateService } from '@/actions/cms/services'
import { Button } from '@/components/ui'
import { SmartField as FormField } from '@/components/ui'
import toast from 'react-hot-toast'
import { Service } from '@prisma/client'

interface ServiceFormProps {
  service?: Service | null
  onSuccess: () => void
  onCancel: () => void
}

// ... imports

interface ServiceFormProps {
  service?: Service | null
  onSuccess: () => void
  onCancel: () => void
}

export default function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
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

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'pricing', label: 'Precios' },
    { id: 'schedule', label: 'Agenda' },
    { id: 'details', label: 'Detalles' },
    { id: 'seo', label: 'SEO' },
  ]

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Tabs Nav */}
      <div className="overflow-x-auto border-b border-[var(--border)]">
        <div className="flex min-w-max gap-4 px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-[var(--primary)] text-[var(--foreground)]'
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- GENERAL --- */}
      <div className={activeTab === 'general' ? 'block space-y-4' : 'hidden'}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            label="Nombre del Servicio"
            name="name"
            defaultValue={service?.name}
            required
          />
          <FormField
            label="Slug (URL)"
            name="slug"
            defaultValue={service?.slug}
            placeholder="maquillaje-novia"
            required
          />
        </div>
        <FormField
          label="Descripción Corta (Para tarjetas)"
          name="shortDesc"
          type="textarea"
          defaultValue={service?.shortDesc || ''}
          placeholder="Resumen atractivo..."
          rows={2}
        />
        <FormField
          label="Descripción Completa"
          name="description"
          type="textarea"
          defaultValue={service?.description || ''}
          placeholder="Detalles completos..."
          rows={4}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            label="URL de Imagen Principal"
            name="imageUrl"
            defaultValue={service?.imageUrl || ''}
            placeholder="https://..."
          />
          <FormField
            label="Icono (Lucide name)"
            name="iconName"
            defaultValue={service?.iconName || ''}
            placeholder="sparkles"
          />
        </div>
        <div className="bg-muted/20 flex items-center gap-6 rounded-lg p-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked={service ? service.isActive : true}
              className="h-5 w-5"
            />
            <span className="font-medium">Activo</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              value="true"
              defaultChecked={service ? service.isFeatured : false}
              className="h-5 w-5"
            />
            <span className="font-medium">Destacado</span>
          </label>
        </div>
        <input type="hidden" name="sortOrder" value={service?.sortOrder || 0} />
      </div>

      {/* --- PRICING --- */}
      <div className={activeTab === 'pricing' ? 'block space-y-4' : 'hidden'}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            label="Precio Base"
            name="price"
            type="number"
            defaultValue={service?.price?.toString()}
            placeholder="0"
          />
          <FormField label="Moneda" name="currency" defaultValue={service?.currency || 'EUR'} />
          <FormField
            label="Etiqueta"
            name="priceLabel"
            type="select"
            defaultValue={service?.priceLabel || 'desde'}
            options={[
              { value: 'desde', label: 'Desde' },
              { value: 'fijo', label: 'Precio fijo' },
              { value: 'consultar', label: 'A consultar' },
              { value: 'gratis', label: 'Gratis' },
            ]}
          />
        </div>
        <FormField
          label="Niveles de Precio (JSON: [{name: 'Básico', price: 100}])"
          name="pricingTiers"
          type="textarea"
          defaultValue={service?.pricingTiers ? JSON.stringify(service.pricingTiers) : ''}
          placeholder='[{"name": "Básico", "price": 5000}]'
          rows={4}
        />
      </div>

      {/* --- SCHEDULE --- */}
      <div className={activeTab === 'schedule' ? 'block space-y-4' : 'hidden'}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            label="Duración (Texto)"
            name="duration"
            defaultValue={service?.duration || ''}
            placeholder="2 horas"
          />
          <FormField
            label="Duración (Minutos)"
            name="durationMinutes"
            type="number"
            defaultValue={service?.durationMinutes?.toString()}
            placeholder="120"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            label="Max. Reservas por Día"
            name="maxBookingsPerDay"
            type="number"
            defaultValue={service?.maxBookingsPerDay?.toString() || '3'}
          />
          <FormField
            label="Días Antelación Mínima"
            name="advanceNoticeDays"
            type="number"
            defaultValue={service?.advanceNoticeDays?.toString() || '2'}
          />
        </div>
        <div className="bg-muted/20 rounded-lg p-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="isAvailable"
              value="true"
              defaultChecked={service ? service.isAvailable : true}
              className="h-5 w-5"
            />
            <span className="font-medium">Disponible para reservas</span>
          </label>
        </div>
      </div>

      {/* --- DETAILS --- */}
      <div className={activeTab === 'details' ? 'block space-y-4' : 'hidden'}>
        <FormField
          label="Color de Marca (Hex)"
          name="color"
          defaultValue={service?.color || ''}
          placeholder="#ff00ff"
        />
        <FormField
          label="Video URL"
          name="videoUrl"
          defaultValue={service?.videoUrl || ''}
          placeholder="https://youtube.com..."
        />
        <FormField
          label="Galería (URLs sep. por coma)"
          name="galleryUrls"
          defaultValue={service?.galleryUrls?.join(', ') || ''}
        />
        <FormField
          label="Requisitos para el Cliente"
          name="requirements"
          type="textarea"
          defaultValue={service?.requirements || ''}
          rows={3}
        />
        <FormField
          label="Política de Cancelación"
          name="cancellationPolicy"
          type="textarea"
          defaultValue={service?.cancellationPolicy || ''}
          rows={3}
        />
      </div>

      {/* --- SEO --- */}
      <div className={activeTab === 'seo' ? 'block space-y-4' : 'hidden'}>
        <FormField label="Meta Title" name="metaTitle" defaultValue={service?.metaTitle || ''} />
        <FormField
          label="Meta Description"
          name="metaDescription"
          type="textarea"
          defaultValue={service?.metaDescription || ''}
          rows={2}
        />
        <FormField
          label="Keywords (sep. por coma)"
          name="metaKeywords"
          defaultValue={service?.metaKeywords?.join(', ') || ''}
        />
      </div>

      <div className="bg-background/80 sticky bottom-0 z-10 flex justify-end gap-3 border-t border-[var(--border)] p-4 pt-6 backdrop-blur-sm">
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
