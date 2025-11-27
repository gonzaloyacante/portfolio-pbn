'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'

export async function createTestimonial(formData: FormData) {
  const name = formData.get('name') as string
  const text = formData.get('text') as string
  const position = formData.get('position') as string
  const rating = parseInt(formData.get('rating') as string) || 5

  try {
    await prisma.testimonial.create({
      data: { name, text, position, rating, isActive: true },
    })

    revalidatePath('/')
    revalidatePath('/sobre-mi')
    logger.info(`Testimonial created: ${name}`)
    return { success: true }
  } catch (error) {
    logger.error('Error creating testimonial:', error)
    return { success: false, error: 'Error al crear el testimonio' }
  }
}

export async function updateTestimonial(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const text = formData.get('text') as string
  const position = formData.get('position') as string
  const rating = parseInt(formData.get('rating') as string)
  const isActive = formData.get('isActive') === 'true'

  try {
    await prisma.testimonial.update({
      where: { id },
      data: { name, text, position, rating, isActive },
    })

    revalidatePath('/')
    revalidatePath('/sobre-mi')
    logger.info(`Testimonial updated: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error updating testimonial:', error)
    return { success: false, error: 'Error al actualizar el testimonio' }
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({ where: { id } })

    revalidatePath('/')
    revalidatePath('/sobre-mi')
    logger.info(`Testimonial deleted: ${id}`)
    return { success: true }
  } catch (error) {
    logger.error('Error deleting testimonial:', error)
    return { success: false, error: 'Error al eliminar el testimonio' }
  }
}
