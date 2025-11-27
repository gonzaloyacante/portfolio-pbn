'use server'

import { prisma } from '@/lib/db'
import { uploadImage } from '@/lib/cloudinary'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'

export async function getSiteConfig() {
  try {
    const config = await prisma.siteConfig.findFirst()
    return config
  } catch (error) {
    logger.error('Error fetching site config:', error)
    return null
  }
}

export async function updateSiteConfig(formData: FormData) {
  const bgColor = formData.get('bgColor') as string
  const primaryColor = formData.get('primaryColor') as string
  const accentColor = formData.get('accentColor') as string
  const aboutText = formData.get('aboutText') as string

  const heroImageFile = formData.get('heroImage') as File

  try {
    const currentConfig = await prisma.siteConfig.findFirst()

    let heroImageUrl = currentConfig?.heroImageUrl

    if (heroImageFile && heroImageFile.size > 0) {
      // Upload new image
      const { url } = await uploadImage(heroImageFile)
      heroImageUrl = url
    }

    if (currentConfig) {
      await prisma.siteConfig.update({
        where: { id: currentConfig.id },
        data: {
          bgColor,
          primaryColor,
          accentColor,
          aboutText,
          heroImageUrl,
        },
      })
    } else {
      await prisma.siteConfig.create({
        data: {
          bgColor: bgColor || '#fff1f9',
          primaryColor: primaryColor || '#6c0a0a',
          accentColor: accentColor || '#ffaadd',
          aboutText,
          heroImageUrl,
        },
      })
    }

    revalidatePath('/')
    revalidatePath('/sobre-mi')
    logger.info('Site config updated successfully')
    return { success: true }
  } catch (error) {
    logger.error('Error updating site config:', error)
    return { success: false, error: 'Error al actualizar la configuración' }
  }
}
