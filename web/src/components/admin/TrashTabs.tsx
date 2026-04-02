'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button, Tabs, TabsList, TabsTrigger, TabsContent, EmptyState } from '@/components/ui'
import { showToast } from '@/lib/toast'

interface BaseTrashItem {
  id: string
  deletedAt?: Date | string | null
}

interface TrashCategory extends BaseTrashItem {
  name: string
  description?: string | null
  coverImageUrl?: string | null
}

interface TrashService extends BaseTrashItem {
  name: string
  description?: string | null
  imageUrl?: string | null
}

interface TrashTestimonial extends BaseTrashItem {
  name: string
  text: string
  avatarUrl?: string | null
}

interface TrashTabsProps {
  categories: TrashCategory[]
  services: TrashService[]
  testimonials: TrashTestimonial[]
}

export function TrashTabs({ categories, services, testimonials }: TrashTabsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState('categories')

  const handleRestore = async (type: string, id: string) => {
    try {
      const res = await fetch(`/api/admin/trash/${type}/${id}`, {
        method: 'PATCH',
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Error al restaurar')

      showToast.success('Elemento restaurado con éxito')
      startTransition(() => {
        router.refresh()
      })
    } catch (err: unknown) {
      showToast.error(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  const handlePurge = async (type: string, id: string) => {
    if (
      !confirm('¿Estás seguro de eliminar esto permanentemente? Esta acción no se puede deshacer.')
    )
      return

    try {
      const res = await fetch(`/api/admin/trash/${type}/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Error al eliminar')

      showToast.success('Elemento eliminado permanentemente')
      startTransition(() => {
        router.refresh()
      })
    } catch (err: unknown) {
      showToast.error(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  const renderItem = (
    type: string,
    item: BaseTrashItem,
    image: string | null | undefined,
    title: string,
    subtitle: string
  ) => {
    const now = new Date()
    const deletedAt = item.deletedAt ? new Date(item.deletedAt) : now
    const daysElapsed = Math.floor((now.getTime() - deletedAt.getTime()) / (1000 * 60 * 60 * 24))
    const daysRemaining = Math.max(0, 30 - daysElapsed)

    return (
      <div
        key={item.id}
        className="border-border bg-card hover:bg-muted/50 flex flex-col items-start gap-4 rounded-xl border p-6 transition-colors md:flex-row"
      >
        {/* Thumbnail */}
        {image && (
          <div className="bg-muted relative h-28 w-full shrink-0 overflow-hidden rounded-lg md:w-32">
            <Image src={image} alt={title} fill className="object-cover" />
          </div>
        )}

        {/* Info */}
        <div className="w-full flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-foreground truncate text-lg font-semibold">
                {title || 'Sin Título'}
              </h3>
              <p className="text-muted-foreground mt-1 line-clamp-3 text-sm">{subtitle || '—'}</p>
            </div>

            <div className="hidden flex-col items-end gap-2 md:flex">
              <p className="text-xs text-red-600 dark:text-red-400">
                ⏰ Faltan {daysRemaining} días
              </p>
              <p className="text-muted-foreground text-xs">{deletedAt.toLocaleDateString()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2 md:gap-3">
            <Button
              type="button"
              onClick={() => handleRestore(type, item.id)}
              disabled={isPending}
              variant="secondary"
              size="sm"
            >
              ♻️ Restaurar
            </Button>
            <Button
              type="button"
              onClick={() => handlePurge(type, item.id)}
              disabled={isPending}
              variant="destructive"
              size="sm"
            >
              🗑️ Purga
            </Button>
            <div className="mt-2 ml-auto text-xs text-red-600 md:hidden dark:text-red-400">
              ⏰ {daysRemaining} días
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderList = <T extends BaseTrashItem>(
    items: T[],
    renderFn: (item: T) => React.ReactNode,
    emptyMsg: string
  ) => {
    if (items.length === 0) {
      return <EmptyState icon="🗑️" title="Papelera vacía" description={emptyMsg} />
    }
    return <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">{items.map(renderFn)}</div>
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6 flex h-auto flex-wrap justify-start gap-2">
        <TabsTrigger value="categories">Categorías ({categories.length})</TabsTrigger>
        <TabsTrigger value="services">Servicios ({services.length})</TabsTrigger>
        <TabsTrigger value="testimonials">Testimonios ({testimonials.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="categories" className="mt-0">
        {renderList(
          categories,
          (c) => renderItem('category', c, c.coverImageUrl, c.name, c.description || ''),
          'No hay categorías en la papelera'
        )}
      </TabsContent>

      <TabsContent value="services" className="mt-0">
        {renderList(
          services,
          (s) => renderItem('service', s, s.imageUrl, s.name, s.description || ''),
          'No hay servicios en la papelera'
        )}
      </TabsContent>

      <TabsContent value="testimonials" className="mt-0">
        {renderList(
          testimonials,
          (t) => renderItem('testimonial', t, t.avatarUrl, t.name, t.text),
          'No hay testimonios en la papelera'
        )}
      </TabsContent>
    </Tabs>
  )
}
