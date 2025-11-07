import { z } from 'zod';

// Email validation
export const emailSchema = z.string().email('Email inválido').max(255);

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial');

// Slug validation
export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido (solo letras minúsculas, números y guiones)');

// URL validation
export const urlSchema = z.string().url('URL inválida').max(500);

// UUID validation
export const uuidSchema = z.string().uuid('ID inválido');

// Pagination
export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2).max(100),
});

// Project schemas
export const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: slugSchema,
  description: z.string().min(1),
  shortDescription: z.string().min(1).max(500),
  categoryId: uuidSchema,
  thumbnailUrl: urlSchema,
  featured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  order: z.number().int().default(0),
});

export const updateProjectSchema = createProjectSchema.partial();

// Category schemas
export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: slugSchema,
  description: z.string().optional(),
  order: z.number().int().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

// Contact schemas
export const createContactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: emailSchema,
  phone: z.string().max(50).optional(),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres').max(200),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(5000),
});

export const updateContactSchema = z.object({
  status: z.enum(['NEW', 'READ', 'RESPONDED', 'ARCHIVED']).optional(),
  response: z.string().optional(),
});

// Skill schemas
export const createSkillSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  icon: z.string().max(50).optional(),
  order: z.number().int().default(0),
});

export const updateSkillSchema = createSkillSchema.partial();

// SocialLink schemas
export const createSocialLinkSchema = z.object({
  platform: z.enum(['INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'LINKEDIN', 'WHATSAPP', 'FACEBOOK', 'TWITTER', 'BEHANCE', 'OTHER']),
  url: urlSchema,
  icon: z.string().min(1).max(50),
  order: z.number().int().default(0),
});

export const updateSocialLinkSchema = createSocialLinkSchema.partial();

// Settings schemas
export const updateSettingsSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  email: emailSchema.optional(),
  phone: z.string().max(50).optional(),
  location: z.string().max(200).optional(),
  bio: z.string().optional(),
  profileImage: urlSchema.optional(),
  bannerImage: urlSchema.optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
  maintenanceMode: z.boolean().optional(),
});

// Helper to generate slug from text
export function generateSlug(text: string): string {
  return text
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
