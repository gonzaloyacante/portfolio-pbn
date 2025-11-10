import { Router } from 'express'
import { prisma } from '../prisma'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'

const router = Router()

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.number().int(),
  images: z.array(z.object({ url: z.string().url(), order: z.number().int().optional() })).optional(),
})

router.get('/', async (_req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      include: { images: { orderBy: { order: 'asc' } }, category: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(projects)
  } catch (e) {
    next(e)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const project = await prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } }, category: true },
    })
    if (!project) return res.status(404).json({ error: 'Not found' })
    res.json(project)
    return
  } catch (e) {
    next(e)
  }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const data = projectSchema.parse(req.body)
    const created = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        images: data.images
          ? { create: data.images.map((i, idx) => ({ url: i.url, order: i.order ?? idx })) }
          : undefined,
      },
      include: { images: true },
    })
    res.status(201).json(created)
    return
  } catch (e) {
    next(e)
  }
})

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const data = projectSchema.partial().parse(req.body)

    // Update project core fields
    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
      },
    })

    // Replace images if provided
    if (data.images) {
      await prisma.projectImage.deleteMany({ where: { projectId: id } })
      await prisma.projectImage.createMany({
        data: data.images.map((i, idx) => ({ projectId: id, url: i.url, order: i.order ?? idx })),
      })
    }

    const result = await prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } },
    })
    res.json(result)
    return
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    await prisma.projectImage.deleteMany({ where: { projectId: id } })
    await prisma.project.delete({ where: { id } })
    res.json({ ok: true })
    return
  } catch (e) {
    next(e)
  }
})

export default router
