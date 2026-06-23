'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useReducedMotion } from 'framer-motion'
import { motion } from '@/components/ui'
import { submitPublicTestimonial } from '@/actions/cms/testimonials'
import { Input, TextArea, Button } from '@/components/ui'
import { showToast } from '@/lib/toast'
import { Heart, Home, Sparkles, Star } from 'lucide-react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils'

/**
 * TestimonialForm - Refactored to use UI components
 * Uses fixed public theme classes so public colors stay centralized.
 */
const publicFieldClass =
  'public-testimonial-field rounded-xl border-2 px-4 py-3 transition-all focus:outline-none'

const publicFieldContainerClass = 'public-testimonial-labels'

export default function TestimonialForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [rating, setRating] = useState(5)
  const prefersReducedMotion = useReducedMotion()
  const { executeRecaptcha } = useGoogleReCaptcha()

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    formData.set('rating', rating.toString())

    try {
      const token = executeRecaptcha ? await executeRecaptcha('testimonial_form') : ''
      formData.set('recaptchaToken', token)
      const result = await submitPublicTestimonial(formData)

      if (result.success) {
        showToast.success(result.message || '¡Gracias por tu testimonio!', undefined, {
          icon: '❤️',
        })
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="public-testimonial-success-panel rounded-2xl border p-10 text-center"
      >
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 2,
              repeat: prefersReducedMotion ? 0 : Infinity,
              ease: 'easeInOut',
            }}
            className="public-testimonial-avatar absolute inset-0 rounded-full"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          >
            <Heart className="public-testimonial-success-icon relative h-10 w-10 fill-current" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.3 }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="public-testimonial-success-icon h-5 w-5" />
          </motion.div>
        </div>

        <motion.h3
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="public-testimonial-success-title font-decorative mb-2 text-2xl font-bold"
        >
          ¡Gracias de corazón!
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="public-testimonial-success-text text-base leading-relaxed"
        >
          Tu testimonio fue recibido con mucho amor.
          <br />
          Lo revisaré personalmente antes de publicarlo. ✨
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="mt-8"
        >
          <Link
            href={ROUTES.home}
            className="public-testimonial-success-link inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          >
            <Home size={16} />
            Volver al inicio
          </Link>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <Input
        label="Tu nombre *"
        name="name"
        required
        placeholder="¿Cómo te llamas?"
        className={publicFieldClass}
        containerClassName={publicFieldContainerClass}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Cargo / Profesión"
          name="position"
          placeholder="ej. Diseñadora gráfica"
          className={publicFieldClass}
          containerClassName={publicFieldContainerClass}
        />
        <Input
          label="Empresa / Negocio"
          name="company"
          placeholder="ej. Studio Creativo"
          className={publicFieldClass}
          containerClassName={publicFieldContainerClass}
        />
      </div>

      <Input
        label="Email (opcional)"
        name="email"
        type="email"
        inputMode="email"
        placeholder="tu@email.com"
        className={publicFieldClass}
        containerClassName={publicFieldContainerClass}
      />

      <fieldset className="public-testimonial-labels">
        <legend className="mb-2 block text-sm font-medium">Tu calificación *</legend>
        <div
          className="flex flex-wrap gap-1 sm:gap-2"
          role="group"
          aria-label="Valoración de 1 a 5"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`Valoración de ${star} de 5 estrellas`}
              className="public-testimonial-star-button cursor-pointer rounded-md p-1 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:outline-none"
            >
              <Star
                className={cn(
                  'size-9 sm:size-10',
                  star <= rating
                    ? 'public-testimonial-rating-star-active'
                    : 'public-testimonial-rating-star'
                )}
                aria-hidden
              />
            </button>
          ))}
        </div>
      </fieldset>

      <div className={publicFieldContainerClass}>
        <TextArea
          label="Tu experiencia *"
          name="text"
          required
          rows={4}
          placeholder="Cuéntanos tu experiencia trabajando con Paola..."
          helperText="Entre 20 y 500 caracteres"
          className={publicFieldClass}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        loading={isSubmitting}
        fullWidth
        size="lg"
        className="public-testimonial-submit rounded-xl"
      >
        Enviar testimonio
      </Button>
    </form>
  )
}
