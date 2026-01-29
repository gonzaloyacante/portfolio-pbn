import { prisma } from '@/lib/db'
import { createService, deleteService, toggleService } from '@/actions/services.actions'
import { Button, Card, Badge } from '@/components/ui'
import { FormField, Section } from '@/components/admin'

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <h1 className="text-wine dark:text-pink-light text-3xl font-bold">Gestión de Servicios</h1>

      {/* Formulario de Creación */}
      <Section title="Crear Nuevo Servicio">
        <form
          action={async (formData) => {
            'use server'
            await createService(formData)
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Nombre del Servicio" name="name" required />
            <FormField label="Slug (URL)" name="slug" placeholder="maquillaje-novia" required />
          </div>
          <FormField
            label="Descripción"
            name="description"
            type="textarea"
            placeholder="Descripción detallada del servicio..."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField label="Precio (€)" name="price" type="number" placeholder="150" />
            <FormField
              label="Tipo de Precio"
              name="priceLabel"
              type="select"
              defaultValue="desde"
              options={[
                { value: 'desde', label: 'Desde' },
                { value: 'fijo', label: 'Precio fijo' },
                { value: 'consultar', label: 'A consultar' },
              ]}
            />
            <FormField label="Duración" name="duration" placeholder="2-3 horas" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="URL de Imagen" name="imageUrl" placeholder="https://..." />
            <FormField label="Icono (Lucide)" name="iconName" placeholder="sparkles" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isActive" value="true" defaultChecked />
              <span className="text-wine dark:text-pink-light text-sm">Activo</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isFeatured" value="true" />
              <span className="text-wine dark:text-pink-light text-sm">Destacado</span>
            </label>
          </div>
          <input type="hidden" name="sortOrder" value="0" />
          <div className="flex justify-end">
            <Button type="submit">Crear Servicio</Button>
          </div>
        </form>
      </Section>

      {/* Lista de Servicios */}
      <Card>
        {services.length === 0 ? (
          <div className="text-wine/60 dark:text-pink-light/60 flex flex-col items-center justify-center py-12 text-center">
            <span className="mb-4 text-4xl">💅</span>
            <p className="font-medium">No hay servicios aún</p>
            <p className="text-sm">Crea tu primer servicio arriba</p>
          </div>
        ) : (
          <div className="divide-wine/5 dark:divide-pink-light/5 divide-y">
            {services.map((s) => (
              <div
                key={s.id}
                className="flex flex-col gap-4 py-6 md:flex-row md:items-start md:justify-between"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-wine dark:text-pink-light font-bold">{s.name}</span>
                    <Badge variant={s.isActive ? 'success' : 'default'}>
                      {s.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                    {s.isFeatured && <Badge variant="warning">⭐ Destacado</Badge>}
                  </div>
                  <p className="text-wine/60 dark:text-pink-light/60 text-sm">/{s.slug}</p>
                  {s.description && (
                    <p className="text-wine/80 dark:text-pink-light/80 line-clamp-2 text-sm">
                      {s.description}
                    </p>
                  )}
                  <div className="text-wine/60 dark:text-pink-light/60 flex flex-wrap items-center gap-4 text-sm">
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
                  <form
                    action={async () => {
                      'use server'
                      await toggleService(s.id)
                    }}
                  >
                    <Button type="submit" variant={s.isActive ? 'secondary' : 'primary'} size="sm">
                      {s.isActive ? '🔒 Ocultar' : '✅ Activar'}
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      'use server'
                      await deleteService(s.id)
                    }}
                  >
                    <Button type="submit" variant="destructive" size="sm" className="px-3">
                      🗑️
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
