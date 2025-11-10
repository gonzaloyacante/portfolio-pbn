import { Router } from 'express'
import { prisma } from '../prisma'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const s = await prisma.settings.findUnique({ where: { id: 1 } })
    res.json(s)
  } catch (e) {
    next(e)
  }
})

const upsertSchema = z.object({ title: z.string().min(1) })

router.put('/', requireAuth, async (req, res, next) => {
  try {
    const data = upsertSchema.parse(req.body)
    const updated = await prisma.settings.upsert({
      where: { id: 1 },
      update: { ...data },
      create: { id: 1, ...data },
    })
    res.json(updated)
  } catch (e) {
    next(e)
  }
})

export default router
