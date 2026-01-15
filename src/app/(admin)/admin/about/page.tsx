import { getSiteConfig, updateSiteConfig } from '@/actions/settings.actions'
import { Button, PageHeader } from '@/components/ui'
import { FormField, Section, ImageUpload } from '@/components/admin'

export default async function SobreMiPage() {
  const config = await getSiteConfig()

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="👤 Sobre Mí"
        description="Edita la información que aparece en tu página de presentación"
      />

      {/* Imagen principal de inicio */}
      <Section title="Imagen de Inicio (Hero)">
        <form
          action={async (formData) => {
            'use server'
            await updateSiteConfig(formData)
          }}
          className="space-y-4"
        >
          <p className="text-wine/70 dark:text-pink-light/70 mb-4 text-sm">
            Esta imagen aparece en la página principal junto al texto &quot;Make-up Portfolio&quot;.
          </p>
          <ImageUpload
            name="heroImage"
            label="Arrastra o selecciona tu foto principal"
            currentImage={config?.heroImageUrl}
          />
          <div className="flex justify-end">
            <Button type="submit">Guardar Imagen Hero</Button>
          </div>
        </form>
      </Section>

      {/* Imagen de silueta/icono */}
      <Section title="Imagen Decorativa (Silueta)">
        <form
          action={async (formData) => {
            'use server'
            await updateSiteConfig(formData)
          }}
          className="space-y-4"
        >
          <p className="text-wine/70 dark:text-pink-light/70 mb-4 text-sm">
            Esta imagen aparece entre el título &quot;Portfolio&quot; y tu nombre. Puede ser una
            silueta, un icono o cualquier imagen decorativa. Si no subes ninguna, se mostrará el
            emoji 💄.
          </p>
          <ImageUpload
            name="silhouetteImage"
            label="Arrastra o selecciona tu imagen decorativa"
            currentImage={config?.silhouetteImageUrl}
          />
          <div className="flex justify-end">
            <Button type="submit">Guardar Silueta</Button>
          </div>
        </form>
      </Section>

      {/* Texto de presentación */}
      <Section title="Tu Presentación">
        <form
          action={async (formData) => {
            'use server'
            await updateSiteConfig(formData)
          }}
          className="space-y-4"
        >
          <p className="text-wine/70 dark:text-pink-light/70 mb-4 text-sm">
            Este texto aparece en la sección &quot;Sobre mí&quot; de tu sitio público.
          </p>
          <FormField
            label="Texto de presentación"
            name="aboutText"
            type="textarea"
            rows={10}
            placeholder="Cuéntale a tus visitantes sobre ti, tu experiencia, tus servicios..."
            defaultValue={config?.aboutText || ''}
          />
          <div className="flex justify-end">
            <Button type="submit">Guardar Presentación</Button>
          </div>
        </form>
      </Section>

      <div className="rounded-2xl border-l-4 border-blue-400 bg-blue-50 p-6 dark:bg-blue-900/10">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Tip:</strong> Haz tu presentación personal y cercana para conectar con tus
          clientes. Menciona tu experiencia, especialidades y lo que te hace única.
        </p>
      </div>
    </div>
  )
}
