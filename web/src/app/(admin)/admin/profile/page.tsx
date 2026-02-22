import { PageHeader } from '@/components/layout'

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader title="Mi Cuenta" description="Gestiona tu perfil de administrador" />
      <div className="border-border bg-card rounded-lg border p-6 shadow-sm">
        <p>Funcionalidad de cambio de contraseña próximamente.</p>
      </div>
    </div>
  )
}
