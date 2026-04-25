'use client'

import { useState } from 'react'
import { Button, SmartField as FormField } from '@/components/ui'

interface Tier {
  name: string
  price: string
  description: string
}

interface Props {
  defaultTiers?: Array<{ name: string; price: string; description: string | null }>
}

export default function ServicePricingTiersEditor({ defaultTiers = [] }: Props) {
  const [tiers, setTiers] = useState<Tier[]>(
    defaultTiers.map((t) => ({
      name: t.name,
      price: t.price,
      description: t.description ?? '',
    }))
  )

  function addTier() {
    setTiers((prev) => [...prev, { name: '', price: '', description: '' }])
  }

  function removeTier(index: number) {
    setTiers((prev) => prev.filter((_, i) => i !== index))
  }

  function updateField(index: number, field: keyof Tier, value: string) {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Tarifas / Niveles de Precio</label>
        <Button type="button" variant="outline" size="sm" onClick={addTier}>
          + Añadir tarifa
        </Button>
      </div>

      {tiers.length === 0 && (
        <p className="text-muted-foreground rounded-md border border-(--border) py-4 text-center text-sm">
          Sin tarifas definidas. Pulsa &quot;Añadir tarifa&quot; para crear una.
        </p>
      )}

      {tiers.map((tier, i) => (
        <div key={i} className="space-y-3 rounded-lg border border-(--border) bg-(--card) p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Tarifa {i + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeTier(i)}
              aria-label={`Eliminar tarifa ${i + 1}`}
              className="text-destructive hover:text-destructive h-6 px-2"
            >
              Eliminar
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormField
              label="Nombre"
              name="tierName"
              type="text"
              placeholder="ej: Básico, Premium…"
              value={tier.name}
              onChange={(e) => updateField(i, 'name', (e.target as HTMLInputElement).value)}
              maxLength={150}
            />
            <FormField
              label="Precio"
              name="tierPrice"
              type="number"
              placeholder="0"
              min={0}
              step={0.01}
              value={tier.price}
              onChange={(e) => updateField(i, 'price', (e.target as HTMLInputElement).value)}
            />
          </div>
          <FormField
            label="Descripción (opcional)"
            name="tierDescription"
            type="text"
            placeholder="¿Qué incluye esta tarifa?"
            value={tier.description}
            onChange={(e) => updateField(i, 'description', (e.target as HTMLInputElement).value)}
            maxLength={500}
          />
        </div>
      ))}
    </div>
  )
}
