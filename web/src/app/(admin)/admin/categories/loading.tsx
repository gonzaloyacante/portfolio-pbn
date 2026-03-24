import { SkeletonCategoriesPage } from '@/components/ui'

export default function CategoriesLoading() {
  return (
    <div className="page-transition">
      <SkeletonCategoriesPage />
    </div>
  )
}
