'use client'

import { useState } from 'react'
import { submitPublicTestimonial } from '@/actions/testimonials.actions'
import toast from 'react-hot-toast'

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
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium"
          style={{ color: 'var(--color-text-primary, #6c0a0a)' }}
        >
          Tu nombre *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="¿Cómo te llamas?"
          className="border-pink-hot/30 focus:border-wine focus:ring-wine/20 dark:border-pink-light/30 dark:bg-wine/30 dark:text-pink-light w-full rounded-lg border bg-white px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium"
          style={{ color: 'var(--color-text-primary, #6c0a0a)' }}
        >
          Email (opcional)
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="tu@email.com"
          className="border-pink-hot/30 focus:border-wine focus:ring-wine/20 dark:border-pink-light/30 dark:bg-wine/30 dark:text-pink-light w-full rounded-lg border bg-white px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
        />
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium"
          style={{ color: 'var(--color-text-primary, #6c0a0a)' }}
        >
          Tu calificación *
        </label>
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

      <div>
        <label
          htmlFor="text"
          className="mb-2 block text-sm font-medium"
          style={{ color: 'var(--color-text-primary, #6c0a0a)' }}
        >
          Tu experiencia *
        </label>
        <textarea
          id="text"
          name="text"
          required
          rows={4}
          minLength={20}
          maxLength={500}
          placeholder="Cuéntanos tu experiencia trabajando con Paola..."
          className="border-pink-hot/30 focus:border-wine focus:ring-wine/20 dark:border-pink-light/30 dark:bg-wine/30 dark:text-pink-light w-full resize-none rounded-lg border bg-white px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-500">Entre 20 y 500 caracteres</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full cursor-pointer rounded-lg px-6 py-3 font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ backgroundColor: 'var(--color-text-primary, #6c0a0a)' }}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Enviando...
          </span>
        ) : (
          'Enviar Testimonio'
        )}
      </button>
    </form>
  )
}
