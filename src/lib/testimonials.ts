import { prisma } from '@/lib/db'

export interface Testimonial {
  id: string
  name: string
  text: string
  position?: string | null
  avatarUrl?: string | null
  rating: number
  createdAt: Date
  isActive: boolean
}

export const revalidate = 3600 // Revalidar cada hora

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return testimonials
}
