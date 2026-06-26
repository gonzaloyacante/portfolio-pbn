import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import TestimonialEditForm from '@/components/features/testimonials/TestimonialEditForm'
import { PageHeader } from '@/components/layout'
import { ROUTES } from '@/config/routes'

interface EditTestimonialPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const { id } = await params

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  })

  if (!testimonial) {
    notFound()
  }

  // Serializar para cruzar Server/Client boundary (testimonial tiene Date).
  const safeTestimonial = JSON.parse(JSON.stringify(testimonial))

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={`Editar Testimonio: ${testimonial.name}`}
        backUrl={ROUTES.admin.testimonials}
      />
      <TestimonialEditForm testimonial={safeTestimonial} />
    </div>
  )
}
