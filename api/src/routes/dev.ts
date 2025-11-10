import { Router } from 'express'
import { prisma } from '../prisma'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import { setRevocationNow } from '../middleware/auth'

const router = Router()

router.post('/seed', async (_req, res, next) => {
  try {
    // Settings
    await prisma.settings.upsert({
      where: { id: 1 },
      update: { title: 'Portfolio' },
      create: { id: 1, title: 'Portfolio' },
    })

// Rotar sesiones (revocar todas las cookies actuales). Opcional: rotar secreto JWT.
// POST /api/dev/security/rotate
// body opcional: { rotateSecret?: boolean }
router.post('/security/rotate', async (req, res) => {
  setRevocationNow()
  const { rotateSecret } = (req.body || {}) as { rotateSecret?: boolean }
  let newSecret: string | undefined
  if (rotateSecret) {
    // Advertencia: esto solo afecta al proceso actual.
    newSecret = `dev-${Math.random().toString(36).slice(2)}-${Date.now()}`
    process.env.JWT_SECRET = newSecret
  }
  res.json({ ok: true, revokedAfter: new Date().toISOString(), rotatedSecret: Boolean(rotateSecret), newSecret })
})

    // Contact
    await prisma.contact.upsert({
      where: { id: 1 },
      update: {
        email: 'admin@example.com',
        socialsJson: JSON.stringify({
          facebook: { url: '', username: '' },
          instagram: { url: '', username: '' },
          linkedin: { url: '', username: '' },
          twitter: { url: '', username: '' },
        }),
      },
      create: {
        id: 1,
        email: 'admin@example.com',
        socialsJson: JSON.stringify({
          facebook: { url: '', username: '' },
          instagram: { url: '', username: '' },
          linkedin: { url: '', username: '' },
          twitter: { url: '', username: '' },
        }),
      },
    })

    // Admin user (seed)
    {
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@demo.local'
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
      const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
      await prisma.user.upsert({
        where: { email: ADMIN_EMAIL },
        update: { password: hash, role: 'ADMIN' },
        create: { email: ADMIN_EMAIL, password: hash, role: 'ADMIN', name: 'Admin' },
      })
    }

    // Category
    const slug = 'general'
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name: 'General' },
      create: { name: 'General', slug },
    })

    // Project (if none exists)
    const existingProject = await prisma.project.findFirst()
    if (!existingProject) {
      await prisma.project.create({
        data: {
          title: 'Proyecto de ejemplo',
          description: 'Descripción de ejemplo',
          categoryId: category.id,
        },
      })
    }

    // Presentation (about me)
    const existingPresentation = await prisma.presentation.findFirst()
    if (!existingPresentation) {
      await prisma.presentation.create({
        data: {
          title: 'Sobre Mí',
          content: '<p>Hola, soy un texto de ejemplo para Sobre Mí.</p>',
        },
      })
    }

    // Gallery image (optional)
    const galleryCount = await prisma.galleryImage.count()
    if (galleryCount === 0) {
      await prisma.galleryImage.create({
        data: {
          name: 'Sample',
          url: 'https://res.cloudinary.com/demo/image/upload/w_800/cell.jpg',
          order: 1,
        },
      })
    }

    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

// Importar datos desde el archivo local dev-data/full-import.json (desarrollo)
router.post('/import/full', async (_req, res, next) => {
  try {
    const filePath = path.resolve(__dirname, '../../dev-data/full-import.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const body = JSON.parse(raw)


    // Reutilizamos la misma lógica que /import
    // Settings
    if (body.settings?.title) {
      await prisma.settings.upsert({
        where: { id: 1 },
        update: { title: String(body.settings.title) },
        create: { id: 1, title: String(body.settings.title) },
      })
    }

    // Contact
    if (body.contact?.email) {
      await prisma.contact.upsert({
        where: { id: 1 },
        update: {
          email: String(body.contact.email),
          socialsJson: JSON.stringify(body.contact.socials || {}),
        },
        create: {
          id: 1,
          email: String(body.contact.email),
          socialsJson: JSON.stringify(body.contact.socials || {}),
        },
      })
    }

    // Admin user (full-import)
    {
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@demo.local'
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
      const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
      await prisma.user.upsert({
        where: { email: ADMIN_EMAIL },
        update: { password: hash, role: 'ADMIN' },
        create: { email: ADMIN_EMAIL, password: hash, role: 'ADMIN', name: 'Admin' },
      })
    }

    // Categories
    const slugify = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const categoryByName: Record<string, number> = {}
    if (Array.isArray(body.categories)) {
      for (const c of body.categories) {
        if (!c?.name) continue
        const slug = c.slug || slugify(c.name)
        if (c.id) {
          const sourceId = String(c.id)
          const map = await prisma.importMap.findUnique({
            where: { entity_sourceId: { entity: 'category', sourceId } },
          })
          if (map?.targetCatId) {
            const cat = await prisma.category.update({
              where: { id: map.targetCatId },
              data: { name: c.name, slug },
            })
            categoryByName[c.name] = cat.id
          } else {
            const cat = await prisma.category.upsert({
              where: { slug },
              update: { name: c.name },
              create: { name: c.name, slug },
            })
            await prisma.importMap.upsert({
              where: { entity_sourceId: { entity: 'category', sourceId } },
              update: { targetCatId: cat.id },
              create: { entity: 'category', sourceId, targetCatId: cat.id },
            })
            categoryByName[c.name] = cat.id
          }
        } else {
          const cat = await prisma.category.upsert({
            where: { slug },
            update: { name: c.name },
            create: { name: c.name, slug },
          })
          categoryByName[c.name] = cat.id
        }
      }
    }

    // Projects and images
    if (Array.isArray(body.projects)) {
      for (const p of body.projects) {
        if (!p?.title || !p?.description || !p?.category) continue
        const catId = categoryByName[p.category] || null
        if (!catId) continue

        let projectId: number
        if (p.id) {
          const sourceId = String(p.id)
          const map = await prisma.importMap.findUnique({
            where: { entity_sourceId: { entity: 'project', sourceId } },
          })
          if (map?.targetProjId) {
            const updated = await prisma.project.update({
              where: { id: map.targetProjId },
              data: { title: p.title, description: p.description, categoryId: catId },
            })
            projectId = updated.id
          } else {
            const created = await prisma.project.create({
              data: { title: p.title, description: p.description, categoryId: catId },
            })
            await prisma.importMap.upsert({
              where: { entity_sourceId: { entity: 'project', sourceId } },
              update: { targetProjId: created.id },
              create: { entity: 'project', sourceId, targetProjId: created.id },
            })
            projectId = created.id
          }
        } else {
          const existing = await prisma.project.findFirst({ where: { title: p.title, categoryId: catId } })
          if (existing) {
            const updated = await prisma.project.update({
              where: { id: existing.id },
              data: { description: p.description },
            })
            projectId = updated.id
          } else {
            const created = await prisma.project.create({ data: { title: p.title, description: p.description, categoryId: catId } })
            projectId = created.id
          }
        }

        if (Array.isArray(p.images)) {
          await prisma.projectImage.deleteMany({ where: { projectId } })
          for (let i = 0; i < p.images.length; i++) {
            const url = p.images[i]
            if (!url) continue
            await prisma.projectImage.create({ data: { projectId, url, order: i } })
          }
        }
      }
    }

    // Presentation
    if (body.presentation?.content) {
      const title = body.presentation.title || 'Sobre Mí'
      const exists = await prisma.presentation.findFirst()
      if (exists) {
        await prisma.presentation.update({ where: { id: exists.id }, data: { title, content: String(body.presentation.content) } })
      } else {
        await prisma.presentation.create({ data: { title, content: String(body.presentation.content) } })
      }
    }

    // Gallery
    if (Array.isArray(body.gallery)) {
      await prisma.galleryImage.deleteMany({})
      for (const g of body.gallery) {
        if (!g?.url) continue
        await prisma.galleryImage.create({
          data: { url: g.url, name: g.name || 'Imagen', order: g.order ?? 0 },
        })
      }
    }

    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

// Crear o actualizar un usuario ADMIN (solo desarrollo)
// POST /api/dev/users/admin
// body opcional: { email, password, name }
router.post('/users/admin', async (req, res, next) => {
  try {
    const { email = 'admin@demo.local', password = 'admin123', name = 'Admin' } = req.body || {}
    if (!email || !password) return res.status(400).json({ ok: false, error: 'email y password requeridos' })

    const hash = await bcrypt.hash(String(password), 10)
    const user = await prisma.user.upsert({
      where: { email: String(email) },
      update: { password: hash, name: String(name || 'Admin'), role: 'ADMIN' },
      create: { email: String(email), password: hash, name: String(name || 'Admin'), role: 'ADMIN' },
    })

    res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
    return
  } catch (e) {
    next(e)
  }
})

export default router

// Import data from JSON payload (exported from Firebase) and populate DB (development only)
// Expected payload shape (minimal):
// {
//   settings: { title: string },
//   contact: { email: string, socials: any },
//   categories: Array<{ id?: string|number, name: string, slug?: string }>,
//   projects: Array<{ id?: string|number, title: string, description: string, category: string, images?: string[] }>,
//   presentation: { title?: string, content: string },
//   gallery: Array<{ url: string, name?: string, order?: number }>
// }
router.post('/import', async (req, res, next) => {
  try {
    const body = req.body || {}

    // Settings
    if (body.settings?.title) {
      await prisma.settings.upsert({
        where: { id: 1 },
        update: { title: String(body.settings.title) },
        create: { id: 1, title: String(body.settings.title) },
      })
    }

    // Contact
    if (body.contact?.email) {
      await prisma.contact.upsert({
        where: { id: 1 },
        update: {
          email: String(body.contact.email),
          socialsJson: JSON.stringify(body.contact.socials || {}),
        },
        create: {
          id: 1,
          email: String(body.contact.email),
          socialsJson: JSON.stringify(body.contact.socials || {}),
        },
      })
    }

    // Categories
    const slugify = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const categoryByName: Record<string, number> = {}
    if (Array.isArray(body.categories)) {
      for (const c of body.categories) {
        if (!c?.name) continue
        const slug = c.slug || slugify(c.name)
        if (c.id) {
          const sourceId = String(c.id)
          const map = await prisma.importMap.findUnique({
            where: { entity_sourceId: { entity: 'category', sourceId } },
          })
          if (map?.targetCatId) {
            const cat = await prisma.category.update({
              where: { id: map.targetCatId },
              data: { name: c.name, slug },
            })
            categoryByName[c.name] = cat.id
          } else {
            const cat = await prisma.category.upsert({
              where: { slug },
              update: { name: c.name },
              create: { name: c.name, slug },
            })
            await prisma.importMap.upsert({
              where: { entity_sourceId: { entity: 'category', sourceId } },
              update: { targetCatId: cat.id },
              create: { entity: 'category', sourceId, targetCatId: cat.id },
            })
            categoryByName[c.name] = cat.id
          }
        } else {
          const cat = await prisma.category.upsert({
            where: { slug },
            update: { name: c.name },
            create: { name: c.name, slug },
          })
          categoryByName[c.name] = cat.id
        }
      }
    }

    // Projects and images
    if (Array.isArray(body.projects)) {
      for (const p of body.projects) {
        if (!p?.title || !p?.description || !p?.category) continue
        const catId = categoryByName[p.category] || null
        if (!catId) continue

        let projectId: number
        if (p.id) {
          const sourceId = String(p.id)
          const map = await prisma.importMap.findUnique({
            where: { entity_sourceId: { entity: 'project', sourceId } },
          })
          if (map?.targetProjId) {
            const updated = await prisma.project.update({
              where: { id: map.targetProjId },
              data: { title: p.title, description: p.description, categoryId: catId },
            })
            projectId = updated.id
          } else {
            const created = await prisma.project.create({
              data: { title: p.title, description: p.description, categoryId: catId },
            })
            await prisma.importMap.upsert({
              where: { entity_sourceId: { entity: 'project', sourceId } },
              update: { targetProjId: created.id },
              create: { entity: 'project', sourceId, targetProjId: created.id },
            })
            projectId = created.id
          }
        } else {
          const existing = await prisma.project.findFirst({ where: { title: p.title, categoryId: catId } })
          if (existing) {
            const updated = await prisma.project.update({
              where: { id: existing.id },
              data: { description: p.description },
            })
            projectId = updated.id
          } else {
            const created = await prisma.project.create({ data: { title: p.title, description: p.description, categoryId: catId } })
            projectId = created.id
          }
        }

        if (Array.isArray(p.images)) {
          await prisma.projectImage.deleteMany({ where: { projectId } })
          for (let i = 0; i < p.images.length; i++) {
            const url = p.images[i]
            if (!url) continue
            await prisma.projectImage.create({ data: { projectId, url, order: i } })
          }
        }
      }
    }

    // Presentation
    if (body.presentation?.content) {
      const title = body.presentation.title || 'Sobre Mí'
      const exists = await prisma.presentation.findFirst()
      if (exists) {
        await prisma.presentation.update({ where: { id: exists.id }, data: { title, content: String(body.presentation.content) } })
      } else {
        await prisma.presentation.create({ data: { title, content: String(body.presentation.content) } })
      }
    }

    // Gallery
    if (Array.isArray(body.gallery)) {
      await prisma.galleryImage.deleteMany({})
      for (const g of body.gallery) {
        if (!g?.url) continue
        await prisma.galleryImage.create({
          data: { url: g.url, name: g.name || 'Imagen', order: g.order ?? 0 },
        })
      }
    }

    res.json({ ok: true })
    return
  } catch (e) {
    next(e)
  }
})
