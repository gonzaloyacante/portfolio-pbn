import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'
import bcrypt from 'bcryptjs'
import { adminUser } from './seeds/users'
import { themeSettings } from './seeds/theme'
import {
  homeSettings,
  aboutSettings,
  contactSettings,
  testimonialSettings,
  projectSettings,
  categorySettings,
} from './seeds/settings'
import { categories, services, testimonials, socialLinks } from './seeds/content'
import { projects } from './seeds/projects'

const _adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: _adapter })

async function main() {
  console.log('🌱 Starting Comprehensive Seed...\n')

  // 1. Admin User (with bcrypt hashing)
  console.log('👤 Seeding Admin User...')
  const hashedPassword = await bcrypt.hash(adminUser.password, 12)
  await prisma.user.upsert({
    where: { email: adminUser.email },
    update: {
      password: hashedPassword,
      name: adminUser.name,
    },
    create: {
      email: adminUser.email,
      password: hashedPassword,
      name: adminUser.name,
      role: adminUser.role as 'ADMIN',
    },
  })
  console.log(`   ✅ Admin: ${adminUser.email}`)

  // 2. Settings (Theme & Pages)
  // All settings models are singletons identified by key='singleton'
  // Use key-based upsert to handle existing records with any CUID id
  console.log('\n⚙️ Seeding Settings...')
  const { id: _themeId, ...themeUpdate } = themeSettings
  await prisma.themeSettings.upsert({
    where: { key: 'singleton' },
    update: themeUpdate,
    create: themeSettings,
  })

  const { id: _homeId, ...homeUpdate } = homeSettings
  await prisma.homeSettings.upsert({
    where: { key: 'singleton' },
    update: homeUpdate,
    create: homeSettings,
  })

  const { id: _aboutId, ...aboutUpdate } = aboutSettings
  await prisma.aboutSettings.upsert({
    where: { key: 'singleton' },
    update: aboutUpdate,
    create: aboutSettings,
  })

  const { id: _contactId, ...contactUpdate } = contactSettings
  await prisma.contactSettings.upsert({
    where: { key: 'singleton' },
    update: contactUpdate,
    create: contactSettings,
  })

  const { id: _testimonialSettingsId, ...testimonialSettingsUpdate } = testimonialSettings
  await prisma.testimonialSettings.upsert({
    where: { key: 'singleton' },
    update: testimonialSettingsUpdate,
    create: testimonialSettings,
  })

  const { id: _projectSettingsId, ...projectSettingsUpdate } = projectSettings
  await prisma.projectSettings.upsert({
    where: { key: 'singleton' },
    update: projectSettingsUpdate,
    create: projectSettings,
  })

  const { id: _categorySettingsId, ...categorySettingsUpdate } = categorySettings
  await prisma.categorySettings.upsert({
    where: { key: 'singleton' },
    update: categorySettingsUpdate,
    create: categorySettings,
  })
  console.log('   ✅ All settings created/updated')

  // 3. Social Links
  console.log('\n🔗 Seeding Social Links...')
  for (const link of socialLinks) {
    await prisma.socialLink.upsert({
      where: { platform: link.platform },
      update: link,
      create: link,
    })
  }
  console.log(`   ✅ ${socialLinks.length} social links`)

  // 4. Content (Categories, Services, Testimonials)
  console.log('\n📚 Seeding Content...')

  // Categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
  }
  console.log(`   ✅ ${categories.length} categories`)

  // Services
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    })
  }
  console.log(`   ✅ ${services.length} services`)

  // Testimonials - delete existing first to avoid duplicates
  await prisma.testimonial.deleteMany({})
  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: t,
    })
  }
  console.log(`   ✅ ${testimonials.length} testimonials`)

  // 5. Projects (with error handling)
  console.log('\n🎨 Seeding Projects...')
  let projectCount = 0
  let imageCount = 0

  for (const project of projects) {
    const { images, categorySlug, ...projectData } = project

    // Find category ID
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    })

    if (!category) {
      console.warn(`   ⚠️  Category ${categorySlug} not found for project ${project.title}`)
      continue
    }

    try {
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

      // Delete existing images to reset order
      await prisma.projectImage.deleteMany({
        where: { projectId: createdProject.id },
      })

      // Create images for project
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
        imageCount++
      }

      projectCount++
    } catch (error) {
      console.error(`   ❌ Error seeding project ${project.title}:`, error)
    }
  }
  console.log(`   ✅ ${projectCount} projects`)
  console.log(`   ✅ ${imageCount} images`)

  console.log('\n🎉 Seeding Completed Successfully!')
  console.log(
    `   📁 Categories: ${categories.length} (${categories.map((c) => c.name).join(', ')})`
  )
  console.log(`   🔗 Social links: ${socialLinks.length}`)
  console.log(`   💼 Services: ${services.length}`)
  console.log(`   💬 Testimonials: ${testimonials.length}`)
  console.log(`   🎨 Projects: ${projectCount}`)
  console.log(`   🖼️ Images: ${imageCount}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
