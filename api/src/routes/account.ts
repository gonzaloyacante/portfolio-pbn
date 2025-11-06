import { Router } from 'express'
import { prisma } from '../prisma'
import { z } from 'zod'
import { requireAuth, requireAdmin } from '../middleware/auth'
import bcrypt from 'bcryptjs'

const router = Router()

const changeEmailSchema = z.object({
  currentPassword: z.string().min(6),
  newEmail: z.string().email(),
})

router.post('/change-email', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).user!.id
    const { currentPassword, newEmail } = changeEmailSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(404).json({ error: 'User not found' })
    const ok = await bcrypt.compare(currentPassword, user.password)
    if (!ok) return res.status(400).json({ error: 'Invalid current password' })

    const updated = await prisma.user.update({ where: { id: userId }, data: { email: newEmail } })
    res.json({ id: updated.id, email: updated.email })
    return
  } catch (e) {
    next(e)
  }
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
})

router.post('/change-password', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).user!.id
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(404).json({ error: 'User not found' })
    const ok = await bcrypt.compare(currentPassword, user.password)
    if (!ok) return res.status(400).json({ error: 'Invalid current password' })

    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } })
    res.json({ ok: true })
    return
  } catch (e) {
    next(e)
  }
})

export default router
