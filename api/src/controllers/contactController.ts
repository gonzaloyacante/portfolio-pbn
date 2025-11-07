import { Request, Response } from 'express';
import prisma from '../config/database';
import {
  createContactSchema,
  updateContactSchema,
  paginationSchema,
  uuidSchema,
} from '../utils/validation';
import { AppError } from '../middleware/errorHandler';

// POST /api/contacts - Public
export const createContact = async (req: Request, res: Response) => {
  const data = createContactSchema.parse(req.body);

  const contact = await prisma.contact.create({
    data: {
      ...data,
      status: 'NEW',
    },
  });

  // TODO: Send email notification to admin
  // await sendContactNotification(contact);

  res.status(201).json({
    id: contact.id,
    name: contact.name,
    email: contact.email,
    status: contact.status,
    createdAt: contact.createdAt,
  });
};

// GET /api/admin/contacts - Admin only
export const getContacts = async (req: Request, res: Response) => {
  const { limit, offset } = paginationSchema.parse(req.query);
  const status = req.query.status as string | undefined;

  const where: any = {};
  if (status) {
    where.status = status;
  }

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.contact.count({ where }),
  ]);

  res.json({
    data: contacts,
    total,
    limit,
    offset,
  });
};

// GET /api/admin/contacts/:id - Admin only
export const getContact = async (req: Request, res: Response) => {
  const id = uuidSchema.parse(req.params.id);

  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new AppError('Contacto no encontrado', 404);
  }

  // Mark as read if it's new
  if (contact.status === 'NEW') {
    await prisma.contact.update({
      where: { id },
      data: { status: 'READ' },
    });
  }

  res.json(contact);
};

// PUT /api/admin/contacts/:id - Admin only
export const updateContact = async (req: Request, res: Response) => {
  const id = uuidSchema.parse(req.params.id);
  const data = updateContactSchema.parse(req.body);

  const updateData: any = { ...data };
  
  if (data.status === 'RESPONDED' && !updateData.respondedAt) {
    updateData.respondedAt = new Date();
  }

  const contact = await prisma.contact.update({
    where: { id },
    data: updateData,
  });

  res.json(contact);
};

// DELETE /api/admin/contacts/:id - Admin only
export const deleteContact = async (req: Request, res: Response) => {
  const id = uuidSchema.parse(req.params.id);

  await prisma.contact.delete({ where: { id } });

  res.json({ message: 'Contacto eliminado exitosamente' });
};
