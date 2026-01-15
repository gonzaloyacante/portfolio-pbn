import Link from 'next/link'
import { getSiteConfig, updateSiteConfig } from '@/actions/settings.actions'
import { Button } from '@/components/ui'
import { FormField, Section } from '@/components/admin'

export default async function AdminConfig() {
  const config = await getSiteConfig()

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold">Configuración del Sitio</h1>

      <Section title="Colores del Tema">
        <form
          action={async (formData) => {
            'use server'
            await updateSiteConfig(formData)
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="text-wine dark:text-pink-light mb-2 block text-sm font-bold">
                Color de Fondo
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="bgColor"
                  defaultValue={config?.bgColor || '#fff1f9'}
                  className="border-wine/20 dark:bg-purple-dark/50 h-12 w-16 cursor-pointer rounded-lg border-2 bg-white p-1"
                  title="Elegir color"
                />
                <span className="text-wine/50 dark:text-pink-light/50 font-mono text-sm">
                  {config?.bgColor}
                </span>
              </div>
            </div>
            <div>
              <label className="text-wine dark:text-pink-light mb-2 block text-sm font-bold">
                Color Primario
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="primaryColor"
                  defaultValue={config?.primaryColor || '#6c0a0a'}
                  className="border-wine/20 dark:bg-purple-dark/50 h-12 w-16 cursor-pointer rounded-lg border-2 bg-white p-1"
                  title="Elegir color"
                />
                <span className="text-wine/50 dark:text-pink-light/50 font-mono text-sm">
                  {config?.primaryColor}
                </span>
              </div>
            </div>
            <div>
              <label className="text-wine dark:text-pink-light mb-2 block text-sm font-bold">
                Color de Acento
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="accentColor"
                  defaultValue={config?.accentColor || '#7a2556'}
                  className="border-wine/20 dark:bg-purple-dark/50 h-12 w-16 cursor-pointer rounded-lg border-2 bg-white p-1"
                  title="Elegir color"
                />
                <span className="text-wine/50 dark:text-pink-light/50 font-mono text-sm">
                  {config?.accentColor}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Guardar Colores</Button>
          </div>
        </form>
      </Section>

      <Section title="Contenido Principal">
        <form
          action={async (formData) => {
            'use server'
            await updateSiteConfig(formData)
          }}
          className="space-y-4"
        >
          <FormField
            label="URL de Imagen Hero"
            name="heroImageUrl"
            type="text"
            placeholder="https://..."
            defaultValue={config?.heroImageUrl || ''}
          />
          <FormField
            label="Texto 'Sobre Mí'"
            name="aboutText"
            type="textarea"
            rows={6}
            defaultValue={config?.aboutText || ''}
          />
          <div className="flex justify-end">
            <Button type="submit">Guardar Contenido</Button>
          </div>
        </form>
      </Section>

      <div className="rounded-2xl border-l-4 border-blue-400 bg-blue-50 p-6 dark:bg-blue-900/10">
        <p className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
          <span className="text-xl">💡</span>
          <span>
            <strong>Tip:</strong> Para configuraciones avanzadas del tema (tipografías, espaciados,
            efectos), usa la sección{' '}
            <Link
              href="/admin/tema"
              className="font-bold underline hover:text-blue-600 dark:hover:text-blue-300"
            >
              Tema
            </Link>
            .
          </span>
        </p>
      </div>
    </div>
  )
}
