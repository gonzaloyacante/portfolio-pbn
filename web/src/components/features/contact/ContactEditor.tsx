'use client'

import { ContactSettingsData, updateContactSettings } from '@/actions/settings/contact'
import { SocialLinkData } from '@/actions/settings/social'
import { useRouter } from 'next/navigation'
import { Button, Input, Switch, ImageUpload } from '@/components/ui'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSettingsSchema, type ContactSettingsFormData } from '@/lib/validations'
import { Save } from 'lucide-react'
import { showToast } from '@/lib/toast'
import { SocialLinkRow } from './SocialLinkRow'

interface ContactEditorProps {
  settings: ContactSettingsData | null
  socialLinks: SocialLinkData[]
}

export function ContactEditor({ settings, socialLinks }: ContactEditorProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactSettingsFormData>({
    resolver: zodResolver(contactSettingsSchema),
    defaultValues: {
      pageTitle: settings?.pageTitle || 'Contacto',
      illustrationUrl: settings?.illustrationUrl || undefined,
      illustrationAlt: settings?.illustrationAlt || 'Ilustración contacto',
      ownerName: settings?.ownerName || 'Paola Bolívar Nievas',
      email: settings?.email || '',
      phone: settings?.phone || '',
      whatsapp: settings?.whatsapp || '',
      instagram: settings?.instagram || '',
      instagramUsername: settings?.instagramUsername || '',
      location: settings?.location || '',
      showSocialLinks: true,
      showPhone: settings?.showPhone ?? true,
      showWhatsapp: settings?.showWhatsapp ?? true,
      showEmail: settings?.showEmail ?? true,
      showLocation: settings?.showLocation ?? true,
      showInstagram: settings?.showInstagram ?? true,
      instagramPostUrl: settings?.instagramPostUrl || '',
      showInstagramEmbed: settings?.showInstagramEmbed ?? false,
    },
  })

  const toggleFieldValues = useWatch({
    control,
    name: [
      'showEmail',
      'showPhone',
      'showWhatsapp',
      'showLocation',
      'showInstagram',
      'showInstagramEmbed',
    ],
  })

  const toggleValueMap: Record<string, boolean> = {
    showEmail: toggleFieldValues[0] ?? true,
    showPhone: toggleFieldValues[1] ?? true,
    showWhatsapp: toggleFieldValues[2] ?? true,
    showLocation: toggleFieldValues[3] ?? true,
    showInstagram: toggleFieldValues[4] ?? true,
    showInstagramEmbed: toggleFieldValues[5] ?? false,
  }

  const onSettingsSubmit = async (data: ContactSettingsFormData) => {
    try {
      const result = await updateContactSettings({
        ...data,
        showSocialLinks: true,
      })
      if (result.success) {
        showToast.success('Configuración guardada')
        router.refresh()
      } else {
        showToast.error(result.error || 'Error al guardar')
      }
    } catch {
      showToast.error('Error inesperado')
    }
  }

  return (
    <div className="space-y-12">
      <form
        onSubmit={handleSubmit(onSettingsSubmit)}
        className="border-border bg-card space-y-8 rounded-lg border p-6 shadow-sm"
      >
        <div>
          <h2 className="font-heading text-lg font-semibold">Datos de contacto</h2>
          <p className="text-muted-foreground text-sm">
            Lo que ves aquí es lo que puede aparecer en la página pública según los interruptores de
            visibilidad.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-4">
            <Input
              label="Título de Página"
              {...register('pageTitle')}
              error={errors.pageTitle?.message}
            />
            <Input
              label="Nombre Visible"
              {...register('ownerName')}
              error={errors.ownerName?.message}
            />
            <Input label="Email Público" {...register('email')} error={errors.email?.message} />
            <Input label="Teléfono Público" {...register('phone')} error={errors.phone?.message} />
            <Input
              label="WhatsApp (Link)"
              {...register('whatsapp')}
              error={errors.whatsapp?.message}
            />
            <Input
              label="Instagram (URL del perfil)"
              {...register('instagram')}
              error={errors.instagram?.message}
              placeholder="https://www.instagram.com/tu_usuario/"
            />
            <Input
              label="Instagram (usuario visible)"
              {...register('instagramUsername')}
              error={errors.instagramUsername?.message}
              placeholder="@tu_usuario"
            />
            <Input label="Ubicación" {...register('location')} error={errors.location?.message} />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">Ilustración</label>
            <ImageUpload
              name="illustrationUrl"
              currentImage={settings?.illustrationUrl}
              onChange={(urls: string[]) => setValue('illustrationUrl', urls[0])}
            />
            <Input label="Alt Text Ilustración" {...register('illustrationAlt')} />
          </div>
        </div>

        <div className="border-border space-y-4 border-t pt-6">
          <h3 className="text-sm font-semibold">Post de Instagram en la página</h3>
          <p className="text-muted-foreground text-xs">
            URL de un post concreto (embed nativo). Opcional.
          </p>
          <Input
            label="URL del post de Instagram"
            {...register('instagramPostUrl')}
            error={errors.instagramPostUrl?.message}
            placeholder="https://www.instagram.com/p/..."
          />
          <label className="flex items-center gap-3">
            <Switch
              checked={toggleValueMap['showInstagramEmbed'] ?? false}
              onCheckedChange={(v) => setValue('showInstagramEmbed', v, { shouldDirty: true })}
            />
            <span className="text-sm">Mostrar embed de Instagram</span>
          </label>
        </div>

        <div className="border-border border-t pt-6">
          <h3 className="mb-2 text-sm font-semibold">Visibilidad en la web pública</h3>
          <p className="text-muted-foreground mb-4 text-xs">
            Las redes sociales (tarjetas de enlaces) se controlan una a una en la sección de abajo.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { field: 'showEmail' as const, label: 'Mostrar email' },
              { field: 'showPhone' as const, label: 'Mostrar teléfono' },
              { field: 'showWhatsapp' as const, label: 'Mostrar WhatsApp' },
              { field: 'showLocation' as const, label: 'Mostrar ubicación' },
              {
                field: 'showInstagram' as const,
                label: 'Mostrar bloque Instagram (datos de arriba)',
              },
            ].map(({ field, label }) => (
              <label key={field} className="flex items-center gap-3">
                <Switch
                  checked={toggleValueMap[field] ?? true}
                  onCheckedChange={(v) => setValue(field, v, { shouldDirty: true })}
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t pt-4">
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            <Save className="mr-2 h-4 w-4" /> Guardar contacto
          </Button>
        </div>
      </form>

      <section className="border-border bg-card space-y-6 rounded-lg border p-6 shadow-sm">
        <div>
          <h2 className="font-heading text-lg font-semibold">Redes sociales</h2>
          <p className="text-muted-foreground text-sm">
            Activa o desactiva cada red con el interruptor de la fila. Solo las activas se muestran
            en la web.
          </p>
        </div>

        <div className="space-y-4">
          {socialLinks.map((link) => (
            <SocialLinkRow key={link.id} link={link} />
          ))}
          <SocialLinkRow isNew />
        </div>
      </section>
    </div>
  )
}
