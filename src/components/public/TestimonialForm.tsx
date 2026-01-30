'use client'

import { useState } from 'react'
import { submitPublicTestimonial } from '@/actions/testimonials.actions'
import { Button, Input, TextArea } from '@/components/ui'
import toast from 'react-hot-toast'

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
        toast.success(result.message || '¡Gracias por tu testimonio!')
        setIsSubmitted(true)
      } else {
        toast.error(result.error || 'Error al enviar')
      }
    } catch {
      toast.error('Error al enviar el testimonio')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-50 p-8 text-center dark:bg-green-900/20">
        <span className="mb-4 block text-4xl">✅</span>
        <h3 className="mb-2 text-xl font-bold text-green-800 dark:text-green-200">
          ¡Gracias por tu testimonio!
        </h3>
        <p className="text-green-700 dark:text-green-300">
          Tu opinión será publicada después de ser revisada.
        </p>
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
