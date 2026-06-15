import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

// ── Auth /me update ─────────────────────────────────────────────────────────

export const authMeUpdateSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional(),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  })
  .refine(
    (data) => {
      // If newPassword is set, currentPassword must also be set
      if (data.newPassword && !data.currentPassword) return false
      return true
    },
    { message: 'Debes indicar la contraseña actual para cambiarla', path: ['currentPassword'] }
  )
