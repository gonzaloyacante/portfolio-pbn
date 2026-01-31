import { PageHeader } from '@/components/ui'

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader title="Mi Cuenta" description="Gestiona tu perfil de administrador" />
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <p>Funcionalidad de cambio de contraseña próximamente.</p>
      </div>
    </div>
  )
}
