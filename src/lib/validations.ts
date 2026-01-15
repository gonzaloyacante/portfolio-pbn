import { z } from 'zod'

/**
 * Validaciones con Zod para seguridad y consistencia
 */

// Contacto
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  email: z.string().email('Email inválido'),
  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje es demasiado largo'),
  privacy: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar la política de privacidad',
  }),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Proyecto (UI Form)
export const projectFormSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(200),
  description: z.string().max(5000).optional(),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Fecha inválida',
  }),
})

export type ProjectFormData = z.infer<typeof projectFormSchema>

// Proyecto (Full Model Validation)
export const projectSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  description: z.string().min(10).max(5000),
  categoryId: z.string().cuid(),
  thumbnailUrl: z.string().url(),
  date: z.date(),
  isActive: z.boolean().default(true),
})

// Categoría
export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  description: z.string().max(500).optional(),
})

// Theme Setting (Full Editor)
export const themeEditorSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),
  backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),
  textColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),
  headingFont: z.string().min(1, 'Fuente requerida'),
  bodyFont: z.string().min(1, 'Fuente requerida'),
  borderRadius: z.number().min(0).max(50),
})

export type ThemeEditorData = z.infer<typeof themeEditorSchema>

// Contact Settings (Admin)
export const contactSettingsSchema = z.object({
  emails: z.array(z.string().email('Email inválido')),
  phones: z.array(z.string()),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  hoursTitle: z.string().optional(),
  hoursWeekdays: z.string().optional(),
  hoursSaturday: z.string().optional(),
  hoursSunday: z.string().optional(),
  formTitle: z.string().min(1, 'Título requerido'),
  formSuccessMessage: z.string().min(1, 'Mensaje requerido'),
  isActive: z.boolean(),
})

export type ContactSettingsFormData = z.infer<typeof contactSettingsSchema>

// Auth
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2).max(100),
  password: z
    .string()
    .min(12, 'La contraseña debe tener al menos 12 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(12, 'La contraseña debe tener al menos 12 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
})
