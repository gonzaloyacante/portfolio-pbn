import { getProjectSettings } from '@/actions/project-settings.actions'
import ProjectSettingsEditor from '@/components/admin/projects/ProjectSettingsEditor'

export const metadata = {
  title: 'Configuración de Proyectos | Admin',
}

export default async function ProjectSettingsPage() {
  const settings = await getProjectSettings()

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configuración de Proyectos
        </h1>
        <p className="mt-2 text-gray-500">
          Personaliza cómo se muestran tus proyectos en la página pública.
        </p>
      </div>

      <ProjectSettingsEditor initialSettings={settings} />
    </div>
  )
}
