'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SocialLinkData, upsertSocialLink, deleteSocialLink } from '@/actions/settings/social'
import { Button, Input, useConfirmDialog } from '@/components/ui'
import { Plus, Trash2, Save } from 'lucide-react'
import { showToast } from '@/lib/toast'

interface SocialLinkRowProps {
  link?: SocialLinkData
  isNew?: boolean
}

export function SocialLinkRow({ link, isNew }: SocialLinkRowProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    platform: link?.platform || '',
    url: link?.url || '',
    username: link?.username || '',
    isActive: link?.isActive ?? true,
    sortOrder: link?.sortOrder || 0,
  })

  const { confirm, Dialog } = useConfirmDialog()

  const handleSave = async () => {
    if (!data.platform || !data.url) {
      showToast.error('Plataforma y URL requeridos')
      return
    }
    setLoading(true)
    try {
      const result = await upsertSocialLink({ ...data, icon: null, id: link?.id })
      if (result.success) {
        showToast.success(isNew ? 'Link creado' : 'Link actualizado')
        if (isNew) setData({ platform: '', url: '', username: '', isActive: true, sortOrder: 0 })
        router.refresh()
      } else {
        showToast.error(result.error || 'Error desconocido')
      }
    } catch {
      showToast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!link?.id) return
    const isConfirmed = await confirm({
      title: '¿Eliminar red social?',
      message: 'Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      variant: 'danger',
    })
    if (isConfirmed) {
      setLoading(true)
      await deleteSocialLink(link.id)
      router.refresh()
      setLoading(false)
    }
  }

  return (
    <>
      <div
        className={`grid grid-cols-12 items-center gap-2 rounded border p-3 ${
          isNew ? 'border-border bg-muted/50 border-dashed' : 'border-border'
        }`}
      >
        <div className="col-span-2">
          {isNew ? (
            <Input
              placeholder="Plataforma (ej: instagram)"
              value={data.platform}
              onChange={(e) => setData({ ...data, platform: e.target.value.toLowerCase() })}
              className="h-9 text-xs"
            />
          ) : (
            <span className="ml-2 text-sm font-medium capitalize">{data.platform}</span>
          )}
        </div>
        <div className="col-span-4">
          <Input
            placeholder="URL Completa"
            value={data.url}
            onChange={(e) => setData({ ...data, url: e.target.value })}
            className="h-9 text-xs"
          />
        </div>
        <div className="col-span-3">
          <Input
            placeholder="@usuario"
            value={data.username || ''}
            onChange={(e) => setData({ ...data, username: e.target.value })}
            className="h-9 text-xs"
          />
        </div>
        <div className="col-span-3 flex justify-end gap-2">
          <Button
            size="sm"
            variant={isNew ? 'primary' : 'ghost'}
            onClick={handleSave}
            disabled={loading}
          >
            {isNew ? <Plus size={16} /> : <Save size={16} className="text-primary" />}
          </Button>
          {!isNew && (
            <Button size="sm" variant="ghost" onClick={handleDelete} disabled={loading}>
              <Trash2 size={16} className="text-destructive" />
            </Button>
          )}
        </div>
      </div>
      <Dialog />
    </>
  )
}
