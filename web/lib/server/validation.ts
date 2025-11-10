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
  level: z.number().int().min(0).max(100).default(50),
  order: z.number().int().default(0),
});

export const updateSkillSchema = createSkillSchema.partial();

// SocialLink schemas
export const createSocialLinkSchema = z.object({
  platform: z.enum(['INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'LINKEDIN', 'WHATSAPP', 'FACEBOOK', 'TWITTER', 'BEHANCE', 'EMAIL', 'OTHER']),
  url: urlSchema,
  label: z.string().max(100).optional(),
  icon: z.string().min(1).max(50).optional(),
  order: z.number().int().default(0),
});

export const updateSocialLinkSchema = createSocialLinkSchema.partial();

// Settings schemas
export const updateSettingsSchema = z.object({
  siteName: z.string().min(1).max(200).optional(),
  siteDescription: z.string().min(1).optional(),
  siteUrl: z.string().url().optional(),
  ownerName: z.string().min(1).max(100).optional(),
  ownerTitle: z.string().max(200).optional(),
  ownerBio: z.string().optional(),
  ownerEmail: z.string().email().optional(),
  ownerPhone: z.string().max(50).optional(),
  ownerLocation: z.string().max(200).optional(),
  logoUrl: urlSchema.optional(),
  faviconUrl: urlSchema.optional(),
  ogImageUrl: urlSchema.optional(),
  metaKeywords: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  facebookPixelId: z.string().optional(),
  maintenanceMode: z.boolean().optional(),
});

// Design Settings schemas
export const updateDesignSettingsSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  headingFont: z.string().optional(),
  bodyFont: z.string().optional(),
  headingSize: z.string().optional(),
  bodySize: z.string().optional(),
  lineHeight: z.string().optional(),
  containerMaxWidth: z.string().optional(),
  sectionPadding: z.string().optional(),
  elementSpacing: z.string().optional(),
  borderRadius: z.string().optional(),
  boxShadow: z.string().optional(),
  hoverTransform: z.string().optional(),
  transitionSpeed: z.string().optional(),
});

// Page Section schemas
export const createPageSectionSchema = z.object({
  pageName: z.string().min(1).max(50),
  sectionType: z.enum(['HERO', 'ABOUT', 'SKILLS', 'PROJECTS', 'CONTACT', 'CUSTOM']),
  title: z.string().max(200).optional(),
  subtitle: z.string().optional(),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
  config: z.record(z.any()).default({}),
});

export const updatePageSectionSchema = createPageSectionSchema.partial();

// Content Block schemas
export const createContentBlockSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1).max(100),
  type: z.enum(['TEXT', 'IMAGE', 'CTA', 'STATS', 'TESTIMONIAL', 'CUSTOM_HTML']),
  content: z.record(z.any()),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const updateContentBlockSchema = createContentBlockSchema.partial();

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
