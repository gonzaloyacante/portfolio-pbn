import { getSiteConfig, updateSiteConfig } from '@/actions/settings.actions'
import { Button, Card } from '@/components/ui'
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium">Color de Fondo</label>
              <input
                type="color"
                name="bgColor"
                defaultValue={config?.bgColor || '#fff1f9'}
                className="mt-1 h-10 w-full cursor-pointer rounded border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Color Primario</label>
              <input
                type="color"
                name="primaryColor"
                defaultValue={config?.primaryColor || '#6c0a0a'}
                className="mt-1 h-10 w-full cursor-pointer rounded border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Color de Acento</label>
              <input
                type="color"
                name="accentColor"
                defaultValue={config?.accentColor || '#7a2556'}
                className="mt-1 h-10 w-full cursor-pointer rounded border"
              />
            </div>
          </div>
          <Button type="submit">Guardar Colores</Button>
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
          <Button type="submit">Guardar Contenido</Button>
        </form>
      </Section>

      <Card className="bg-yellow-50 dark:bg-yellow-900/20">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          💡 <strong>Tip:</strong> Para configuraciones avanzadas del tema (tipografías, espaciados,
          efectos), usa la sección{' '}
          <a href="/admin/tema" className="underline">
            Tema
          </a>
          .
        </p>
      </Card>
    </div>
  )
}
