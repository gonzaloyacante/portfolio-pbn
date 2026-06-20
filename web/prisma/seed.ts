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
  categorySettings,
  servicesPageSettings,
} from './seeds/settings'
import { categories, services, testimonials, socialLinks } from './seeds/content'
import { galleryImagesByCategorySlug } from './seeds/gallery-images'
import { siteSettings } from './seeds/site-settings'
import { emailSettings } from './seeds/email-settings'
import { contacts } from './seeds/contacts'
import { bookings } from './seeds/bookings'
import { pricingTiers } from './seeds/pricing-tiers'
import { appReleases } from './seeds/app-release'

const _adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: _adapter })

async function main() {
  console.log('🌱 Starting Comprehensive Seed...\n')

  // 1. Admin User
  console.log('👤 Seeding Admin User...')
  const hashedPassword = await bcrypt.hash(adminUser.password, 12)
  await prisma.user.upsert({
    where: { email: adminUser.email },
    update: { password: hashedPassword, name: adminUser.name },
    create: {
      email: adminUser.email,
      password: hashedPassword,
      name: adminUser.name,
      role: adminUser.role as 'ADMIN',
    },
  })
  console.log(`   ✅ Admin: ${adminUser.email}`)

  // 2. Settings (Theme & Pages) — singletons
  console.log('\n⚙️ Seeding Settings...')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, ...themeUpdate } = themeSettings
  await prisma.themeSettings.upsert({
    where: { key: 'singleton' },
    update: themeUpdate,
    create: themeSettings,
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _hId, ...homeUpdate } = homeSettings
  await prisma.homeSettings.upsert({
    where: { key: 'singleton' },
    update: homeUpdate,
    create: homeSettings,
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _aId, ...aboutUpdate } = aboutSettings
  await prisma.aboutSettings.upsert({
    where: { key: 'singleton' },
    update: aboutUpdate,
    create: aboutSettings,
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _sId, ...svcUpdate } = servicesPageSettings
  await prisma.servicesPageSettings.upsert({
    where: { key: 'singleton' },
    update: svcUpdate,
    create: servicesPageSettings,
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _cId, ...contactPgUpdate } = contactSettings
  await prisma.contactSettings.upsert({
    where: { key: 'singleton' },
    update: contactPgUpdate,
    create: contactSettings,
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _tId, ...testimonialSettingsUpdate } = testimonialSettings
  await prisma.testimonialSettings.upsert({
    where: { key: 'singleton' },
    update: testimonialSettingsUpdate,
    create: testimonialSettings,
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _catId, ...categorySettingsUpdate } = categorySettings
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
  for (const cat of categories) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: cat, create: cat })
  }
  console.log(`   ✅ ${categories.length} categories`)

  for (const service of services) {
    await prisma.service.upsert({ where: { slug: service.slug }, update: service, create: service })
  }
  console.log(`   ✅ ${services.length} services`)

  await prisma.testimonial.deleteMany({ where: { id: { startsWith: 'testimonial-' } } })
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t })
  }
  console.log(`   ✅ ${testimonials.length} testimonials`)

  // 5. Gallery Images
  console.log('\n🖼️  Seeding Gallery Images...')
  let imageCount = 0
  for (const [categorySlug, images] of Object.entries(galleryImagesByCategorySlug)) {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
    if (!category) {
      console.warn(`   ⚠️  Category "${categorySlug}" not found`)
      continue
    }
    await prisma.categoryImage.deleteMany({ where: { categoryId: category.id } })
    for (const img of images) {
      await prisma.categoryImage.create({
        data: { url: img.url, publicId: img.publicId, order: img.order, categoryId: category.id },
      })
      imageCount++
    }
    console.log(`   ✅ ${images.length} images → ${categorySlug}`)
  }
  console.log(`   ✅ ${imageCount} total images`)

  // 6. Global Settings (Site + Email)
  console.log('\n🌍 Seeding Global Settings...')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _siteId, ...siteUpdate } = siteSettings
  await prisma.siteSettings.upsert({
    where: { key: 'singleton' },
    update: siteUpdate,
    create: siteSettings,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _emailId, ...emailUpdate } = emailSettings
  await prisma.emailSettings.upsert({
    where: { key: 'singleton' },
    update: emailUpdate,
    create: emailSettings,
  })
  console.log('   ✅ SiteSettings + EmailSettings')

  // 7. Pricing Tiers
  console.log('\n💰 Seeding Pricing Tiers...')
  await prisma.servicePricingTier.deleteMany({})
  let tierCount = 0
  for (const tier of pricingTiers) {
    const service = await prisma.service.findUnique({ where: { slug: tier.serviceSlug } })
    if (!service) {
      console.warn(`   ⚠️  Service "${tier.serviceSlug}" not found`)
      continue
    }
    await prisma.servicePricingTier.create({
      data: {
        serviceId: service.id,
        name: tier.name,
        price: tier.price,
        description: tier.description,
        sortOrder: tier.sortOrder,
      },
    })
    tierCount++
  }
  console.log(`   ✅ ${tierCount} pricing tiers`)

  // 8. Contacts & Bookings
  console.log('\n📋 Seeding CRM Data...')
  await prisma.contact.deleteMany({ where: { id: { startsWith: 'seed-contact-' } } })
  let contactCount = 0
  for (const c of contacts) {
    await prisma.contact.create({ data: c })
    contactCount++
  }
  console.log(`   ✅ ${contactCount} contacts`)

  await prisma.booking.deleteMany({ where: { id: { startsWith: 'seed-booking-' } } })
  let bookingCount = 0
  for (const b of bookings) {
    const service = await prisma.service.findUnique({ where: { slug: b.serviceSlug } })
    if (!service) {
      console.warn(`   ⚠️  Service "${b.serviceSlug}" not found`)
      continue
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { serviceSlug, ...bookingData } = b
    await prisma.booking.create({ data: { ...bookingData, serviceId: service.id } })
    bookingCount++
  }
  console.log(`   ✅ ${bookingCount} bookings`)

  // 9. App Release
  console.log('\n📱 Seeding App Release...')
  await prisma.appRelease.deleteMany({ where: { version: appReleases[0].version } })
  await prisma.appRelease.create({ data: appReleases[0] })
  console.log(`   ✅ v${appReleases[0].version}`)

  console.log('\n🎉 Seeding Completed Successfully!')
  console.log(
    `   📁 Categories: ${categories.length} (${categories.map((c) => c.name).join(', ')})`
  )
  console.log(`   🔗 Social links: ${socialLinks.length}`)
  console.log(`   💼 Services: ${services.length}`)
  console.log(`   💬 Testimonials: ${testimonials.length}`)
  console.log(`   🖼️ Images: ${imageCount}`)
  console.log(`   💰 Pricing tiers: ${tierCount}`)
  console.log(`   📋 Contacts: ${contactCount}`)
  console.log(`   📅 Bookings: ${bookingCount}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
