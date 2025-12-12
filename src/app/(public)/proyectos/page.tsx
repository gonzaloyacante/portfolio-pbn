import { prisma } from '@/lib/db'
import ProjectCard from '@/components/public/ProjectCard'

export default async function ProjectsPage() {
  // Get all active projects with their categories
  let projects = []
  let errorLoading = false
  try {
    projects = await prisma.project.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    })
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    errorLoading = true
  }

  if (errorLoading) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Error al cargar los proyectos</h2>
        <p className="mt-4 text-gray-600">
          Hubo un problema al conectar con la base de datos. Por favor, inténtalo de nuevo más
          tarde.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Title with Script Font */}
      <h1 className="font-script text-wine dark:text-pink-hot text-center text-5xl md:text-6xl">
        Mis Proyectos
      </h1>

      {/* Projects Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            slug={project.slug}
            thumbnailUrl={project.thumbnailUrl}
            categoryName={project.category.name}
          />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-script text-wine/60 dark:text-pink-hot/60 text-4xl">Próximamente...</p>
          <p className="text-wine/50 dark:text-pink-light/50 mt-4">
            Estamos preparando proyectos increíbles para ti
          </p>
        </div>
      )}
    </div>
  )
}
