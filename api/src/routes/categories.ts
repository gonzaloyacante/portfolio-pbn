import { Router } from 'express'
import { prisma } from '../prisma'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'

const router = Router()

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
})

router.get('/', async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    res.json(categories)
  } catch (e) {
    next(e)
  }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const data = categorySchema.parse(req.body)
    const created = await prisma.category.create({ data })
    res.status(201).json(created)
  } catch (e) {
    next(e)
  }
})

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const data = categorySchema.partial().parse(req.body)
    const updated = await prisma.category.update({ where: { id }, data })
    res.json(updated)
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    await prisma.category.delete({ where: { id } })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

export default router
