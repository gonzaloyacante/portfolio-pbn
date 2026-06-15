import { z } from 'zod'

// ============================================
// PUBLIC FORMS
// ============================================

// Contact Form (Public)
export const contactFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre excede el límite permitido'),
    email: z.string().trim().optional(),
    phone: z.string().trim().max(30).optional(),
    message: z
      .string()
      .trim()
      .min(10, 'El mensaje debe tener al menos 10 caracteres')
      .max(2000, 'El mensaje es demasiado largo'),
    responsePreference: z.enum(['EMAIL', 'PHONE', 'WHATSAPP', 'INSTAGRAM']),
    instagramUser: z.string().trim().max(50).optional(),
    privacy: z.boolean().refine((val) => val === true, {
      message: 'Debes aceptar la política de privacidad',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.responsePreference === 'EMAIL') {
      if (!data.email?.trim()) {
        ctx.addIssue({ code: 'custom', path: ['email'], message: 'El email es obligatorio' })
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        ctx.addIssue({ code: 'custom', path: ['email'], message: 'Email inválido' })
      }
    } else if (data.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      ctx.addIssue({ code: 'custom', path: ['email'], message: 'Email inválido' })
    }
    if (
      (data.responsePreference === 'PHONE' || data.responsePreference === 'WHATSAPP') &&
      !data.phone?.trim()
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['phone'],
        message: 'El teléfono es obligatorio para este tipo de contacto',
      })
    }
    if (data.responsePreference === 'INSTAGRAM' && !data.instagramUser?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['instagramUser'],
        message: 'El usuario de Instagram es obligatorio',
      })
    }
  })

export type ContactFormData = z.infer<typeof contactFormSchema>

// Testimonial Form (Public)
export const testimonialFormSchema = z.object({
  name: z.string().trim().min(2, 'El nombre es obligatorio').max(100),
  text: z
    .string()
    .trim()
    .min(10, 'El testimonio debe tener al menos 10 caracteres')
    .max(1000, 'Testimonio demasiado largo'),
  position: z.string().trim().max(100).optional(),
  rating: z.number().min(1).max(5).default(5),
  avatarUrl: z.string().trim().optional(),
})

export type TestimonialFormData = z.infer<typeof testimonialFormSchema>
