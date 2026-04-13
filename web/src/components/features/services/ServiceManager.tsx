'use client'

import { useState } from 'react'
import { Service, ServicePricingTier } from '@/generated/prisma/client'
import { Button, Card, Badge, Modal, useConfirmDialog } from '@/components/ui'
import { toggleService, deleteService } from '@/actions/cms/services'
import ServiceForm from './ServiceForm'
import { Edit, Trash2, Plus, Search } from 'lucide-react'
import { showToast } from '@/lib/toast'
import React from 'react'

type ServiceWithTiers = Service & { pricingTiers?: ServicePricingTier[] }

interface ServiceManagerProps {
  initialServices: ServiceWithTiers[]
}

export default function ServiceManager({ initialServices }: ServiceManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceWithTiers | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredServices = initialServices.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  )

  // Confirmation Dialog
  const { confirm, Dialog } = useConfirmDialog()

  const handleCreate = () => {
    setEditingService(null)
    setIsModalOpen(true)
  }

  const handleEdit = (service: ServiceWithTiers) => {
    setEditingService(service)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingService(null)
  }

  const handleDeleteService = async (id: string) => {
    const isConfirmed = await confirm({
      title: '¿Eliminar servicio?',
      message: 'Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      variant: 'danger',
    })

    if (isConfirmed) {
      await deleteService(id)
      showToast.success('Servicio eliminado')
    }
  }

  // Optimistic UI updates could be handled here, but for now we rely on Server Actions + revalidatePath
  // The page will reload content automatically on action success due to revalidatePath in action.

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            size={16}
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            type="search"
            placeholder="Buscar servicios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring w-full rounded-xl border py-2 pr-4 pl-9 text-sm focus:outline-none"
          />
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={18} />
          Nuevo Servicio
        </Button>
      </div>

      <Card>
        {filteredServices.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
            <span className="mb-4 text-4xl">💅</span>
            <p className="font-medium">
              {searchQuery
                ? 'No hay servicios que coincidan con la búsqueda'
                : 'No hay servicios aún'}
            </p>
            {!searchQuery && <p className="text-sm">Crea tu primer servicio arriba</p>}
          </div>
        ) : (
          <div className="divide-border divide-y">
            {filteredServices.map((s) => (
              <div
                key={s.id}
                className="group flex flex-col gap-4 py-6 md:flex-row md:items-start md:justify-between"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-foreground flex items-center gap-2 font-bold">
                      {s.name}
                    </span>
                    <Badge variant={s.isActive ? 'success' : 'default'}>
                      {s.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                    {s.isFeatured && <Badge variant="warning">⭐ Destacado</Badge>}
                  </div>
                  {s.description && (
                    <p className="text-muted-foreground line-clamp-2 text-sm">{s.description}</p>
                  )}
                  <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                    {s.price && (
                      <span>
                        💰 {s.priceLabel === 'desde' ? 'Desde ' : ''}
                        {Number(s.price).toFixed(0)}€
                      </span>
                    )}
                    {s.duration && <span>⏱️ {s.duration}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-start">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(s)}
                    className="gap-2"
                  >
                    <Edit size={14} />
                    Editar
                  </Button>

                  <form
                    action={async () => {
                      await toggleService(s.id)
                      showToast.success('Estado actualizado')
                    }}
                  >
                    <Button type="submit" variant={s.isActive ? 'secondary' : 'ghost'} size="sm">
                      {s.isActive ? 'Ocultar' : 'Activar'}
                    </Button>
                  </form>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="px-3"
                    onClick={() => handleDeleteService(s.id)}
                    aria-label={`Eliminar servicio ${s.name}`}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingService ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
        size="lg"
      >
        <ServiceForm service={editingService} onSuccess={handleClose} onCancel={handleClose} />
      </Modal>
      <Dialog />
    </div>
  )
}
