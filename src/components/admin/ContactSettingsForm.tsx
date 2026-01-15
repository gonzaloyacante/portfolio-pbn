'use client'

import { useRouter } from 'next/navigation'
import { ContactSettingsData, updateContactSettings } from '@/actions/theme.actions'
import { Button, Input, Switch } from '@/components/ui'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSettingsSchema, type ContactSettingsFormData } from '@/lib/validations'
import { useToast } from '@/components/ui/Toast'

interface ContactSettingsFormProps {
  initialSettings: ContactSettingsData | null
}

export default function ContactSettingsForm({ initialSettings }: ContactSettingsFormProps) {
  const router = useRouter()
  const { show } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactSettingsFormData>({
    resolver: zodResolver(contactSettingsSchema),
    defaultValues: {
      emails: initialSettings?.emails || [],
      phones: initialSettings?.phones || [],
      addressLine1: initialSettings?.addressLine1 || '',
      addressLine2: initialSettings?.addressLine2 || '',
      city: initialSettings?.city || '',
      country: initialSettings?.country || '',
      hoursTitle: initialSettings?.hoursTitle || 'Horario de Atención',
      hoursWeekdays: initialSettings?.hoursWeekdays || '',
      hoursSaturday: initialSettings?.hoursSaturday || '',
      hoursSunday: initialSettings?.hoursSunday || '',
      formTitle: initialSettings?.formTitle || 'Envíame un mensaje',
      formSuccessMessage:
        initialSettings?.formSuccessMessage || '¡Gracias! Tu mensaje ha sido enviado.',
      isActive: initialSettings?.isActive ?? true,
    },
  })

  const emails = watch('emails') || []
  const phones = watch('phones') || []
  const isActive = watch('isActive')

  const onSubmit = async (data: ContactSettingsFormData) => {
    try {
      // Ensure types match expected action input.
      // Zod inferred type matches the shape required by updateContactSettings (excluding ID)
      const result = await updateContactSettings(data)

      if (result.success) {
        show({ type: 'success', message: 'Configuración actualizada correctamente' })
        router.refresh()
      } else {
        show({ type: 'error', message: result.error || 'Error al guardar' })
      }
    } catch (error) {
      console.error('Error saving contact settings:', error)
      show({ type: 'error', message: 'Error inesperado al guardar' })
    }
  }

  const handleArrayChange = (key: 'emails' | 'phones', value: string) => {
    const array = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
    setValue(key, array, { shouldValidate: true })
    // Note: Zod validation for emails array will trigger on submit or manually
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Editar Información de Contacto
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Esta información se mostrará en la página de contacto pública.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Visible</span>
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
          </div>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Información General */}
        <section className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">📍 Dirección y Ubicación</h3>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Dirección (Línea 1)
              </label>
              <Input {...register('addressLine1')} placeholder="Ej: Av. Principal 123" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Dirección (Línea 2)
              </label>
              <Input {...register('addressLine2')} placeholder="Ej: Oficina 4B" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ciudad
                </label>
                <Input {...register('city')} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  País
                </label>
                <Input {...register('country')} />
              </div>
            </div>
          </div>
        </section>

        {/* Medios de Contacto */}
        <section className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">📞 Medios de Contacto</h3>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Emails (separados por coma)
              </label>
              <Input
                defaultValue={emails.join(', ')}
                onChange={(e) => handleArrayChange('emails', e.target.value)}
                placeholder="info@ejemplo.com, ventas@ejemplo.com"
              />
              {errors.emails && (
                <p className="mt-1 text-xs text-red-500">Formato de email inválido en la lista</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Estos emails se mostrarán públicamente.</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Teléfonos (separados por coma)
              </label>
              <Input
                defaultValue={phones.join(', ')}
                onChange={(e) => handleArrayChange('phones', e.target.value)}
                placeholder="+54 9 11 1234-5678"
              />
            </div>
          </div>
        </section>

        {/* Horarios */}
        <section className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">⏰ Horarios</h3>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Título de la sección
              </label>
              <Input {...register('hoursTitle')} placeholder="Horario de Atención" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Lunes a Viernes
              </label>
              <Input {...register('hoursWeekdays')} placeholder="9:00 - 18:00" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sábados
                </label>
                <Input {...register('hoursSaturday')} placeholder="10:00 - 14:00" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Domingos
                </label>
                <Input {...register('hoursSunday')} placeholder="Cerrado" />
              </div>
            </div>
          </div>
        </section>

        {/* Configuración del Formulario */}
        <section className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">📝 Formulario Público</h3>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Título del Formulario
              </label>
              <Input {...register('formTitle')} placeholder="Envíame un mensaje" />
              {errors.formTitle && (
                <p className="mt-1 text-xs text-red-500">{errors.formTitle.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mensaje de Éxito
              </label>
              <Input
                {...register('formSuccessMessage')}
                placeholder="¡Gracias! Tu mensaje ha sido enviado."
              />
              {errors.formSuccessMessage && (
                <p className="mt-1 text-xs text-red-500">{errors.formSuccessMessage.message}</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </form>
  )
}
