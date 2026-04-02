import { Button } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { NewCategoryForm } from './NewCategoryForm'

export const metadata = {
  title: 'Nueva Categoría | Admin',
  description: 'Crear una nueva categoría del portfolio',
}

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href={ROUTES.admin.categories}>
            <ArrowLeft size={16} />
            Volver
          </Link>
        </Button>
        <PageHeader
          title="📁 Nueva Categoría"
          description="Crea una nueva categoría con su galería de imágenes"
        />
      </div>

      <NewCategoryForm />
    </div>
  )
}
