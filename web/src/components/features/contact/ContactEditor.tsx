'use client'

import { ContactSettingsData, updateContactSettings } from '@/actions/settings/contact'
import { SocialLinkData } from '@/actions/settings/social'
import { useRouter } from 'next/navigation'
import {
  Button,
  Input,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ImageUpload,
} from '@/components/ui'
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

  // Contact Settings Form
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
      location: settings?.location || '',
      showSocialLinks: settings?.showSocialLinks ?? true,
      showPhone: settings?.showPhone ?? true,
      showWhatsapp: settings?.showWhatsapp ?? true,
      showEmail: settings?.showEmail ?? true,
      showLocation: settings?.showLocation ?? true,
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
      'showSocialLinks',
      'showInstagramEmbed',
    ],
  })

  const toggleValueMap: Record<string, boolean> = {
    showEmail: toggleFieldValues[0] ?? true,
    showPhone: toggleFieldValues[1] ?? true,
    showWhatsapp: toggleFieldValues[2] ?? true,
    showLocation: toggleFieldValues[3] ?? true,
    showSocialLinks: toggleFieldValues[4] ?? true,
    showInstagramEmbed: toggleFieldValues[5] ?? false,
  }

  // Social Links State (Simple local management before save? No, immediate actions)

  const onSettingsSubmit = async (data: ContactSettingsFormData) => {
    try {
      const result = await updateContactSettings(data)
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
    <div className="space-y-8">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 w-full md:w-auto">
          <TabsTrigger value="general">📞 Info General</TabsTrigger>
          <TabsTrigger value="social">🔗 Redes Sociales</TabsTrigger>
        </TabsList>

        {/* GENERAL TAB */}
        <TabsContent value="general">
          <form
            onSubmit={handleSubmit(onSettingsSubmit)}
            className="border-border bg-card space-y-6 rounded-lg border p-6 shadow-sm"
          >
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
                <Input
                  label="Teléfono Público"
                  {...register('phone')}
                  error={errors.phone?.message}
                />
                <Input
                  label="WhatsApp (Link)"
                  {...register('whatsapp')}
                  error={errors.whatsapp?.message}
                />
                <Input
                  label="Ubicación"
                  {...register('location')}
                  error={errors.location?.message}
                />
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

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
                <Save className="mr-2 h-4 w-4" /> Guardar Info
              </Button>
            </div>

            {/* VISIBILITY TOGGLES */}
            <div className="border-border border-t pt-6">
              <h3 className="mb-4 text-sm font-semibold">Visibilidad en la web pública</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { field: 'showEmail' as const, label: 'Mostrar email' },
                  { field: 'showPhone' as const, label: 'Mostrar teléfono' },
                  { field: 'showWhatsapp' as const, label: 'Mostrar WhatsApp' },
                  { field: 'showLocation' as const, label: 'Mostrar ubicación' },
                  { field: 'showSocialLinks' as const, label: 'Mostrar redes sociales' },
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
          </form>
        </TabsContent>

        {/* SOCIAL LINKS TAB */}
        <TabsContent value="social">
          <div className="border-border bg-card space-y-6 rounded-lg border p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Redes Sociales</h2>
              {/* Add new link form is separate or modal - for simplicity, just a list here */}
              <span className="text-muted-foreground text-xs">Edita directamente abajo</span>
            </div>

            <div className="space-y-4">
              {socialLinks.map((link) => (
                <SocialLinkRow key={link.id} link={link} />
              ))}

              {/* Empty Row for New Link */}
              <SocialLinkRow isNew />
            </div>

            {/* Instagram Post Embed */}
            <form
              onSubmit={handleSubmit(onSettingsSubmit)}
              className="border-border mt-6 space-y-4 border-t pt-6"
            >
              <h3 className="text-sm font-semibold">Post de Instagram en página de contacto</h3>
              <p className="text-muted-foreground text-xs">
                Copiá la URL de un post específico de Instagram (ej:
                https://www.instagram.com/p/ABC123/). Se mostrará como embed nativo de Instagram.
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
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} loading={isSubmitting} size="sm">
                  <Save className="mr-2 h-4 w-4" /> Guardar
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
