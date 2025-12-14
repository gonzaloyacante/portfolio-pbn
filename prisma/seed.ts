import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { themeDefaults, pageContentDefaults } from './seeds/theme-defaults'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Crear usuario admin
  const email = 'admin@example.com'
  const password = await bcrypt.hash('admin123', 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  console.log('✅ Usuario admin creado:', { email: user.email })

  // 2. Crear theme settings por defecto
  console.log('🎨 Creando configuración de tema...')

  for (const setting of themeDefaults) {
    await prisma.themeSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        ...setting,
        isActive: true,
      },
    })
  }

  console.log(`✅ ${themeDefaults.length} configuraciones de tema creadas`)

  // 3. Crear page content por defecto
  console.log('📄 Creando contenido de páginas...')

  for (const page of pageContentDefaults) {
    await prisma.pageContent.upsert({
      where: { pageKey: page.pageKey },
      update: {},
      create: {
        ...page,
        isActive: true,
      },
    })
  }

  console.log(`✅ ${pageContentDefaults.length} páginas configuradas`)

  console.log('🎉 Seeding completado exitosamente!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
