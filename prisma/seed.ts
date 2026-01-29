import { PrismaClient } from '@prisma/client'
import { adminUser } from './seeds/users'
import { themeSettings } from './seeds/theme'
import { homeSettings, aboutSettings, contactSettings } from './seeds/settings'
import { categories, services, testimonials, socialLinks } from './seeds/content'
import { projects } from './seeds/projects'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Comprehensive Seed...')

  // 1. Admin User
  console.log('👤 Seeding Admin User...')
  await prisma.user.upsert({
    where: { email: adminUser.email },
    update: {},
    create: adminUser,
  })

  // 2. Settings (Theme & Pages)
  console.log('⚙️  Seeding Settings...')
  await prisma.themeSettings.upsert({
    where: { id: themeSettings.id },
    update: themeSettings,
    create: themeSettings,
  })

  await prisma.homeSettings.upsert({
    where: { id: homeSettings.id },
    update: homeSettings,
    create: homeSettings,
  })

  await prisma.aboutSettings.upsert({
    where: { id: aboutSettings.id },
    update: aboutSettings,
    create: aboutSettings,
  })

  await prisma.contactSettings.upsert({
    where: { id: contactSettings.id },
    update: contactSettings,
    create: contactSettings,
  })

  // 3. Social Links
  console.log('🔗 Seeding Social Links...')
  for (const link of socialLinks) {
    await prisma.socialLink.upsert({
      where: { platform: link.platform },
      update: link,
      create: link,
    })
  }

  // 4. Content (Categories, Services, Testimonials)
  console.log('📚 Seeding Content...')

  // Categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
  }

  // Services
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    })
  }

  // Testimonials
  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    })
  }

  // 5. Projects
  console.log('🎨 Seeding Projects...')
  for (const project of projects) {
    const { categorySlug, images, ...projectData } = project

    // Find category ID
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    })

    if (!category) {
      console.warn(`⚠️  Category ${categorySlug} not found for project ${project.title}`)
      continue
    }

    // Upsert project
    const createdProject = await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: {
        ...projectData,
        categoryId: category.id,
      },
      create: {
        ...projectData,
        categoryId: category.id,
      },
    })

    // Create images for project (delete existing first to reset order)
    await prisma.projectImage.deleteMany({
      where: { projectId: createdProject.id },
    })

    for (const img of images) {
      await prisma.projectImage.create({
        data: {
          url: img.url,
          alt: img.alt,
          order: img.order,
          publicId: `seed-${projectData.slug}-${img.order}`, // Fake publicId
          projectId: createdProject.id,
        },
      })
    }
  }

  console.log('🎉 Seeding Completed Successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
