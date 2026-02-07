import ServiceForm from '@/components/features/services/ServiceForm'
import { PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Crear Servicio | Admin',
  description: 'Añade un nuevo servicio a tu portafolio',
}

export default function NewServicePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <PageHeader
        title="✨ Crear Servicio"
        description="Define un nuevo servicio que ofreces a tus clientes."
        backUrl="/admin/services"
      />

      <div className="max-w-2xl">
        <ServiceForm />
      </div>
    </div>
  )
}
