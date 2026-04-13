'use client'

import { useRouter } from 'next/navigation'
import { Button, useConfirmDialog } from '@/components/ui'
import { deleteTestimonial } from '@/actions/cms/testimonials'
import { showToast } from '@/lib/toast'

interface TestimonialDeleteButtonProps {
  testimonialId: string
  testimonialName: string
}

export default function TestimonialDeleteButton({
  testimonialId,
  testimonialName,
}: TestimonialDeleteButtonProps) {
  const router = useRouter()
  const { confirm, Dialog } = useConfirmDialog()

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: '¿Eliminar testimonio?',
      message: 'Esta acción lo quitará del panel y no se puede deshacer.',
      confirmText: 'Eliminar',
      variant: 'danger',
    })

    if (!isConfirmed) return

    const result = await deleteTestimonial(testimonialId)
    if (!result.success) {
      showToast.error(result.error || 'No se pudo eliminar el testimonio')
      return
    }

    showToast.success(`Testimonio de ${testimonialName} eliminado`)
    router.refresh()
  }

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="px-3"
        aria-label={`Eliminar testimonio de ${testimonialName}`}
        onClick={handleDelete}
      >
        🗑️
      </Button>
      <Dialog />
    </>
  )
}
