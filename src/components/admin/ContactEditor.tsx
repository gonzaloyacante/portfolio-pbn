'use client'

import {
    ContactSettingsData,
    SocialLinkData,
    updateContactSettings,
    upsertSocialLink,
    deleteSocialLink,
} from '@/actions/theme.actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSettingsSchema, type ContactSettingsFormData } from '@/lib/validations'
import { useToast } from '@/components/ui/Toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Plus, Trash2, Save, GripVertical } from 'lucide-react'
import { ImageUpload } from '@/components/admin'

interface ContactEditorProps {
    settings: ContactSettingsData | null
    socialLinks: SocialLinkData[]
}

export function ContactEditor({ settings, socialLinks }: ContactEditorProps) {
    const router = useRouter()
    const { show } = useToast()

    // Contact Settings Form
    const {
        register,
        handleSubmit,
        setValue,
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
            formTitle: settings?.formTitle || 'Envíame un mensaje',
            nameLabel: settings?.nameLabel || 'Tu nombre',
            emailLabel: settings?.emailLabel || 'Tu email',
            phoneLabel: settings?.phoneLabel || 'Tu teléfono (opcional)',
            messageLabel: settings?.messageLabel || 'Mensaje',
            preferenceLabel: settings?.preferenceLabel || '¿Cómo preferís que te contacte?',
            submitLabel: settings?.submitLabel || 'Enviar mensaje',
            successTitle: settings?.successTitle || '¡Mensaje enviado!',
            successMessage: settings?.successMessage || 'Gracias por contactarme.',
            sendAnotherLabel: settings?.sendAnotherLabel || 'Enviar otro mensaje',
            showSocialLinks: settings?.showSocialLinks ?? true,
        },
    })

    // Social Links State (Simple local management before save? No, immediate actions)
    const [isDeletingGoogle, setIsDeletingLink] = useState<string | null>(null)

    const onSettingsSubmit = async (data: ContactSettingsFormData) => {
        try {
            const result = await updateContactSettings(data)
            if (result.success) {
                show({ type: 'success', message: 'Configuración guardada' })
                router.refresh()
            } else {
                show({ type: 'error', message: result.error || 'Error al guardar' })
            }
        } catch {
            show({ type: 'error', message: 'Error inesperado' })
        }
    }

    const handleDeleteLink = async (id: string) => {
        if (!confirm('¿Eliminar este enlace?')) return
        setIsDeletingLink(id)
        try {
            const result = await deleteSocialLink(id)
            if (result.success) {
                show({ type: 'success', message: 'Enlace eliminado' })
                router.refresh()
            } else {
                show({ type: 'error', message: result.error || 'Error desconocido' })
            }
        } finally {
            setIsDeletingLink(null)
        }
    }

    return (
        <div className="space-y-8">
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-6 w-full md:w-auto">
                    <TabsTrigger value="general">📞 Info General</TabsTrigger>
                    <TabsTrigger value="form">📝 Formulario Labels</TabsTrigger>
                    <TabsTrigger value="social">🔗 Redes Sociales</TabsTrigger>
                </TabsList>

                {/* GENERAL TAB */}
                <TabsContent value="general">
                    <form onSubmit={handleSubmit(onSettingsSubmit)} className="space-y-6 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className="text-lg font-semibold">Información de Contacto</h2>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <Input label="Título de Página" {...register('pageTitle')} error={errors.pageTitle?.message} />
                                <Input label="Nombre Visible" {...register('ownerName')} error={errors.ownerName?.message} />
                                <Input label="Email Público" {...register('email')} error={errors.email?.message} />
                                <Input label="Teléfono Público" {...register('phone')} error={errors.phone?.message} />
                                <Input label="WhatsApp (Link)" {...register('whatsapp')} error={errors.whatsapp?.message} />
                                <Input label="Ubicación" {...register('location')} error={errors.location?.message} />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium">Ilustración</label>
                                <ImageUpload
                                    name="illustrationUrl"
                                    currentImage={settings?.illustrationUrl}
                                    onChange={(urls) => setValue('illustrationUrl', urls[0])}
                                />
                                <Input label="Alt Text Ilustración" {...register('illustrationAlt')} />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
                                <Save className="mr-2 h-4 w-4" /> Guardar Info
                            </Button>
                        </div>
                    </form>
                </TabsContent>

                {/* FORM LABELS TAB */}
                <TabsContent value="form">
                    <form onSubmit={handleSubmit(onSettingsSubmit)} className="space-y-6 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className="text-lg font-semibold">Textos del Formulario</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <Input label="Título del Formulario" {...register('formTitle')} error={errors.formTitle?.message} />
                            <Input label="Label Nombre" {...register('nameLabel')} />
                            <Input label="Label Email" {...register('emailLabel')} />
                            <Input label="Label Teléfono" {...register('phoneLabel')} />
                            <Input label="Label Mensaje" {...register('messageLabel')} />
                            <Input label="Label Preferencia" {...register('preferenceLabel')} />
                            <Input label="Texto Botón Enviar" {...register('submitLabel')} />
                            <div className="col-span-2 border-t pt-4">
                                <h3 className="mb-4 font-medium">Mensajes de Éxito</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Input label="Título Éxito" {...register('successTitle')} />
                                    <Input label="Mensaje Éxito" {...register('successMessage')} />
                                    <Input label="Botón Enviar Otro" {...register('sendAnotherLabel')} />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
                                <Save className="mr-2 h-4 w-4" /> Guardar Textos
                            </Button>
                        </div>
                    </form>
                </TabsContent>

                {/* SOCIAL LINKS TAB */}
                <TabsContent value="social">
                    <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Redes Sociales</h2>
                            {/* Add new link form is separate or modal - for simplicity, just a list here */}
                            <span className="text-xs text-gray-500">Edita directamente abajo</span>
                        </div>

                        <div className="space-y-4">
                            {socialLinks.map((link) => (
                                <SocialLinkRow key={link.id} link={link} />
                            ))}

                            {/* Empty Row for New Link */}
                            <SocialLinkRow isNew />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function SocialLinkRow({ link, isNew }: { link?: SocialLinkData; isNew?: boolean }) {
    const router = useRouter()
    const { show } = useToast()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        platform: link?.platform || '',
        url: link?.url || '',
        username: link?.username || '',
        isActive: link?.isActive ?? true,
        sortOrder: link?.sortOrder || 0
    })

    // Simple save handler per row
    const handleSave = async () => {
        if (!data.platform || !data.url) return show({ type: 'error', message: 'Plataforma y URL requeridos' })

        setLoading(true)
        try {
            const result = await upsertSocialLink({ ...data, icon: null, id: link?.id })
            if (result.success) {
                show({ type: 'success', message: isNew ? 'Link creado' : 'Link actualizado' })
                if (isNew) setData({ platform: '', url: '', username: '', isActive: true, sortOrder: 0 })
                router.refresh()
            } else {
                show({ type: 'error', message: result.error || 'Error desconocido' })
            }
        } catch {
            show({ type: 'error', message: 'Error de conexión' })
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!link?.id || !confirm('¿Borrar?')) return
        setLoading(true)
        await deleteSocialLink(link.id)
        router.refresh()
        setLoading(false)
    }

    return (
        <div className={`grid grid-cols-12 gap-2 items-center p-3 rounded border ${isNew ? 'border-dashed border-gray-300 bg-gray-50' : 'border-gray-100'}`}>
            <div className="col-span-2">
                {isNew ? (
                    <Input placeholder="Plataforma (ej: instagram)" value={data.platform} onChange={e => setData({ ...data, platform: e.target.value.toLowerCase() })} className="h-9 text-xs" />
                ) : (
                    <span className="capitalize font-medium text-sm ml-2">{data.platform}</span>
                )}
            </div>
            <div className="col-span-4">
                <Input placeholder="URL Completa" value={data.url} onChange={e => setData({ ...data, url: e.target.value })} className="h-9 text-xs" />
            </div>
            <div className="col-span-3">
                <Input placeholder="@usuario" value={data.username || ''} onChange={e => setData({ ...data, username: e.target.value })} className="h-9 text-xs" />
            </div>
            <div className="col-span-3 flex justify-end gap-2">
                <Button size="sm" variant={isNew ? 'primary' : 'ghost'} onClick={handleSave} disabled={loading}>
                    {isNew ? <Plus size={16} /> : <Save size={16} className="text-blue-600" />}
                </Button>
                {!isNew && (
                    <Button size="sm" variant="ghost" onClick={handleDelete} disabled={loading}>
                        <Trash2 size={16} className="text-red-500" />
                    </Button>
                )}
            </div>
        </div>
    )
}
