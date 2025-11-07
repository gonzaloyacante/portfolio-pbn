import { Request, Response } from 'express';
import prisma from '../config/database';
import {
  createCategorySchema,
  updateCategorySchema,
  uuidSchema,
} from '../utils/validation';
import { AppError } from '../middleware/errorHandler';

// GET /api/categories - Public
export const getCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.projectCategory.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: {
          projects: {
            where: { status: 'PUBLISHED' },
          },
        },
      },
    },
  });

  res.json({ data: categories });
};

// GET /api/categories/:slug - Public
export const getCategoryBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  const category = await prisma.projectCategory.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          projects: {
            where: { status: 'PUBLISHED' },
          },
        },
      },
    },
  });

  if (!category) {
    throw new AppError('Categoría no encontrada', 404);
  }

  res.json(category);
};

// POST /api/admin/categories - Admin only
export const createCategory = async (req: Request, res: Response) => {
  const data = createCategorySchema.parse(req.body);

  const category = await prisma.projectCategory.create({
    data,
  });

  res.status(201).json(category);
};

// PUT /api/admin/categories/:id - Admin only
export const updateCategory = async (req: Request, res: Response) => {
  const id = uuidSchema.parse(req.params.id);
  const data = updateCategorySchema.parse(req.body);

  const category = await prisma.projectCategory.update({
    where: { id },
    data,
  });

  res.json(category);
};

// DELETE /api/admin/categories/:id - Admin only
export const deleteCategory = async (req: Request, res: Response) => {
  const id = uuidSchema.parse(req.params.id);

  // Check if category has projects
  const projectCount = await prisma.project.count({
    where: { categoryId: id },
  });

  if (projectCount > 0) {
    throw new AppError(
      'No se puede eliminar una categoría que tiene proyectos asociados',
      400
    );
  }

  await prisma.projectCategory.delete({ where: { id } });

  res.json({ message: 'Categoría eliminada exitosamente' });
};
