import { getContactSettings } from '@/actions/theme.actions'
import ContactSettingsForm from '@/components/admin/ContactSettingsForm'
import { Suspense } from 'react'

export const metadata = {
  title: 'Configuración de Contacto | Admin',
  description: 'Gestiona la información de contacto y configuración del formulario',
}

export default async function ContactSettingsPage() {
  const settings = await getContactSettings()

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configuración de Contacto
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Personaliza la información que ven tus clientes en la página de contacto.
        </p>
      </div>

      <Suspense fallback={<div>Cargando configuración...</div>}>
        <ContactSettingsForm initialSettings={settings} />
      </Suspense>
    </div>
  )
}
