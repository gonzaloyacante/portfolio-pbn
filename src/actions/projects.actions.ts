/**
 * Server Actions optimizadas para proyectos
 * Con paginación y queries eficientes
 */

'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/config/routes'

/**
 * Obtener proyectos con paginación
 */
export async function getPaginatedProjects(page: number = 1, limit: number = 12) {
  const skip = (page - 1) * limit

  try {
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: {
          isActive: true,
          isDeleted: false,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          date: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
        take: limit,
        skip,
      }),
      prisma.project.count({
        where: {
          isActive: true,
          isDeleted: false,
        },
      }),
    ])

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + projects.length < total,
      },
    }
  } catch (error) {
    console.error('Error al obtener proyectos paginados:', error)
    return {
      projects: [],
      pagination: {
        page: 1,
        limit,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    }
  }
}

/**
 * Obtener proyectos por categoría con paginación
 */
export async function getProjectsByCategory(
  categorySlug: string,
  page: number = 1,
  limit: number = 12
) {
  const skip = (page - 1) * limit

  try {
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: {
          isActive: true,
          isDeleted: false,
          category: {
            slug: categorySlug,
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          date: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
        take: limit,
        skip,
      }),
      prisma.project.count({
        where: {
          isActive: true,
          isDeleted: false,
          category: {
            slug: categorySlug,
          },
        },
      }),
    ])

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + projects.length < total,
      },
    }
  } catch (error) {
    console.error('Error al obtener proyectos por categoría:', error)
    return {
      projects: [],
      pagination: {
        page: 1,
        limit,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    }
  }
}

/**
 * Obtener proyecto individual (optimizado)
 */
export async function getProjectBySlug(slug: string) {
  try {
    return await prisma.project.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnailUrl: true,
        date: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        updatedAt: true,
      },
    })
  } catch (error) {
    console.error('Error al obtener proyecto:', error)
    return null
  }
}

/**
 * Obtener proyectos relacionados (misma categoría, excluir actual)
 */
export async function getRelatedProjects(projectId: string, categoryId: string, limit: number = 3) {
  try {
    return await prisma.project.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        categoryId,
        id: {
          not: projectId,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnailUrl: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
    })
  } catch (error) {
    console.error('Error al obtener proyectos relacionados:', error)
    return []
  }
}

/**
 * Revalidar paths de proyectos
 */
export async function revalidateProjects() {
  revalidatePath(ROUTES.public.projects)
  revalidatePath(ROUTES.home, 'layout')
}

/**
 * Restaurar proyecto eliminado
 */
export async function restoreProject(id: string) {
  try {
    await prisma.project.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null },
    })
    revalidatePath(ROUTES.admin.trash)
    revalidatePath(ROUTES.admin.projects)
    return { success: true }
  } catch (error) {
    console.error('Error restaurando proyecto:', error)
    return { success: false, error: 'Error al restaurar proyecto' }
  }
}

/**
 * Eliminar proyecto permanentemente
 */
export async function permanentlyDeleteProject(id: string) {
  try {
    // Las imágenes se eliminan automáticamente con onDelete: Cascade
    await prisma.project.delete({ where: { id } })
    revalidatePath(ROUTES.admin.trash)
    return { success: true }
  } catch (error) {
    console.error('Error eliminando proyecto permanentemente:', error)
    return { success: false, error: 'Error al eliminar proyecto' }
  }
}
