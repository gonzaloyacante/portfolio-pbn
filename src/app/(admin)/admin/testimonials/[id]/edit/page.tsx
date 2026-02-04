import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import TestimonialEditForm from '@/components/features/testimonials/TestimonialEditForm'
import { Section } from '@/components/layout'

interface EditTestimonialPageProps {
  params: {
    id: string
  }
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const { id } = await params

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  })

  if (!testimonial) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Section title={`Editar Testimonio: ${testimonial.name}`}>
        <TestimonialEditForm testimonial={testimonial} />
      </Section>
    </div>
  )
}
