import { Router } from 'express'
import { prisma } from '../prisma'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'

const router = Router()

const createSchema = z.object({
  url: z.string().url(),
  name: z.string().min(1),
  order: z.number().int().min(0).default(0),
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body)
    const created = await prisma.galleryImage.create({ data })
    res.status(201).json(created)
  } catch (e) {
    next(e)
  }
})

// Crear múltiples imágenes en bloque
const bulkCreateSchema = z.object({
  items: z.array(z.object({ url: z.string().url(), name: z.string().min(1), order: z.number().int().min(0).optional() })),
})

router.post('/bulk', requireAuth, async (req, res, next) => {
  try {
    const { items } = bulkCreateSchema.parse(req.body)
    const created = await prisma.$transaction(
      items.map((it, idx) =>
        prisma.galleryImage.create({ data: { url: it.url, name: it.name, order: it.order ?? idx } }),
      ),
    )
    res.status(201).json(created)
  } catch (e) {
    next(e)
  }
})

const updateSchema = z.object({
  url: z.string().url().optional(),
  name: z.string().min(1).optional(),
  order: z.number().int().min(0).optional(),
})

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const data = updateSchema.parse(req.body)
    const updated = await prisma.galleryImage.update({ where: { id }, data })
    res.json(updated)
  } catch (e) {
    next(e)
  }
})

// Reordenar en bloque
const reorderSchema = z.object({
  items: z.array(z.object({ id: z.number().int(), order: z.number().int().min(0) })),
})

router.put('/reorder/all', requireAuth, async (req, res, next) => {
  try {
    const { items } = reorderSchema.parse(req.body)
    await prisma.$transaction(items.map((i) => prisma.galleryImage.update({ where: { id: i.id }, data: { order: i.order } })))
    const result = await prisma.galleryImage.findMany({ orderBy: { order: 'asc' } })
    res.json(result)
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    await prisma.galleryImage.delete({ where: { id } })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

export default router
