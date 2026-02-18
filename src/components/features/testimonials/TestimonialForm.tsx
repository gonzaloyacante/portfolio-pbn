'use client'

import { useState } from 'react'
import { submitPublicTestimonial } from '@/actions/cms/testimonials'
import { Button, Input, TextArea } from '@/components/ui'
import { showToast } from '@/lib/toast'

/**
 * TestimonialForm - Refactored to use UI components
 * Uses Input, TextArea, Button from @/components/ui instead of inline styles
 */
export default function TestimonialForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [rating, setRating] = useState(5)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    formData.set('rating', rating.toString())

    try {
      const result = await submitPublicTestimonial(formData)

      if (result.success) {
        showToast.success(result.message || '¡Gracias por tu testimonio!')
        setIsSubmitted(true)
      } else {
        showToast.error(result.error || 'Error al enviar')
      }
    } catch {
      showToast.error('Error al enviar el testimonio')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="border-primary/20 bg-primary/5 dark:bg-primary/10 rounded-2xl border p-8 text-center">
        <span className="mb-4 block text-4xl">✅</span>
        <h3 className="text-primary mb-2 text-xl font-bold">¡Gracias por tu testimonio!</h3>
        <p className="text-muted-foreground">Tu opinión será publicada después de ser revisada.</p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <Input label="Tu nombre *" name="name" required placeholder="¿Cómo te llamas?" />

      <Input label="Email (opcional)" name="email" type="email" placeholder="tu@email.com" />

      <div>
        <label className="text-foreground mb-2 block text-sm font-medium">Tu calificación *</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="cursor-pointer text-3xl transition-transform hover:scale-110"
            >
              {star <= rating ? '⭐' : '☆'}
            </button>
          ))}
        </div>
      </div>

      <TextArea
        label="Tu experiencia *"
        name="text"
        required
        rows={4}
        placeholder="Cuéntanos tu experiencia trabajando con Paola..."
        helperText="Entre 20 y 500 caracteres"
      />

      <Button type="submit" loading={isSubmitting} className="w-full">
        Enviar Testimonio
      </Button>
    </form>
  )
}
