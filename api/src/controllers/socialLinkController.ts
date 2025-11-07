import { Request, Response } from 'express';
import prisma from '../config/database';
import {
  createSocialLinkSchema,
  updateSocialLinkSchema,
  uuidSchema,
} from '../utils/validation';

// GET /api/social-links - Public
export const getSocialLinks = async (_req: Request, res: Response) => {
  const socialLinks = await prisma.socialLink.findMany({
    orderBy: { order: 'asc' },
  });

  res.json({ data: socialLinks });
};

// POST /api/admin/social-links - Admin only
export const createSocialLink = async (req: Request, res: Response) => {
  const data = createSocialLinkSchema.parse(req.body);

  const socialLink = await prisma.socialLink.create({
    data,
  });

  res.status(201).json(socialLink);
};

// PUT /api/admin/social-links/:id - Admin only
export const updateSocialLink = async (req: Request, res: Response) => {
  const id = uuidSchema.parse(req.params.id);
  const data = updateSocialLinkSchema.parse(req.body);

  const socialLink = await prisma.socialLink.update({
    where: { id },
    data,
  });

  res.json(socialLink);
};

// DELETE /api/admin/social-links/:id - Admin only
export const deleteSocialLink = async (req: Request, res: Response) => {
  const id = uuidSchema.parse(req.params.id);

  await prisma.socialLink.delete({ where: { id } });

  res.json({ message: 'Red social eliminada exitosamente' });
};
