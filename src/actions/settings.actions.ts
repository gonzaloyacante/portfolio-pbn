'use server'

import { prisma } from '@/lib/db'
import { uploadImage } from '@/lib/cloudinary'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'
import { updateMultipleThemeSettings } from './theme.actions'

export async function getSiteConfig() {
  try {
    const config = await prisma.siteConfig.findFirst()
    return config
  } catch (error) {
    logger.error('Error fetching site config:', { error })
    return null
  }
}

import { z } from 'zod'

const SiteConfigSchema = z.object({
  // Branding
  ownerName: z.string().optional(),
  brandName: z.string().optional(),
  // Hero
  heroTitle1: z.string().optional(),
  heroTitle2: z.string().optional(),
  // Colors
  bgColor: z.string().optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  // Content
  aboutText: z.string().optional(),
  copyrightText: z.string().optional(),
  // Contact
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  contactLocation: z.string().optional(),
  // Social
  socialInstagram: z.string().optional(),
  socialTiktok: z.string().optional(),
  socialWhatsapp: z.string().optional(),
  socialYoutube: z.string().optional(),
  socialLinkedin: z.string().optional(),
  socialFacebook: z.string().optional(),
})

export async function updateSiteConfig(formData: FormData) {
  const rawData = {
    // Branding
    ownerName: formData.get('ownerName'),
    brandName: formData.get('brandName'),
    // Hero
    heroTitle1: formData.get('heroTitle1'),
    heroTitle2: formData.get('heroTitle2'),
    // Colors
    bgColor: formData.get('bgColor'),
    primaryColor: formData.get('primaryColor'),
    accentColor: formData.get('accentColor'),
    // Content
    aboutText: formData.get('aboutText'),
    copyrightText: formData.get('copyrightText'),
    // Contact
    contactEmail: formData.get('contactEmail'),
    contactPhone: formData.get('contactPhone'),
    contactLocation: formData.get('contactLocation'),
    // Social
    socialInstagram: formData.get('socialInstagram'),
    socialTiktok: formData.get('socialTiktok'),
    socialWhatsapp: formData.get('socialWhatsapp'),
    socialYoutube: formData.get('socialYoutube'),
    socialLinkedin: formData.get('socialLinkedin'),
    socialFacebook: formData.get('socialFacebook'),
  }

  const validation = SiteConfigSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const {
    ownerName,
    brandName,
    heroTitle1,
    heroTitle2,
    bgColor,
    primaryColor,
    accentColor,
    aboutText,
    copyrightText,
    contactEmail,
    contactPhone,
    contactLocation,
    socialInstagram,
    socialTiktok,
    socialWhatsapp,
    socialYoutube,
    socialLinkedin,
    socialFacebook,
  } = validation.data

  const heroImageFile = formData.get('heroImage') as File
  const silhouetteImageFile = formData.get('silhouetteImage') as File

  try {
    const currentConfig = await prisma.siteConfig.findFirst()

    let heroImageUrl = currentConfig?.heroImageUrl
    let silhouetteImageUrl = currentConfig?.silhouetteImageUrl

    if (heroImageFile && heroImageFile.size > 0) {
      const { url } = await uploadImage(heroImageFile)
      heroImageUrl = url
    }

    if (silhouetteImageFile && silhouetteImageFile.size > 0) {
      const { url } = await uploadImage(silhouetteImageFile)
      silhouetteImageUrl = url
    }

    // Build update data - only include fields that were provided
    const updateData: Record<string, string | undefined | null> = {}

    if (ownerName !== null) updateData.ownerName = ownerName as string
    if (brandName !== null) updateData.brandName = brandName as string
    if (heroTitle1 !== null) updateData.heroTitle1 = heroTitle1 as string
    if (heroTitle2 !== null) updateData.heroTitle2 = heroTitle2 as string
    if (bgColor) updateData.bgColor = bgColor
    if (primaryColor) updateData.primaryColor = primaryColor
    if (accentColor) updateData.accentColor = accentColor
    if (aboutText) updateData.aboutText = aboutText
    if (copyrightText !== null) updateData.copyrightText = copyrightText as string
    if (heroImageUrl) updateData.heroImageUrl = heroImageUrl
    if (silhouetteImageUrl) updateData.silhouetteImageUrl = silhouetteImageUrl
    if (contactEmail) updateData.contactEmail = contactEmail
    if (contactPhone) updateData.contactPhone = contactPhone
    if (contactLocation) updateData.contactLocation = contactLocation
    if (socialInstagram) updateData.socialInstagram = socialInstagram
    if (socialTiktok) updateData.socialTiktok = socialTiktok
    if (socialWhatsapp) updateData.socialWhatsapp = socialWhatsapp
    if (socialYoutube) updateData.socialYoutube = socialYoutube
    if (socialLinkedin) updateData.socialLinkedin = socialLinkedin
    if (socialFacebook) updateData.socialFacebook = socialFacebook

    if (currentConfig) {
      await prisma.siteConfig.update({
        where: { id: currentConfig.id },
        data: updateData,
      })

      // Sincronizar colores con ThemeSettings
      const themeUpdates = []
      if (bgColor) themeUpdates.push({ key: 'color_background', value: bgColor })
      if (primaryColor) themeUpdates.push({ key: 'color_primary', value: primaryColor })
      if (accentColor) themeUpdates.push({ key: 'color_accent', value: accentColor })

      if (themeUpdates.length > 0) {
        await updateMultipleThemeSettings(themeUpdates)
      }
    } else {
      await prisma.siteConfig.create({
        data: {
          ownerName: ownerName || 'Paola Bolívar Nievas',
          brandName: brandName || 'PBN',
          heroTitle1: heroTitle1 || 'Make-up',
          heroTitle2: heroTitle2 || 'Portfolio',
          bgColor: bgColor || '#fff1f9',
          primaryColor: primaryColor || '#6c0a0a',
          accentColor: accentColor || '#ffaadd',
          aboutText,
          copyrightText,
          heroImageUrl,
          silhouetteImageUrl,
          contactEmail,
          contactPhone,
          contactLocation,
          socialInstagram,
          socialTiktok,
          socialWhatsapp,
          socialYoutube,
          socialLinkedin,
          socialFacebook,
        },
      })
    }

    revalidatePath('/')
    revalidatePath('/sobre-mi')
    revalidatePath('/contacto')
    revalidatePath('/admin/sobre-mi')
    revalidatePath('/admin/mis-datos')
    logger.info('Site config updated successfully')
    return { success: true }
  } catch (error) {
    logger.error('Error updating site config:', { error })
    return { success: false, error: 'Error al actualizar la configuración' }
  }
}
