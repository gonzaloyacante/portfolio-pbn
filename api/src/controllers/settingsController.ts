import { Request, Response } from 'express';
import prisma from '../config/database';
import { updateSettingsSchema } from '../utils/validation';
import { AppError } from '../middleware/errorHandler';

// GET /api/settings - Public
export const getSettings = async (_req: Request, res: Response) => {
  const settings = await prisma.portfolioSettings.findUnique({
    where: { id: 'singleton' },
  });

  if (!settings) {
    throw new AppError('Configuración no encontrada', 404);
  }

  res.json(settings);
};

// PUT /api/admin/settings - Admin only
export const updateSettings = async (req: Request, res: Response) => {
  const data = updateSettingsSchema.parse(req.body);

  const settings = await prisma.portfolioSettings.update({
    where: { id: 'singleton' },
    data,
  });

  res.json(settings);
};
