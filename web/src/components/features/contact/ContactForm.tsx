'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/lib/validations'
import { sendContactEmail } from '@/actions/user/contact'
import { showToast } from '@/lib/toast'
import {
  Mail,
  Phone,
  MessageCircle,
  Send,
  CheckCircle2,
  Instagram,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, Button, TextArea, Select, Input } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { ContactField } from './ContactField'
import type { PublicContactServiceOption } from './public/contactPageData'

type ResponsePreference = 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'INSTAGRAM'

const PREFERENCES: { id: ResponsePreference; icon: React.ReactNode; label: string }[] = [
  { id: 'INSTAGRAM', icon: <Instagram className="h-5 w-5" />, label: 'Instagram' },
  { id: 'WHATSAPP', icon: <MessageCircle className="h-5 w-5" />, label: 'WhatsApp' },
  { id: 'PHONE', icon: <Phone className="h-5 w-5" />, label: 'Teléfono' },
  { id: 'EMAIL', icon: <Mail className="h-5 w-5" />, label: 'Email' },
]

interface ContactFormProps {
  serviceOptions: PublicContactServiceOption[]
}

const OTHER_SERVICE_VALUE = 'other'

export default function ContactForm({ serviceOptions }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [activeBounds, setActiveBounds] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const searchParams = useSearchParams()
  const serviceDisplayName = searchParams.get('serviceName')
  const serviceSlug = searchParams.get('service')
  const { executeRecaptcha } = useGoogleReCaptcha()
  const selectorRef = useRef<HTMLDivElement | null>(null)
  const buttonRefs = useRef<Record<ResponsePreference, HTMLButtonElement | null>>({
    INSTAGRAM: null,
    WHATSAPP: null,
    PHONE: null,
    EMAIL: null,
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      countryCode: '',
      message: '',
      responsePreference: 'INSTAGRAM',
      instagramUser: '',
      messageType: 'GENERAL',
      serviceId: '',
      customService: '',
      privacy: false,
    },
  })

  useEffect(() => {
    if (serviceDisplayName) {
      setValue(
        'message',
        `Hola, estoy interesado/a en recibir más información sobre el servicio de "${serviceDisplayName}".`
      )
      // Si el usuario llega desde la página de detalle de un servicio
      // (?service=slug&serviceName=Name), preseleccionar el tipo de
      // mensaje como solicitud de servicio y elegir el servicio en el
      // selector (o fallback a 'other' si el slug no está en la lista).
      if (serviceSlug && serviceOptions.length > 0) {
        const match = serviceOptions.find((s) => s.id === serviceSlug)
        if (match) {
          setValue('messageType', 'SERVICE_INQUIRY', { shouldDirty: true })
          setValue('serviceId', match.id, { shouldDirty: true })
        } else {
          setValue('messageType', 'SERVICE_INQUIRY', { shouldDirty: true })
          setValue('serviceId', OTHER_SERVICE_VALUE, { shouldDirty: true })
          setValue('customService', serviceDisplayName, { shouldDirty: true })
        }
      }
    }
  }, [serviceDisplayName, serviceSlug, serviceOptions, setValue])

  const responsePreference = useWatch({ control, name: 'responsePreference' })
  const messageType = useWatch({ control, name: 'messageType' })
  const selectedServiceId = useWatch({ control, name: 'serviceId' })

  const updateActiveBounds = useCallback(() => {
    const container = selectorRef.current
    const activeButton = buttonRefs.current[responsePreference]

    if (!container || !activeButton) {
      return
    }

    const containerRect = container.getBoundingClientRect()
    const buttonRect = activeButton.getBoundingClientRect()

    setActiveBounds({
      x: buttonRect.left - containerRect.left,
      y: buttonRect.top - containerRect.top,
      width: buttonRect.width,
      height: buttonRect.height,
    })
  }, [responsePreference])

  useEffect(() => {
    updateActiveBounds()

    const handleResize = () => updateActiveBounds()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [updateActiveBounds])

  const onSubmit = async (data: ContactFormData) => {
    try {
      const token = executeRecaptcha ? await executeRecaptcha('contact_form') : ''

      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email ?? '')
      formData.append('phone', data.phone || '')
      // countryCode solo aplica cuando el usuario eligió PHONE o WHATSAPP.
      // Si eligió EMAIL o INSTAGRAM, NO se manda (evita guardar datos
      // inútiles en la DB).
      if (
        (data.responsePreference === 'PHONE' || data.responsePreference === 'WHATSAPP') &&
        data.countryCode
      ) {
        formData.append('countryCode', data.countryCode)
      }
      formData.append('message', data.message)
      formData.append('responsePreference', data.responsePreference)
      formData.append('instagramUser', data.instagramUser || '')
      formData.append('privacy', data.privacy ? 'on' : 'off')
      // Tipo de mensaje + servicio (solicitud de servicio).
      // Sin esto, el server action trata el envío como GENERAL
      // y nunca guarda serviceId/customService en la DB.
      formData.append('messageType', data.messageType ?? 'GENERAL')
      if (data.serviceId) formData.append('serviceId', data.serviceId)
      if (data.customService) formData.append('customService', data.customService)
      formData.append('recaptchaToken', token)

      const result = await sendContactEmail(formData)

      if (result.success) {
        setSubmitted(true)
        reset()
      } else {
        showToast.error(result.message || 'Error al enviar mensaje')
      }
    } catch {
      showToast.error('Error inesperado. Intenta de nuevo.')
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-1 py-2 text-center sm:px-0"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="mb-6 flex justify-center"
        >
          <CheckCircle2 size={64} className="public-contact-form-title" />
        </motion.div>
        <h3 className="public-contact-form-title font-heading mb-3 text-2xl font-bold">
          ¡Mensaje enviado!
        </h3>
        <p className="public-contact-form-text mb-6">
          Gracias por contactarme. Te responderé lo antes posible.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            reset()
          }}
          className="public-contact-option rounded-xl px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          Enviar otro mensaje
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="public-contact-form-panel rounded-3xl p-4 shadow-sm sm:p-6"
    >
      <h2 className="public-contact-form-title font-heading mb-6 text-2xl font-bold">
        Envíame un mensaje
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="public-contact-form-label mb-2 block text-sm font-semibold"
          >
            Tu nombre *
          </label>
          <input
            {...register('name')}
            id="name"
            className="public-contact-field w-full rounded-xl px-3 py-3 transition-all sm:px-4"
            placeholder="Tu nombre completo"
            autoComplete="name"
          />
          {errors.name && (
            <p className="public-contact-error mt-1 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Tipo de mensaje: comentario general vs solicitud de servicio */}
        <fieldset>
          <legend className="public-contact-form-label mb-3 block text-sm font-semibold">
            ¿Qué tipo de mensaje quieres enviar? *
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setValue('messageType', 'GENERAL', { shouldDirty: true })
                setValue('serviceId', '', { shouldDirty: true })
                setValue('customService', '', { shouldDirty: true })
              }}
              className={`public-contact-option flex min-h-20 cursor-pointer items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 sm:p-4 ${
                messageType !== 'SERVICE_INQUIRY'
                  ? 'public-contact-option-active public-contact-option-active-text'
                  : ''
              }`}
            >
              <MessageSquare className="h-5 w-5 shrink-0" aria-hidden />
              <div>
                <p className="font-medium">Comentario o consulta</p>
                <p className="text-muted-foreground text-xs">
                  Pregunta general, prensa, colaboración…
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setValue('messageType', 'SERVICE_INQUIRY', { shouldDirty: true })}
              className={`public-contact-option flex min-h-20 cursor-pointer items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 sm:p-4 ${
                messageType === 'SERVICE_INQUIRY'
                  ? 'public-contact-option-active public-contact-option-active-text'
                  : ''
              }`}
            >
              <Sparkles className="h-5 w-5 shrink-0" aria-hidden />
              <div>
                <p className="font-medium">Solicitar un servicio</p>
                <p className="text-muted-foreground text-xs">
                  Te interesa alguno de los que ofrezco
                </p>
              </div>
            </button>
          </div>
          {errors.messageType && (
            <p className="public-contact-error mt-1 text-sm">{errors.messageType.message}</p>
          )}
        </fieldset>

        {/* Cuando es solicitud de servicio: selector de servicio + custom */}
        <AnimatePresence>
          {messageType === 'SERVICE_INQUIRY' && (
            <motion.div
              key="service-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 overflow-hidden"
            >
              <Select
                label="¿Qué servicio te interesa?"
                value={selectedServiceId ?? ''}
                onChange={(v) => setValue('serviceId', v, { shouldValidate: true })}
                options={[
                  ...serviceOptions.map((s) => ({ value: s.id, label: s.name })),
                  { value: OTHER_SERVICE_VALUE, label: 'Otro (no está en la lista)' },
                ]}
                error={errors.serviceId?.message}
                placeholder="Elegí un servicio"
                className="public-contact-field rounded-xl py-3 sm:px-4"
                containerClassName="mb-0"
                required
              />
              {selectedServiceId === OTHER_SERVICE_VALUE && (
                <Input
                  label="¿Qué servicio necesitás?"
                  value=""
                  onChange={(e) =>
                    setValue('customService', e.target.value, { shouldValidate: true })
                  }
                  placeholder="Ej: Maquillaje para carnaval"
                  error={errors.customService?.message}
                  maxLength={200}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Response Preference Selector */}
        <fieldset>
          <legend className="public-contact-form-label mb-3 block text-sm font-semibold">
            ¿Cómo preferís que te contacte? *
          </legend>
          <div
            ref={selectorRef}
            className="relative grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
          >
            {activeBounds ? (
              <motion.div
                aria-hidden="true"
                className="public-contact-option-active-pill pointer-events-none absolute z-30"
                initial={false}
                animate={activeBounds}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            ) : null}
            {PREFERENCES.map(({ id, icon, label }) => (
              <button
                key={id}
                ref={(node) => {
                  buttonRefs.current[id] = node
                }}
                type="button"
                onClick={() => setValue('responsePreference', id, { shouldValidate: false })}
                className={`public-contact-option relative z-10 flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl p-3 transition-all duration-200 sm:p-4 ${
                  responsePreference === id
                    ? 'public-contact-option-active public-contact-option-active-text'
                    : ''
                }`}
              >
                {/*
                  Estado activo anterior, dejado comentado para no aplicarlo:
                  responsePreference === id
                    ? 'public-contact-option public-contact-option-active'
                    : 'public-contact-option'
                */}
                {icon}
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Animated conditional contact field — opacity-only to prevent layout shift */}
          <AnimatePresence mode="wait">
            <motion.div
              key={responsePreference}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-3"
            >
              <ContactField
                preference={responsePreference}
                register={register}
                control={control}
                setValue={setValue}
                errors={errors}
              />
            </motion.div>
          </AnimatePresence>
        </fieldset>

        {/* Message */}
        <div>
          <TextArea
            label="Mensaje *"
            id="message"
            rows={5}
            className="public-contact-field resize-none rounded-xl"
            placeholder="Escribe tu mensaje aquí..."
            autoComplete="off"
            {...register('message')}
          />
          {errors.message && (
            <p className="public-contact-error mt-1 text-sm">{errors.message.message}</p>
          )}
        </div>

        {/* Privacy Checkbox */}
        <label
          htmlFor="privacy"
          className="public-contact-privacy-box flex cursor-pointer items-center gap-3 rounded-xl p-3"
        >
          <input
            {...register('privacy')}
            type="checkbox"
            id="privacy"
            className="h-4 w-4 shrink-0 self-center rounded"
          />
          <span className="text-sm">
            He leído y acepto la{' '}
            <Link
              href={ROUTES.public.privacy}
              target="_blank"
              rel="noopener noreferrer"
              className="public-contact-privacy-link underline hover:no-underline"
              onClick={(event) => event.stopPropagation()}
            >
              Política de Privacidad
            </Link>
            . <span className="public-contact-error">*</span>
          </span>
        </label>
        {errors.privacy && <p className="public-contact-error text-sm">{errors.privacy.message}</p>}

        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          fullWidth
          size="lg"
          className="public-contact-submit rounded-xl"
          leftIcon={<Send size={20} />}
        >
          Enviar mensaje
        </Button>

        <p className="public-contact-form-muted text-center text-xs">* Campos obligatorios</p>
      </form>
    </motion.div>
  )
}
