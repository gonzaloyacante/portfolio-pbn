import { PageHeader } from '@/components/ui'

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Mi Cuenta"
        description="Gestiona tu perfil de administrador"
      />
      <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <p>Funcionalidad de cambio de contraseña próximamente.</p>
      </div>
    </div>
  )
}
