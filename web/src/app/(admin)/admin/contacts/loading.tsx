import { SkeletonContactsPage } from '@/components/ui'

export default function ContactsLoading() {
  return (
    <div className="page-transition">
      <SkeletonContactsPage />
    </div>
  )
}
