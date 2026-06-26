import { PageHeader } from '@/components/layout'
import { ROUTES } from '@/config/routes'
import { NewCategoryForm } from './NewCategoryForm'

export const metadata = {
  title: 'Nueva Categoría | Admin',
  description: 'Crear una nueva categoría del portfolio',
}

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="📁 Nueva Categoría"
        description="Crea una nueva categoría con su galería de imágenes"
        backUrl={ROUTES.admin.categories}
      />

      <NewCategoryForm />
    </div>
  )
}
