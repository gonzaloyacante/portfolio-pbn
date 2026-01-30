import { z } from 'zod'

/**
 * Validaciones con Zod para seguridad y consistencia
 */

// ============================================
// PUBLIC FORMS
// ============================================

// Contact Form (Public)
export const contactFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(2000),
  responsePreference: z.enum(['EMAIL', 'PHONE', 'WHATSAPP']),
  privacy: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar la política de privacidad',
  }),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Testimonial Form (Public)
export const testimonialFormSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  text: z.string().min(10, 'El testimonio debe tener al menos 10 caracteres'),
  position: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  avatarUrl: z.string().optional(),
})

export type TestimonialFormData = z.infer<typeof testimonialFormSchema>

// ============================================
// ADMIN SETTINGS SCHEMAS
// ============================================

// Theme Editor
export const themeEditorSchema = z.object({
  // Light Mode
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),
  backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),
  textColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),
  cardBgColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),

  // Dark Mode
  darkPrimaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),
  darkSecondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),
  darkAccentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),
  darkBackgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),
  darkTextColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),
  darkCardBgColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color inválido'),

  // Typography - Base
  headingFont: z.string().min(1, 'Fuente requerida'),
  headingFontUrl: z.string().optional().nullable(),
  scriptFont: z.string().min(1, 'Fuente requerida'),
  scriptFontUrl: z.string().optional().nullable(),
  bodyFont: z.string().min(1, 'Fuente requerida'),
  bodyFontUrl: z.string().optional().nullable(),

  // Typography - Brand
  brandFont: z.string().optional().nullable(),
  brandFontUrl: z.string().optional().nullable(),
  portfolioFont: z.string().optional().nullable(),
  portfolioFontUrl: z.string().optional().nullable(),
  signatureFont: z.string().optional().nullable(),
  signatureFontUrl: z.string().optional().nullable(),

  borderRadius: z.number().min(0).max(100),
})

export type ThemeEditorData = z.infer<typeof themeEditorSchema>

// Home Settings
export const homeSettingsSchema = z.object({
  heroTitle1: z.string().optional(),
  heroTitle2: z.string().optional(),
  illustrationUrl: z.string().optional(),
  illustrationAlt: z.string().optional(),
  ownerName: z.string().optional(),
  heroMainImageUrl: z.string().optional(),
  heroMainImageAlt: z.string().optional(),
  heroMainImageCaption: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  showFeaturedProjects: z.boolean(),
  featuredTitle: z.string().optional(),
  featuredCount: z.number().min(1).max(20),
})

export type HomeSettingsFormData = z.infer<typeof homeSettingsSchema>

// About Settings
export const aboutSettingsSchema = z.object({
  illustrationUrl: z.string().optional(),
  illustrationAlt: z.string().optional(),
  bioTitle: z.string().optional(),
  bioIntro: z.string().optional(),
  bioDescription: z.string().optional(),
  profileImageUrl: z.string().optional(),
  profileImageAlt: z.string().optional(),
  skills: z.array(z.string()).optional(),
  yearsExperience: z.number().optional(),
  certifications: z.array(z.string()).optional(),
  showTestimonials: z.boolean(),
  testimonialsTitle: z.string().optional(),
})

export type AboutSettingsFormData = z.infer<typeof aboutSettingsSchema>

// Contact Settings
export const contactSettingsSchema = z.object({
  pageTitle: z.string().optional(),
  illustrationUrl: z.string().optional(),
  illustrationAlt: z.string().optional(),
  ownerName: z.string().optional(),
  email: z.email(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  location: z.string().optional(),
  formTitle: z.string().optional(),
  nameLabel: z.string().optional(),
  emailLabel: z.string().optional(),
  phoneLabel: z.string().optional(),
  messageLabel: z.string().optional(),
  preferenceLabel: z.string().optional(),
  submitLabel: z.string().optional(),
  successTitle: z.string().optional(),
  successMessage: z.string().optional(),
  sendAnotherLabel: z.string().optional(),
  showSocialLinks: z.boolean(),
})

export type ContactSettingsFormData = z.infer<typeof contactSettingsSchema>

// ============================================
// DATA MODELS
// ============================================

// Project
export const projectFormSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Categoría requerida'),
  date: z.string(), // date input returns string
  thumbnailUrl: z.string().optional(),
  isFeatured: z.boolean().optional(),
})

export type ProjectFormData = z.infer<typeof projectFormSchema>

// Category
export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().optional(),
  sortOrder: z.number().optional(),
})

// Auth schemas
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})
