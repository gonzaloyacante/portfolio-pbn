import { getSiteConfig, updateSiteConfig } from '@/actions/settings.actions'
import { Button, PageHeader } from '@/components/ui'
import { Section, FormField } from '@/components/admin'

export default async function MisDatosPage() {
  const config = await getSiteConfig()

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="📞 Datos de Contacto"
        description="Información de contacto que aparecerá en tu sitio público"
      />

      <Section title="Información de Contacto">
        <form
          action={async (formData) => {
            'use server'
            await updateSiteConfig(formData)
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              label="Email de contacto"
              name="contactEmail"
              type="email"
              placeholder="tu@email.com"
              defaultValue={config?.contactEmail || ''}
            />
            <FormField
              label="Teléfono"
              name="contactPhone"
              type="text"
              placeholder="+34 600 000 000"
              defaultValue={config?.contactPhone || ''}
            />
          </div>

          <FormField
            label="Ubicación"
            name="contactLocation"
            type="text"
            placeholder="Madrid, España"
            defaultValue={config?.contactLocation || ''}
          />

          <div className="flex justify-end">
            <Button type="submit">Guardar Información</Button>
          </div>
        </form>
      </Section>

      <Section title="Redes Sociales">
        <form
          action={async (formData) => {
            'use server'
            await updateSiteConfig(formData)
          }}
          className="space-y-4"
        >
          <FormField
            label="Instagram"
            name="socialInstagram"
            type="text"
            placeholder="@tuusuario"
            defaultValue={config?.socialInstagram || ''}
          />
          <FormField
            label="TikTok"
            name="socialTiktok"
            type="text"
            placeholder="@tuusuario"
            defaultValue={config?.socialTiktok || ''}
          />
          <FormField
            label="WhatsApp"
            name="socialWhatsapp"
            type="text"
            placeholder="+34600000000"
            defaultValue={config?.socialWhatsapp || ''}
          />
          <div className="flex justify-end">
            <Button type="submit">Guardar Redes Sociales</Button>
          </div>
        </form>
      </Section>

      <div className="border-pink-hot bg-pink-light/20 dark:bg-pink-hot/10 rounded-2xl border-l-4 p-6">
        <p className="text-wine dark:text-pink-light flex items-center gap-2 text-sm">
          <span className="text-xl">💡</span>
          <span>
            <strong>Tip:</strong> Esta información aparecerá en el pie de página y en la sección de
            contacto de tu sitio público.
          </span>
        </p>
      </div>
    </div>
  )
}
