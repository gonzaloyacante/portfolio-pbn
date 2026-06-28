import { getThemeSettings } from '@/actions/settings/theme'
import { getPublicColorOverrides } from '@/actions/settings/public-colors'
import { ThemeEditor } from '@/components/features/theme/ThemeEditor'
import { PageHeader } from '@/components/layout'
import { Suspense } from 'react'

export const metadata = {
  title: 'Editor de Tema | Admin',
  description: 'Personaliza el diseño de tu portfolio',
}

export default async function TemaPage() {
  const [settings, colorOverrides] = await Promise.all([
    getThemeSettings(),
    getPublicColorOverrides(),
  ])

  return (
    <div className="space-y-8">
      <PageHeader
        title="🎨 Editor de Tema"
        description="Personaliza el diseño y la tipografía de tu portfolio"
      />
      <Suspense
        fallback={
          <div
            role="status"
            aria-live="polite"
            aria-label="Cargando configuración de tema"
            className="space-y-6"
          >
            <div className="bg-muted h-10 w-64 animate-pulse rounded-lg" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-card border-border space-y-4 rounded-2xl border p-6 shadow-sm">
                <div className="bg-muted h-6 w-40 animate-pulse rounded" />
                <div className="bg-muted h-32 animate-pulse rounded-lg" />
                <div className="bg-muted h-10 animate-pulse rounded" />
              </div>
              <div className="bg-card border-border space-y-4 rounded-2xl border p-6 shadow-sm">
                <div className="bg-muted h-6 w-40 animate-pulse rounded" />
                <div className="bg-muted h-32 animate-pulse rounded-lg" />
                <div className="bg-muted h-10 animate-pulse rounded" />
              </div>
            </div>
          </div>
        }
      >
        <ThemeEditor initialData={settings} initialColorOverrides={colorOverrides} />
      </Suspense>
    </div>
  )
}
