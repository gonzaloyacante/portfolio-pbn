import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes (opcional - comentar si no quieres limpiar)
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.projectCategory.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.portfolioSettings.deleteMany();
  await prisma.user.deleteMany();

  // 1. Crear usuario administrador
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'Admin123!',
    10
  );
  
  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@paolabolivar.com',
      password: adminPassword,
      name: process.env.ADMIN_NAME || 'Paola Bolívar Nievas',
      role: 'ADMIN',
    },
  });
  console.log('✅ Usuario admin creado:', admin.email);

  // 2. Crear categorías de proyectos
  const categories = await prisma.projectCategory.createMany({
    data: [
      {
        slug: 'sesiones-de-fotos',
        name: 'Sesiones de fotos',
        description: 'Sesiones fotográficas profesionales de maquillaje',
        order: 1,
      },
      {
        slug: 'fx',
        name: 'FX',
        description: 'Efectos especiales y maquillaje artístico',
        order: 2,
      },
      {
        slug: 'teatro',
        name: 'Teatro',
        description: 'Maquillaje para producciones teatrales',
        order: 3,
      },
      {
        slug: 'maquillaje-fantasia',
        name: 'Maquillaje fantasía',
        description: 'Diseños creativos y fantásticos',
        order: 4,
      },
      {
        slug: 'rodajes',
        name: 'Rodajes',
        description: 'Maquillaje para cine y televisión',
        order: 5,
      },
      {
        slug: 'maquillaje-social',
        name: 'Maquillaje social',
        description: 'Maquillaje para eventos y ocasiones especiales',
        order: 6,
      },
    ],
  });
  console.log('✅ Categorías creadas:', categories.count);

  // 3. Crear skills/habilidades
  const skills = await prisma.skill.createMany({
    data: [
      {
        name: 'Maquillaje Social',
        description: 'Experta en maquillaje para eventos y celebraciones',
        level: 95,
        icon: '💄',
        order: 1,
      },
      {
        name: 'Caracterización',
        description: 'Transformación de personajes para audiovisuales',
        level: 90,
        icon: '🎭',
        order: 2,
      },
      {
        name: 'Efectos Especiales',
        description: 'FX profesional para cine y teatro',
        level: 85,
        icon: '✨',
        order: 3,
      },
      {
        name: 'Peluquería de Plató',
        description: 'Estilismo capilar para producciones',
        level: 80,
        icon: '💇',
        order: 4,
      },
      {
        name: 'Cine & TV',
        description: 'Experiencia en producciones audiovisuales',
        level: 88,
        icon: '🎬',
        order: 5,
      },
      {
        name: 'Creación de Personajes',
        description: 'Diseño y ejecución de looks únicos',
        level: 92,
        icon: '🎨',
        order: 6,
      },
    ],
  });
  console.log('✅ Skills creadas:', skills.count);

  // 4. Crear enlaces de redes sociales
  const socialLinks = await prisma.socialLink.createMany({
    data: [
      {
        platform: 'INSTAGRAM',
        url: 'https://instagram.com/paolabolivarnievas',
        label: '@paolabolivarnievas',
        icon: 'instagram',
        order: 1,
      },
      {
        platform: 'TIKTOK',
        url: 'https://tiktok.com/@paolabolivarnievas',
        label: '@paolabolivarnievas',
        icon: 'tiktok',
        order: 2,
      },
      {
        platform: 'LINKEDIN',
        url: 'https://linkedin.com/in/paolabolivarnievas',
        label: 'Paola Bolívar Nievas',
        icon: 'linkedin',
        order: 3,
      },
      {
        platform: 'WHATSAPP',
        url: 'https://wa.me/34123456789',
        label: '+34 123 456 789',
        icon: 'whatsapp',
        order: 4,
      },
    ],
  });
  console.log('✅ Redes sociales creadas:', socialLinks.count);

  // 5. Crear configuración del portfolio (singleton)
  await prisma.portfolioSettings.create({
    data: {
      id: 'singleton',
      siteName: 'Paola Bolívar Nievas',
      siteDescription:
        'Maquilladora profesional especializada en audiovisuales, cine, televisión y eventos. Transformo visiones en realidad a través del arte del maquillaje.',
      siteUrl: 'https://portfolio-pbn.vercel.app',
      ownerName: 'Paola Bolívar Nievas',
      ownerTitle: 'Maquilladora Profesional',
      ownerBio:
        'Maquilladora profesional con más de 5 años de experiencia en la industria audiovisual. Especializada en caracterización, efectos especiales y maquillaje social. He trabajado en más de 50 proyectos de cine, televisión, teatro y eventos.',
      ownerEmail: 'paola@example.com',
      ownerPhone: '+34 123 456 789',
      ownerLocation: 'Madrid, España',
      logoUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proyecto%20%2820250922053728%29-G0TPYQ1DpNcU4y9B5b8BwSdn7WALr3.webp',
      faviconUrl: null,
      ogImageUrl:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/makeup-photography-session-ZYS4gvyxpq5VhSuQhUnCOfntUBOIKF.jpg',
      metaKeywords:
        'maquillaje profesional, maquilladora, audiovisuales, caracterización, efectos especiales, FX, cine, televisión, teatro, Madrid',
      googleAnalyticsId: null,
      facebookPixelId: null,
      maintenanceMode: false,
    },
  });
  console.log('✅ Configuración del portfolio creada');

  // 6. Crear un proyecto de ejemplo
  const sesionesCategory = await prisma.projectCategory.findUnique({
    where: { slug: 'sesiones-de-fotos' },
  });

  if (sesionesCategory) {
    const exampleProject = await prisma.project.create({
      data: {
        slug: 'sesion-editorial-2024',
        title: 'Sesión Editorial 2024',
        description:
          'Sesión fotográfica editorial con maquillaje creativo y caracterización. Proyecto colaborativo con fotógrafos profesionales para revista de moda.',
        shortDescription: 'Maquillaje editorial creativo para sesión de moda',
        thumbnailUrl:
          'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/makeup-photography-session-ZYS4gvyxpq5VhSuQhUnCOfntUBOIKF.jpg',
        featured: true,
        order: 1,
        status: 'PUBLISHED',
        categoryId: sesionesCategory.id,
        images: {
          create: [
            {
              url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/makeup-photography-session-ZYS4gvyxpq5VhSuQhUnCOfntUBOIKF.jpg',
              alt: 'Maquillaje editorial - Imagen 1',
              order: 1,
            },
            {
              url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proyecto%20%2820250922053728%29-G0TPYQ1DpNcU4y9B5b8BwSdn7WALr3.webp',
              alt: 'Maquillaje editorial - Imagen 2',
              order: 2,
            },
          ],
        },
      },
    });
    console.log('✅ Proyecto de ejemplo creado:', exampleProject.title);
  }

  console.log('');
  console.log('🎉 Seed completado exitosamente!');
  console.log('');
  console.log('📝 Credenciales de admin:');
  console.log('   Email:', admin.email);
  console.log('   Password:', process.env.ADMIN_PASSWORD || 'Admin123!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
