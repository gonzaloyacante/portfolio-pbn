import Link from 'next/link'
import { Button } from '@/components/ui'
import { LayoutDashboard } from 'lucide-react'
import { ROUTES } from '@/config/routes'

/**
 * Página 404 para el panel de administración
 * Diferenciada de la página pública para mantener al admin en el panel
 */
export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="animate-bounce text-6xl">🔍</div>

      <div className="space-y-3">
        <h1 className="text-primary text-5xl font-bold">404</h1>
        <h2 className="text-foreground text-xl font-bold">Página no encontrada</h2>
        <p className="text-muted-foreground max-w-md">
          La página que buscas no existe en el panel de administración.
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          asChild
          className="rounded-xl px-6 py-3 font-bold shadow-lg hover:scale-105 active:scale-95"
        >
          <Link href={ROUTES.admin.dashboard}>
            <LayoutDashboard className="h-5 w-5" />
            Ir al Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
