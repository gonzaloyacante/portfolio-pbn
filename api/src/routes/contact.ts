import { Router } from 'express'
import { prisma } from '../prisma'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'

const router = Router()

const socialsSchema = z.object({
  facebook: z.object({ url: z.string().optional().default(''), username: z.string().optional().default('') }),
  instagram: z.object({ url: z.string().optional().default(''), username: z.string().optional().default('') }),
  linkedin: z.object({ url: z.string().optional().default(''), username: z.string().optional().default('') }),
  twitter: z.object({ url: z.string().optional().default(''), username: z.string().optional().default('') }),
})

const contactSchema = z.object({
  email: z.string().email(),
  socials: socialsSchema,
})

router.get('/', async (_req, res, next) => {
  try {
    const c = await prisma.contact.findUnique({ where: { id: 1 } })
    if (!c) return res.json(null)
    const payload = { email: c.email, socials: JSON.parse(c.socialsJson) }
    res.json(payload)
    return
  } catch (e) {
    next(e)
  }
})

router.put('/', requireAuth, async (req, res, next) => {
  try {
    const data = contactSchema.parse(req.body)
    const updated = await prisma.contact.upsert({
      where: { id: 1 },
      update: { email: data.email, socialsJson: JSON.stringify(data.socials) },
      create: { id: 1, email: data.email, socialsJson: JSON.stringify(data.socials) },
    })
    res.json({ email: updated.email, socials: data.socials })
    return
  } catch (e) {
    next(e)
  }
})

export default router
