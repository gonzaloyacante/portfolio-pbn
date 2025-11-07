import { Request, Response } from 'express';
import prisma from '../config/database';
import {
  createSkillSchema,
  updateSkillSchema,
  uuidSchema,
} from '../utils/validation';

// GET /api/skills - Public
export const getSkills = async (_req: Request, res: Response) => {
  const skills = await prisma.skill.findMany({
    orderBy: { order: 'asc' },
  });

  res.json({ data: skills });
};

// POST /api/admin/skills - Admin only
export const createSkill = async (req: Request, res: Response) => {
  const data = createSkillSchema.parse(req.body);

  const skill = await prisma.skill.create({
    data,
  });

  res.status(201).json(skill);
};

// PUT /api/admin/skills/:id - Admin only
export const updateSkill = async (req: Request, res: Response) => {
  const id = uuidSchema.parse(req.params.id);
  const data = updateSkillSchema.parse(req.body);

  const skill = await prisma.skill.update({
    where: { id },
    data,
  });

  res.json(skill);
};

// DELETE /api/admin/skills/:id - Admin only
export const deleteSkill = async (req: Request, res: Response) => {
  const id = uuidSchema.parse(req.params.id);

  await prisma.skill.delete({ where: { id } });

  res.json({ message: 'Habilidad eliminada exitosamente' });
};
