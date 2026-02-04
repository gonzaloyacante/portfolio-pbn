'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/config/routes'

export interface SocialLinkData {
  id: string
  platform: string
  url: string
  username: string | null
  icon: string | null
  isActive: boolean
  sortOrder: number
}

/**
 * Get all active social links
 */
export async function getSocialLinks(): Promise<SocialLinkData[]> {
  try {
    const links = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
    return links
  } catch (error) {
    console.error('Error getting social links:', error)
    return []
  }
}

/**
 * Update or create a social link
 */
export async function upsertSocialLink(data: Omit<SocialLinkData, 'id'> & { id?: string }) {
  try {
    const link = await prisma.socialLink.upsert({
      where: { platform: data.platform },
      update: data,
      create: data,
    })

    revalidatePath(ROUTES.home, 'layout')

    return {
      success: true,
      link,
      message: 'Enlace social actualizado',
    }
  } catch (error) {
    console.error('Error upserting social link:', error)
    return {
      success: false,
      error: 'Error al actualizar enlace social',
    }
  }
}

/**
 * Delete a social link
 */
export async function deleteSocialLink(id: string) {
  try {
    await prisma.socialLink.delete({ where: { id } })
    revalidatePath(ROUTES.home, 'layout')
    return { success: true, message: 'Enlace social eliminado' }
  } catch (error) {
    console.error('Error deleting social link:', error)
    return { success: false, error: 'Error al eliminar enlace social' }
  }
}
