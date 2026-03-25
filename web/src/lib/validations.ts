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
  headingFontSize: z.number().min(10).max(200),
  scriptFont: z.string().min(1, 'Fuente requerida'),
  scriptFontUrl: z.string().optional().nullable(),
  scriptFontSize: z.number().min(10).max(200),
  bodyFont: z.string().min(1, 'Fuente requerida'),
  bodyFontUrl: z.string().optional().nullable(),
  bodyFontSize: z.number().min(10).max(200),

  // Typography - Brand
  brandFont: z.string().optional().nullable(),
  brandFontUrl: z.string().optional().nullable(),
  brandFontSize: z.number().min(10).max(300),
  portfolioFont: z.string().optional().nullable(),
  portfolioFontUrl: z.string().optional().nullable(),
  portfolioFontSize: z.number().min(10).max(300),
  signatureFont: z.string().optional().nullable(),
  signatureFontUrl: z.string().optional().nullable(),
  signatureFontSize: z.number().min(10).max(200),

  borderRadius: z.number().min(0).max(100),
})

export type ThemeEditorData = z.infer<typeof themeEditorSchema>

// Home Settings
export const homeSettingsSchema = z.object({
  // Título 1
  heroTitle1Text: z.string().optional(),
  heroTitle1Font: z.string().optional().nullable(),
  heroTitle1FontUrl: z.string().optional().nullable(),
  heroTitle1FontSize: z.number().min(10).max(300).optional(),
  heroTitle1Color: z
    .string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .optional()
    .nullable(),
  heroTitle1ColorDark: z
    .string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .optional()
    .nullable(),
  heroTitle1ZIndex: z.number().int().optional(),
  heroTitle1OffsetX: z.number().optional(),
  heroTitle1OffsetY: z.number().optional(),

  // Título 2
  heroTitle2Text: z.string().optional(),
  heroTitle2Font: z.string().optional().nullable(),
  heroTitle2FontUrl: z.string().optional().nullable(),
  heroTitle2FontSize: z.number().min(10).max(300).optional(),
  heroTitle2Color: z
    .string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .optional()
    .nullable(),
  heroTitle2ColorDark: z
    .string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .optional()
    .nullable(),
  heroTitle2ZIndex: z.number().int().optional(),
  heroTitle2OffsetX: z.number().optional(),
  heroTitle2OffsetY: z.number().optional(),

  // Nombre propietario
  ownerNameText: z.string().optional(),
  ownerNameFont: z.string().optional().nullable(),
  ownerNameFontUrl: z.string().optional().nullable(),
  ownerNameFontSize: z.number().min(10).max(100).optional(),
  ownerNameColor: z
    .string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .optional()
    .nullable(),
  ownerNameColorDark: z
    .string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .optional()
    .nullable(),
  ownerNameZIndex: z.number().int().optional(),
  ownerNameOffsetX: z.number().optional(),
  ownerNameOffsetY: z.number().optional(),

  // Imágenes
  heroMainImageUrl: z.string().optional().nullable(),
  heroMainImageAlt: z.string().optional().nullable(),
  heroMainImageCaption: z.string().optional().nullable(),
  heroImageStyle: z.string().optional().nullable(),
  heroMainImageZIndex: z.number().int().optional(),
  heroMainImageOffsetX: z.number().optional(),
  heroMainImageOffsetY: z.number().optional(),
  illustrationUrl: z.string().optional().nullable(),
  illustrationAlt: z.string().optional().nullable(),
  illustrationZIndex: z.number().int().optional(),
  illustrationOpacity: z.number().min(0).max(100).optional(),
  illustrationSize: z.number().min(10).max(200).optional(),
  illustrationOffsetX: z.number().optional(),
  illustrationOffsetY: z.number().optional(),
  illustrationRotation: z.number().optional(),

  // Botón CTA
  ctaText: z.string().optional().nullable(),
  ctaLink: z.string().optional().nullable(),
  ctaFont: z.string().optional().nullable(),
  ctaFontUrl: z.string().optional().nullable(),
  ctaFontSize: z.number().min(10).max(32).optional(),
  ctaVariant: z.string().optional().nullable(),
  ctaSize: z.string().optional().nullable(),
  ctaOffsetX: z.number().optional(),
  ctaOffsetY: z.number().optional(),

  // ─── Mobile Overrides ────────────────────────────────────────────────────
  heroTitle1MobileOffsetX: z.number().optional().nullable(),
  heroTitle1MobileOffsetY: z.number().optional().nullable(),
  heroTitle1MobileFontSize: z.number().min(10).max(300).optional().nullable(),
  heroTitle2MobileOffsetX: z.number().optional().nullable(),
  heroTitle2MobileOffsetY: z.number().optional().nullable(),
  heroTitle2MobileFontSize: z.number().min(10).max(300).optional().nullable(),
  ownerNameMobileOffsetX: z.number().optional().nullable(),
  ownerNameMobileOffsetY: z.number().optional().nullable(),
  ownerNameMobileFontSize: z.number().min(10).max(100).optional().nullable(),
  heroMainImageMobileOffsetX: z.number().optional().nullable(),
  heroMainImageMobileOffsetY: z.number().optional().nullable(),
  illustrationMobileOffsetX: z.number().optional().nullable(),
  illustrationMobileOffsetY: z.number().optional().nullable(),
  illustrationMobileSize: z.number().min(10).max(200).optional().nullable(),
  illustrationMobileRotation: z.number().optional().nullable(),
  ctaMobileOffsetX: z.number().optional().nullable(),
  ctaMobileOffsetY: z.number().optional().nullable(),
  ctaMobileFontSize: z.number().min(10).max(32).optional().nullable(),

  // Sección destacados
  showFeaturedProjects: z.boolean(),
  featuredTitle: z.string().optional().nullable(),
  featuredTitleFont: z.string().optional().nullable(),
  featuredTitleFontUrl: z.string().optional().nullable(),
  featuredTitleFontSize: z.number().min(10).max(100).optional(),
  featuredTitleColor: z
    .string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .optional()
    .nullable(),
  featuredTitleColorDark: z
    .string()
    .regex(/^#[A-Fa-f0-9]{6}$/)
    .optional()
    .nullable(),
  featuredCount: z.number().min(1).max(20),
})

export type HomeSettingsFormData = z.infer<typeof homeSettingsSchema>

// About Settings (SRP: no longer contains testimonial fields)
export const aboutSettingsSchema = z.object({
  illustrationUrl: z.string().optional(),
  illustrationAlt: z.string().optional(),
  bioTitle: z.string().optional(),
  bioIntro: z.string().optional(),
  bioDescription: z.string().optional(),
  profileImageUrl: z.string().optional(),
  profileImageAlt: z.string().optional(),
  profileImageShape: z.enum(['ellipse', 'circle', 'rounded', 'none']).optional(),
  skills: z.array(z.string()).optional(),
  yearsExperience: z.number().optional(),
  certifications: z.array(z.string()).optional(),
})

export type AboutSettingsFormData = z.infer<typeof aboutSettingsSchema>

// Testimonial Display Settings (SRP: separate from About)
export const testimonialSettingsSchema = z.object({
  showOnAbout: z.boolean(),
  title: z.string().optional(),
  maxDisplay: z.number().min(1).max(20),
})

export type TestimonialSettingsFormData = z.infer<typeof testimonialSettingsSchema>

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
  showPhone: z.boolean().optional(),
  showWhatsapp: z.boolean().optional(),
  showEmail: z.boolean().optional(),
  showLocation: z.boolean().optional(),
})

export type ContactSettingsFormData = z.infer<typeof contactSettingsSchema>

// Project Display Settings
export const projectSettingsSchema = z.object({
  showCardTitles: z.boolean(),
  showCardCategory: z.boolean(),
  gridColumns: z.number().min(1).max(4),
})

export type ProjectSettingsFormData = z.infer<typeof projectSettingsSchema>

// Category Display Settings
export const categorySettingsSchema = z.object({
  showDescription: z.boolean().default(true),
  showProjectCount: z.boolean().default(true),
  gridColumns: z.number().min(1).max(5).default(4),
  isActive: z.boolean().default(true),
})

export type CategorySettingsFormData = z.infer<typeof categorySettingsSchema>

// ============================================
// DATA MODELS
// ============================================

// Project
export const projectFormSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional().nullable(),
  categoryId: z.string().min(1, 'Categoría requerida'),
  date: z.string(), // date input returns string
  thumbnailUrl: z.string().optional().nullable(),
  // Extended fields
  excerpt: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  client: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  tags: z.string().optional().nullable(), // Comma separated string from form
  // SEO
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  metaKeywords: z.string().optional().nullable(), // Comma separated string
  canonicalUrl: z.string().optional().nullable(),
  // Settings
  layout: z.string().optional().nullable(),
  isFeatured: z.union([z.boolean(), z.string()]).optional().nullable(), // Handle boolean or string 'on'/'true'
  isPinned: z.union([z.boolean(), z.string()]).optional().nullable(),
  isActive: z.union([z.boolean(), z.string()]).optional().nullable(),
})

export type ProjectFormData = z.infer<typeof projectFormSchema>

// Project API schema (receives arrays for tags/metaKeywords, proper booleans)
export const projectApiSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional().nullable(),
  categoryId: z.string().min(1, 'Categoría requerida'),
  date: z.string().optional(), // Defaults to today on the server if not provided
  thumbnailUrl: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  client: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  metaKeywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().optional().nullable(),
  layout: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isPinned: z.boolean().optional(),
})

// Category
export const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  slug: z
    .string()
    .min(1, 'El slug es obligatorio')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  description: z.string().optional(),
  coverImageUrl: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  sortOrder: z.number().optional(),
})

// Auth schemas
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

// ============================================
// API ADMIN SCHEMAS (for route handler validation)
// ============================================

// ── Push Notifications ──────────────────────────────────────────────────────

export const pushRegisterSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  platform: z.enum(['android', 'ios'], { message: 'Plataforma debe ser android o ios' }),
})

export const pushUnregisterSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
})

// ── Services ────────────────────────────────────────────────────────────────

export const serviceApiSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  slug: z
    .string()
    .min(1, 'El slug es obligatorio')
    .regex(/^[a-z0-9-]+$/, 'Slug inválido'),
  description: z.string().optional().nullable(),
  shortDesc: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  priceLabel: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

// ── Category (API — extends base categorySchema) ────────────────────────────

export const categoryApiSchema = categorySchema.extend({
  isActive: z.boolean().optional(),
})

// ── Testimonials (API — extends base) ───────────────────────────────────────

export const testimonialApiSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  text: z.string().min(1, 'El texto es obligatorio'),
  excerpt: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  rating: z.number().min(1).max(5).optional(),
  verified: z.boolean().optional(),
  featured: z.boolean().optional(),
  source: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  isActive: z.boolean().optional(),
})

// ── Bookings ────────────────────────────────────────────────────────────────

export const bookingApiSchema = z.object({
  date: z.string().min(1, 'La fecha es obligatoria'),
  endDate: z.string().optional().nullable(),
  clientName: z.string().min(1, 'El nombre del cliente es obligatorio'),
  clientEmail: z.string().email('Email inválido'),
  clientPhone: z.string().optional().nullable(),
  clientNotes: z.string().optional().nullable(),
  guestCount: z.number().optional().nullable(),
  serviceId: z.string().min(1, 'El servicio es obligatorio'),
  adminNotes: z.string().optional().nullable(),
  totalAmount: z.number().optional().nullable(),
  paymentStatus: z.string().optional().nullable(),
  paymentMethod: z.string().optional().nullable(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).optional(),
})

// ── Contacts update ─────────────────────────────────────────────────────────

export const contactUpdateApiSchema = z.object({
  status: z.enum(['PENDING', 'READ', 'REPLIED', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  assignedTo: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v ?? undefined),
  isRead: z.boolean().optional(),
  replyText: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v ?? undefined),
  adminNote: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v ?? undefined),
  tags: z.array(z.string()).optional(),
})

// ── Social Links ────────────────────────────────────────────────────────────

export const socialLinkApiSchema = z.object({
  platform: z.string().min(1, 'Plataforma obligatoria'),
  url: z.string().url('URL inválida'),
  username: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

// ── Auth /me update ─────────────────────────────────────────────────────────

export const authMeUpdateSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional(),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  })
  .refine(
    (data) => {
      // If newPassword is set, currentPassword must also be set
      if (data.newPassword && !data.currentPassword) return false
      return true
    },
    { message: 'Debes indicar la contraseña actual para cambiarla', path: ['currentPassword'] }
  )

// ── Reorder ─────────────────────────────────────────────────────────────────

export const reorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        sortOrder: z.number().int(),
      })
    )
    .min(1, 'Se requiere al menos un elemento')
    .max(200, 'No se pueden reordenar más de 200 elementos a la vez'),
})

// ── App Release ─────────────────────────────────────────────────────────────

export const appReleaseApiSchema = z.object({
  version: z.string().min(1, 'La versión es obligatoria'),
  versionCode: z.number().int().positive(),
  releaseNotes: z.string().min(1, 'releaseNotes es obligatorio'),
  downloadUrl: z
    .string()
    .url('URL de descarga inválida')
    .refine((u) => u.startsWith('https://'), 'La URL de descarga debe ser HTTPS'),
  checksumSha256: z.string().optional().nullable(),
  mandatory: z.boolean().optional(),
  minVersion: z.string().optional().nullable(),
  fileSizeBytes: z.number().int().positive().optional().nullable(),
})

export const appReleaseDeleteSchema = z
  .object({
    id: z.string().optional(),
    version: z.string().optional(),
    downloadUrl: z.string().optional(),
  })
  .refine((data) => data.id || data.version || data.downloadUrl, {
    message: 'Se requiere al menos un identificador (id, version o downloadUrl)',
  })

// ── Upload ──────────────────────────────────────────────────────────────────

export const uploadDeleteSchema = z.object({
  publicId: z.string().min(1, 'publicId es requerido'),
})

// ── Partial schemas for PATCH endpoints ─────────────────────────────────────

export const projectPatchSchema = projectApiSchema
  .extend({
    slug: z.string().optional(),
    ogImage: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  })
  .partial()

export const categoryPatchSchema = categoryApiSchema
  .extend({
    metaTitle: z.string().optional().nullable(),
    metaDescription: z.string().optional().nullable(),
    metaKeywords: z.array(z.string()).optional(),
    ogImage: z.string().optional().nullable(),
  })
  .partial()

export const servicePatchSchema = serviceApiSchema
  .extend({
    currency: z.string().optional(),
    durationMinutes: z.number().optional().nullable(),
    isAvailable: z.boolean().optional(),
    maxBookingsPerDay: z.number().optional().nullable(),
    advanceNoticeDays: z.number().optional().nullable(),
    sortOrder: z.number().optional(),
    metaTitle: z.string().optional().nullable(),
    metaDescription: z.string().optional().nullable(),
    metaKeywords: z.array(z.string()).optional(),
    requirements: z.string().optional().nullable(),
    cancellationPolicy: z.string().optional().nullable(),
  })
  .partial()

export const testimonialPatchSchema = testimonialApiSchema
  .extend({
    sortOrder: z.number().optional(),
  })
  .partial()

export const bookingPatchSchema = bookingApiSchema
  .extend({
    cancellationReason: z.string().optional().nullable(),
    paidAmount: z.number().optional().nullable(),
    paymentRef: z.string().optional().nullable(),
  })
  .partial()
