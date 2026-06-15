import { z } from 'zod'

// ── Push Notifications ──────────────────────────────────────────────────────

export const pushRegisterSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  platform: z.enum(['android', 'ios'], { message: 'Plataforma debe ser android o ios' }),
})

export const pushUnregisterSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
})

// ── Contacts update ─────────────────────────────────────────────────────────

export const contactUpdateApiSchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'REPLIED', 'CLOSED', 'SPAM']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  isRead: z.boolean().optional(),
  isImportant: z.boolean().optional(),
  adminNote: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v ?? undefined),
  tags: z.array(z.string()).optional(),
})

// ── Social Links ────────────────────────────────────────────────────────────

export const socialLinkApiSchema = z.object({
  platform: z.string().min(1, 'Plataforma obligatoria'),
  url: z.string().url('URL inválida'),
  username: z.string().nullish(),
  icon: z.string().nullish(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

// ── Reorder ─────────────────────────────────────────────────────────────────

export const reorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        sortOrder: z.number().int(),
      })
    )
    .min(1, 'Se requiere al menos un elemento')
    .max(200, 'No se pueden reordenar más de 200 elementos a la vez'),
})

// ── App Release ─────────────────────────────────────────────────────────────

export const appReleaseApiSchema = z.object({
  version: z.string().min(1, 'La versión es obligatoria'),
  versionCode: z.number().int().positive(),
  releaseNotes: z.string().min(1, 'releaseNotes es obligatorio'),
  downloadUrl: z
    .string()
    .url('URL de descarga inválida')
    .refine((u) => u.startsWith('https://'), 'La URL de descarga debe ser HTTPS'),
  checksumSha256: z.string().optional().nullable(),
  mandatory: z.boolean().optional(),
  minVersion: z.string().optional().nullable(),
  fileSizeBytes: z.number().int().positive().optional().nullable(),
})

export const appReleaseDeleteSchema = z
  .object({
    id: z.string().optional(),
    version: z.string().optional(),
    downloadUrl: z.string().optional(),
  })
  .refine((data) => data.id || data.version || data.downloadUrl, {
    message: 'Se requiere al menos un identificador (id, version o downloadUrl)',
  })

// ── Upload ──────────────────────────────────────────────────────────────────

export const uploadDeleteSchema = z.object({
  publicId: z.string().min(1, 'publicId es requerido'),
})
