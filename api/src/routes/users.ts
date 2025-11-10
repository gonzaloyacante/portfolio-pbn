import { Router } from 'express'
import { prisma } from '../prisma'
import { z } from 'zod'
import { requireAdmin } from '../middleware/auth'
import bcrypt from 'bcryptjs'

const router = Router()

// Actualiza email y/o nombre del usuario autenticado (ADMIN)
const updateProfileSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
})

router.post('/admin/update-profile', requireAdmin, async (req, res, next) => {
  try {
    const userId = (req as any).user!.sub as number
    const { email, name } = updateProfileSchema.parse(req.body || {})
    if (!email && !name) return res.status(400).json({ error: 'Nothing to update' })

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { ...(email ? { email } : {}), ...(name ? { name } : {}) },
    })
    res.json({ id: updated.id, email: updated.email, name: updated.name, role: updated.role })
    return
  } catch (e) {
    next(e)
  }
})

// Setear nueva contraseña SIN requerir la contraseña actual (ADMIN)
const setPasswordSchema = z.object({ newPassword: z.string().min(6) })

router.post('/admin/set-password', requireAdmin, async (req, res, next) => {
  try {
    const userId = (req as any).user!.sub as number
    const { newPassword } = setPasswordSchema.parse(req.body || {})
    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } })
    res.json({ ok: true })
    return
  } catch (e) {
    next(e)
  }
})

export default router
