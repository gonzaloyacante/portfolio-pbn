import { Router } from 'express'
import { prisma } from '../prisma'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const p = await prisma.presentation.findUnique({ where: { id: 1 } })
    res.json(p)
  } catch (e) {
    next(e)
  }
})

const upsertSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1), // HTML
  imageUrl: z.string().url().optional(),
})

router.put('/', requireAuth, async (req, res, next) => {
  try {
    const data = upsertSchema.parse(req.body)
    const updated = await prisma.presentation.upsert({
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
