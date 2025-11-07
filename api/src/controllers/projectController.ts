import { Request, Response } from 'express';
import prisma from '../config/database';
import {
  createProjectSchema,
  updateProjectSchema,
  paginationSchema,
  uuidSchema,
} from '../utils/validation';
import { AppError } from '../middleware/errorHandler';

// GET /api/projects - Public (only published)
export const getProjects = async (req: Request, res: Response) => {
  const { limit, offset } = paginationSchema.parse(req.query);
  const categorySlug = req.query['category'] as string | undefined;
  const featured = req.query['featured'] === 'true' ? true : undefined;

  const where: any = { status: 'PUBLISHED' };
  
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  
  if (featured !== undefined) {
    where.featured = featured;
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
      skip: offset,
      take: limit,
    }),
    prisma.project.count({ where }),
  ]);

  res.json({
    data: projects,
    total,
    limit,
    offset,
  });
};

// GET /api/projects/:slug - Public
export const getProjectBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  const project = await prisma.project.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      category: true,
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!project) {
    throw new AppError('Proyecto no encontrado', 404);
  }

  res.json(project);
};

// GET /api/projects/category/:categorySlug - Public
export const getProjectsByCategory = async (req: Request, res: Response) => {
  const { categorySlug } = req.params;
  const { limit, offset } = paginationSchema.parse(req.query);

  const category = await prisma.projectCategory.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    throw new AppError('Categoría no encontrada', 404);
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: {
        categoryId: category.id,
        status: 'PUBLISHED',
      },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      skip: offset,
      take: limit,
    }),
    prisma.project.count({
      where: {
        categoryId: category.id,
        status: 'PUBLISHED',
      },
    }),
  ]);

  res.json({
    data: projects,
    total,
    category,
  });
};

// GET /api/admin/projects - Admin only (all projects)
export const getAllProjects = async (req: Request, res: Response) => {
  const { limit, offset } = paginationSchema.parse(req.query);

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      skip: offset,
      take: limit,
    }),
    prisma.project.count(),
  ]);

  res.json({
    data: projects,
    total,
    limit,
    offset,
  });
};

// POST /api/admin/projects - Admin only
export const createProject = async (req: Request, res: Response) => {
  const data = createProjectSchema.parse(req.body);

  const project = await prisma.project.create({
    data,
    include: {
      category: true,
      images: true,
    },
  });

  res.status(201).json(project);
};

// PUT /api/admin/projects/:id - Admin only
export const updateProject = async (req: Request, res: Response) => {
  const id = uuidSchema.parse(req.params['id']);
  const data = updateProjectSchema.parse(req.body);

  const project = await prisma.project.update({
    where: { id },
    data,
    include: {
      category: true,
      images: true,
    },
  });

  res.json(project);
};

// DELETE /api/admin/projects/:id - Admin only
export const deleteProject = async (req: Request, res: Response) => {
  const id = uuidSchema.parse(req.params['id']);

  await prisma.project.delete({ where: { id } });

  res.json({ message: 'Proyecto eliminado exitosamente' });
};

// POST /api/admin/projects/:id/images - Admin only
export const addProjectImage = async (req: Request, res: Response) => {
  const projectId = uuidSchema.parse(req.params['id']);
  const { url, alt, order = 0 } = req.body;

  const image = await prisma.projectImage.create({
    data: {
      url,
      alt,
      order,
      projectId,
    },
  });

  res.status(201).json(image);
};

// DELETE /api/admin/projects/:projectId/images/:imageId - Admin only
export const deleteProjectImage = async (req: Request, res: Response) => {
  const imageId = uuidSchema.parse(req.params['imageId']);

  await prisma.projectImage.delete({ where: { id: imageId } });

  res.json({ message: 'Imagen eliminada exitosamente' });
};

