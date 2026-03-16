import { SkeletonProjectsPage } from '@/components/ui'

export default function ProjectsLoading() {
  return (
    <div className="page-transition">
      <SkeletonProjectsPage />
    </div>
  )
}
