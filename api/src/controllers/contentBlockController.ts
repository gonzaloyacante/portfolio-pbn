import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/content-blocks - Obtener todos los bloques
export const getContentBlocks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const blocks = await prisma.contentBlock.findMany({
      orderBy: { order: 'asc' }
    });

    res.json({ data: blocks, total: blocks.length });
  } catch (error) {
    console.error('Error fetching content blocks:', error);
    res.status(500).json({ error: 'Error al obtener bloques' });
  }
};

// GET /api/content-blocks/:id - Obtener un bloque específico
export const getContentBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const block = await prisma.contentBlock.findUnique({
      where: { id }
    });

    if (!block) {
      res.status(404).json({ error: 'Bloque no encontrado' });
      return;
    }

    res.json(block);
  } catch (error) {
    console.error('Error fetching content block:', error);
    res.status(500).json({ error: 'Error al obtener bloque' });
  }
};

// POST /api/content-blocks - Crear nuevo bloque (admin only)
export const createContentBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    const block = await prisma.contentBlock.create({
      data
    });

    res.status(201).json(block);
  } catch (error) {
    console.error('Error creating content block:', error);
    res.status(500).json({ error: 'Error al crear bloque' });
  }
};

// PUT /api/content-blocks/:id - Actualizar bloque (admin only)
export const updateContentBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const block = await prisma.contentBlock.update({
      where: { id },
      data
    });

    res.json(block);
  } catch (error) {
    console.error('Error updating content block:', error);
    res.status(500).json({ error: 'Error al actualizar bloque' });
  }
};

// DELETE /api/content-blocks/:id - Eliminar bloque (admin only)
export const deleteContentBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.contentBlock.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting content block:', error);
    res.status(500).json({ error: 'Error al eliminar bloque' });
  }
};
