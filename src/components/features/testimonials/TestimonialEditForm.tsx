'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Testimonial } from '@prisma/client'
import { updateTestimonial } from '@/actions/cms/testimonials'
import { Button, Input, TextArea } from '@/components/ui'
import { SmartField as FormField } from '@/components/ui'
import { showToast } from '@/lib/toast'

interface TestimonialEditFormProps {
  testimonial: Testimonial
}

export default function TestimonialEditForm({ testimonial }: TestimonialEditFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await updateTestimonial(testimonial.id, formData)

      if (result.success) {
        showToast.success('Testimonio actualizado')
        router.push('/admin/testimonios')
        router.refresh()
      } else {
        showToast.error(result.error || 'Error al actualizar')
      }
    } catch {
      showToast.error('Error inesperado')
    } finally {
      setIsSubmitting(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'identity', label: 'Identidad & Info' },
    { id: 'admin', label: 'Moderación' },
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
        <Input label="Nombre del Cliente" name="name" defaultValue={testimonial.name} required />
        <TextArea
          label="Testimonio"
          name="text"
          defaultValue={testimonial.text}
          required
          rows={5}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            label="Calificación"
            name="rating"
            type="select"
            defaultValue={testimonial.rating.toString()}
            options={[
              { value: '5', label: '⭐⭐⭐⭐⭐ (5)' },
              { value: '4', label: '⭐⭐⭐⭐ (4)' },
              { value: '3', label: '⭐⭐⭐ (3)' },
              { value: '2', label: '⭐⭐ (2)' },
              { value: '1', label: '⭐ (1)' },
            ]}
          />
        </div>
      </div>

      {/* --- IDENTITY --- */}
      <div className={activeTab === 'identity' ? 'block space-y-4' : 'hidden'}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Email"
            name="email"
            defaultValue={testimonial.email || ''}
            placeholder="cliente@email.com"
          />
          <Input
            label="Avatar URL"
            name="avatarUrl"
            defaultValue={testimonial.avatarUrl || ''}
            placeholder="https://..."
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Cargo / Posición"
            name="position"
            defaultValue={testimonial.position || ''}
            placeholder="CEO, Novia, etc."
          />
          <Input
            label="Empresa"
            name="company"
            defaultValue={testimonial.company || ''}
            placeholder="Nombre de empresa"
          />
        </div>
        <Input
          label="Sitio Web"
          name="website"
          defaultValue={testimonial.website || ''}
          placeholder="https://..."
        />
      </div>

      {/* --- ADMIN --- */}
      <div className={activeTab === 'admin' ? 'block space-y-4' : 'hidden'}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            label="Estado"
            name="status"
            type="select"
            defaultValue={testimonial.status}
            options={[
              { value: 'PENDING', label: 'Pendiente' },
              { value: 'APPROVED', label: 'Aprobado' },
              { value: 'REJECTED', label: 'Rechazado' },
            ]}
          />
          <TextArea
            label="Nota de Moderación (Interna)"
            name="moderationNote"
            defaultValue={testimonial.moderationNote || ''}
            rows={2}
            placeholder="Razón de rechazo o notas..."
          />
        </div>

        <div className="bg-muted/20 space-y-3 rounded-xl p-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked={testimonial.isActive}
              className="text-primary focus:ring-primary h-5 w-5 rounded border-gray-300"
            />
            <span className="font-medium">Visible (Activo)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="isVerified"
              value="true"
              defaultChecked={testimonial.verified}
              className="text-primary focus:ring-primary h-5 w-5 rounded border-gray-300"
            />
            <span className="font-medium">Verificado (Badge Azul)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              value="true"
              defaultChecked={testimonial.featured}
              className="text-primary focus:ring-primary h-5 w-5 rounded border-gray-300"
            />
            <span className="font-medium">Destacado (Home Page)</span>
          </label>
        </div>
        <p className="text-muted-foreground text-xs">
          Originalmente creado: {new Date(testimonial.createdAt).toLocaleDateString()}
        </p>
        {testimonial.source && (
          <p className="text-muted-foreground text-xs">Fuente: {testimonial.source}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t border-[var(--border)] pt-6">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Guardar Cambios
        </Button>
      </div>
    </form>
  )
}
