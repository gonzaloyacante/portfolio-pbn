import { redirect } from 'next/navigation'
import { ROUTES } from '@/config/routes'

/**
 * Legacy route — el cambio de contraseña vive ahora en `/admin/mi-cuenta`.
 * Redirigimos para no romper bookmarks.
 */
export default function ProfileLegacyPage() {
  redirect(ROUTES.admin.account)
}
