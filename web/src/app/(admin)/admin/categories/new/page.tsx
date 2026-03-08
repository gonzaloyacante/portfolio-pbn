import { Button } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { NewCategoryForm } from './NewCategoryForm'

export const metadata = {
  title: 'Nueva Categoría | Admin',
  description: 'Crear una nueva categoria de proyectos',
}

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <Link href={ROUTES.admin.categories}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft size={16} />
            Volver
          </Button>
        </Link>
        <PageHeader
          title="📁 Nueva Categoría"
          description="Crea una nueva categoría para organizar tus proyectos"
        />
      </div>

      <NewCategoryForm />
    </div>
  )
}
