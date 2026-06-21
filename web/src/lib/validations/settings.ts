import { z } from 'zod'

import { zHexColorNullable, zGoogleFontsUrlNullable } from './shared'

// ============================================
// ADMIN SETTINGS SCHEMAS
// ============================================

// Home Settings
export const homeSettingsSchema = z.object({
  showHeroTitle1: z.boolean().optional(),
  showHeroTitle2: z.boolean().optional(),
  showOwnerName: z.boolean().optional(),

  // Título 1
  heroTitle1Text: z.string().optional(),
  heroTitle1Font: z.string().optional().nullable(),
  heroTitle1FontUrl: zGoogleFontsUrlNullable,
  heroTitle1FontSize: z.number().min(10).max(300).optional(),
  heroTitle1Color: zHexColorNullable,
  heroTitle1ColorDark: zHexColorNullable,
  heroTitle1ZIndex: z.number().int().optional(),
  heroTitle1OffsetX: z.number().optional(),
  heroTitle1OffsetY: z.number().optional(),

  // Título 2
  heroTitle2Text: z.string().optional(),
  heroTitle2Font: z.string().optional().nullable(),
  heroTitle2FontUrl: zGoogleFontsUrlNullable,
  heroTitle2FontSize: z.number().min(10).max(300).optional(),
  heroTitle2Color: zHexColorNullable,
  heroTitle2ColorDark: zHexColorNullable,
  heroTitle2ZIndex: z.number().int().optional(),
  heroTitle2OffsetX: z.number().optional(),
  heroTitle2OffsetY: z.number().optional(),

  // Nombre propietario
  ownerNameText: z.string().optional(),
  ownerNameFont: z.string().optional().nullable(),
  ownerNameFontUrl: zGoogleFontsUrlNullable,
  ownerNameFontSize: z.number().min(10).max(100).optional(),
  ownerNameColor: zHexColorNullable,
  ownerNameColorDark: zHexColorNullable,
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

  heroImmersiveEnabled: z.boolean().optional(),
  heroBackdropMediaKind: z.enum(['auto', 'image', 'video']).optional(),
  heroBackdropUrl: z.string().optional().nullable(),
  heroBackdropPosterUrl: z.string().optional().nullable(),
  heroBackdropLoop: z.boolean().optional(),
  heroBackdropMuted: z.boolean().optional(),
  heroBackdropPlaysInline: z.boolean().optional(),
  heroBackdropObjectFit: z.enum(['cover', 'contain']).optional(),
  heroBackdropObjectPosition: z.string().max(80).optional().nullable(),
  heroForegroundPortraitShow: z.boolean().optional(),
  heroScrimEdge: z.enum(['left', 'right', 'top', 'both', 'none']).optional(),
  heroScrimShowLeft: z.boolean().optional(),
  heroScrimShowRight: z.boolean().optional(),
  heroScrimShowTop: z.boolean().optional(),
  heroScrimExtentPercent: z.number().int().min(5).max(100).optional(),
  heroScrimOpacity: z.number().int().min(0).max(100).optional(),
  heroScrimColor: zHexColorNullable,
  heroScrimColorDark: zHexColorNullable,
  heroScrimFeatherPercent: z.number().int().min(0).max(100).optional(),
  heroBackdropTintOpacity: z.number().int().min(0).max(100).optional(),
  heroScrimMobileShowLeft: z.boolean().optional(),
  heroScrimMobileShowRight: z.boolean().optional(),
  heroScrimMobileShowTop: z.boolean().optional(),
  heroScrimMobileExtentPercent: z.number().int().min(5).max(100).optional().nullable(),
  heroScrimMobileOpacity: z.number().int().min(0).max(100).optional().nullable(),

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
  ctaFontUrl: zGoogleFontsUrlNullable,
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
  showFeaturedImages: z.boolean(),
  featuredTitle: z.string().optional().nullable(),
  featuredTitleFont: z.string().optional().nullable(),
  featuredTitleFontUrl: zGoogleFontsUrlNullable,
  featuredTitleFontSize: z.number().min(10).max(100).optional(),
  featuredTitleColor: zHexColorNullable,
  featuredTitleColorDark: zHexColorNullable,
  featuredCount: z.number().min(1).max(20),
})

export type HomeSettingsFormData = z.infer<typeof homeSettingsSchema>

// About Settings (SRP: no longer contains testimonial fields)
export const aboutSettingsSchema = z.object({
  illustrationUrl: z.string().optional().nullable(),
  illustrationAlt: z.string().optional().nullable(),
  illustrationMaxPx: z.number().int().min(32).max(480).optional().nullable(),
  illustrationMobileMaxPx: z.number().int().min(32).max(480).optional().nullable(),
  bioTitle: z.string().optional().nullable(),
  bioTitleFont: z.string().optional().nullable(),
  bioTitleFontUrl: zGoogleFontsUrlNullable,
  bioTitleFontSize: z.number().int().min(12).max(160).optional().nullable(),
  bioTitleMobileFontSize: z.number().int().min(12).max(160).optional().nullable(),
  bioTitleColor: zHexColorNullable,
  bioTitleColorDark: zHexColorNullable,
  bioIntro: z.string().optional().nullable(),
  bioDescription: z.string().optional().nullable(),
  profileImageUrl: z.string().optional().nullable(),
  profileImageAlt: z.string().optional().nullable(),
  profileImageShape: z.enum(['ellipse', 'circle', 'rounded', 'none']).optional().nullable(),
  profileImageShadowEnabled: z.boolean().optional(),
  profileImageShadowBlur: z.number().int().min(0).max(80).optional().nullable(),
  profileImageShadowSpread: z.number().int().min(-40).max(40).optional().nullable(),
  profileImageShadowOffsetX: z.number().int().min(-80).max(80).optional().nullable(),
  profileImageShadowOffsetY: z.number().int().min(-80).max(80).optional().nullable(),
  profileImageShadowColor: zHexColorNullable,
  profileImageShadowOpacity: z.number().int().min(0).max(100).optional().nullable(),
  skills: z.array(z.string()).optional(),
  yearsExperience: z.number().optional().nullable(),
  certifications: z.array(z.string()).optional(),
})

export type AboutSettingsFormData = z.infer<typeof aboutSettingsSchema>

export const servicesPageSettingsSchema = z.object({
  listTitle: z.string().optional().nullable(),
  listIntro: z.string().optional().nullable(),
  listTitleFont: z.string().optional().nullable(),
  listTitleFontUrl: zGoogleFontsUrlNullable,
  listTitleFontSize: z.number().int().min(12).max(160).optional().nullable(),
  listTitleMobileFontSize: z.number().int().min(12).max(160).optional().nullable(),
  listTitleColor: zHexColorNullable,
  listTitleColorDark: zHexColorNullable,
})

export type ServicesPageSettingsFormData = z.infer<typeof servicesPageSettingsSchema>

// Testimonial Display Settings (SRP: separate from About)
export const testimonialSettingsSchema = z.object({
  showOnAbout: z.boolean().optional(),
  showOnAll: z.boolean().optional(),
  title: z.string().optional(),
  maxDisplay: z.number().min(1).max(20).optional(),
  sliderAutoAdvanceMs: z.number().min(1000).max(30000).optional(),
})

export type TestimonialSettingsFormData = z.infer<typeof testimonialSettingsSchema>

// Contact Settings
export const contactSettingsSchema = z.object({
  pageTitle: z.string().optional().nullable(),
  illustrationUrl: z.string().optional().nullable(),
  illustrationAlt: z.string().optional().nullable(),
  ownerName: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  instagram: z.string().url().optional().nullable(),
  instagramUsername: z.string().trim().max(100).optional(),
  location: z.string().optional().nullable(),
  showSocialLinks: z.boolean().optional(),
  showPhone: z.boolean().optional(),
  showWhatsapp: z.boolean().optional(),
  showEmail: z.boolean().optional(),
  showLocation: z.boolean().optional(),
  showInstagram: z.boolean().optional(),
  instagramPostUrl: z.string().url().optional().nullable(),
  showInstagramEmbed: z.boolean().optional(),
})

export type ContactSettingsFormData = z.infer<typeof contactSettingsSchema>

// Site Settings
export const siteSettingsSchema = z.object({
  siteName: z.string().min(1).max(200).optional(),
  siteTagline: z.string().max(500).nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
  faviconUrl: z.string().url().nullable().optional(),
  defaultEmail: z.string().email().nullable().optional(),
  defaultPhone: z.string().max(30).nullable().optional(),
  defaultWhatsapp: z.string().max(30).nullable().optional(),
  defaultMetaTitle: z.string().max(160).nullable().optional(),
  defaultMetaDescription: z.string().max(320).nullable().optional(),
  defaultOgImage: z.string().url().nullable().optional(),
  defaultAddress: z.string().max(300).nullable().optional(),
  maintenanceMode: z.boolean().optional(),
  maintenanceMessage: z.string().max(500).nullable().optional(),
  showAboutPage: z.boolean().optional(),
  showGalleryPage: z.boolean().optional(),
  showServicesPage: z.boolean().optional(),
  showContactPage: z.boolean().optional(),
  allowIndexing: z.boolean().optional(),
  navbarBrandText: z.string().max(100).nullable().optional(),
  navbarBrandFont: z.string().max(100).nullable().optional(),
  navbarBrandFontUrl: zGoogleFontsUrlNullable,
  navbarBrandFontSize: z.number().int().min(8).max(120).nullable().optional(),
  navbarBrandColor: zHexColorNullable,
  navbarBrandColorDark: zHexColorNullable,
  navbarShowBrand: z.boolean().optional(),
})

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>

// Category Display Settings
export const categorySettingsSchema = z.object({
  showDescription: z.boolean().default(true),
  gridColumns: z.number().min(1).max(5).default(3),
  isActive: z.boolean().default(true),
})

export type CategorySettingsFormData = z.infer<typeof categorySettingsSchema>
