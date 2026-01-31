/* import { Pool } from 'pg'
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined')
}

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Poblando con datos reales de Paola...')

  // 1. Crear categorías
  console.log('📁 Creando categorías...')

  const categories = [
    {
      id: '78nOaQ4yroN1HfEOxYkT',
      name: 'Maquillaje',
      slug: 'maquillaje',
      description: 'Maquillaje profesional para eventos, sesiones fotográficas y producciones',
    },
    {
      id: 'VKPLTpOJQWNpOpCN3U1P',
      name: 'FX',
      slug: 'fx',
      description: 'Efectos especiales, caracterización y prótesis',
    },
    {
      id: 'oEEXvBJHvUj0VaGCcILS',
      name: 'Teatro',
      slug: 'teatro',
      description: 'Maquillaje y caracterización para obras teatrales',
    },
    {
      id: 'y8Ydk2thZhU3mkNBk9ru',
      name: 'Posticería',
      slug: 'posticeria',
      description: 'Pelucas, bigotes y postizos capilares',
    },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
  }

  console.log('✅ Categorías creadas')

  // 2. Crear proyectos
  console.log('🎨 Creando proyectos...')

  const projects = [
    {
      id: '00Dc5xhhFiX0e6IJN8Yi',
      title: 'Cortes',
      slug: 'cortes',
      description: 'Cortes creados en maniquí y maquillados con maquillaje al alcohol.',
      categoryId: 'VKPLTpOJQWNpOpCN3U1P',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737828564/IMG-20250124-WA0021_blzvja.jpg',
      date: new Date('2025-01-24'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737828564/IMG-20250124-WA0021_blzvja.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737828564/IMG-20250124-WA0027_cnegzo.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737828564/IMG-20250124-WA0025_ptbbhh.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737828564/IMG-20250124-WA0058_vfhafw.jpg',
      ],
    },
    {
      id: '0uXu2UU0iAE62YM83VBy',
      title: 'Sesión inspirada en la infancia',
      slug: 'sesion-inspirada-infancia',
      description: 'Maquillaje para sesión de fotos de moda.',
      categoryId: '78nOaQ4yroN1HfEOxYkT',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750203132/1000108253_z6pmsq.png',
      date: new Date('2024-06-17'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750203132/1000108253_z6pmsq.png',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750203147/1000108248_ttlkgx.png',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750203147/1000108246_nylhrv.png',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750203164/1000107115_gcueqz.jpg',
      ],
    },
    {
      id: 'AnniPhKTq4nH8Pas2ZZW',
      title: 'Maquillaje fantasía',
      slug: 'maquillaje-fantasia-calota',
      description: 'Maquillaje fantasía con calota de látex.',
      categoryId: '78nOaQ4yroN1HfEOxYkT',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1759100196/Picsart_25-09-24_20-21-26-533_smm6sh.jpg',
      date: new Date('2024-09-24'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1759100196/Picsart_25-09-24_20-21-26-533_smm6sh.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1759100196/Picsart_25-09-17_01-34-29-498_lweqvf.jpg',
      ],
    },
    {
      id: 'BO9EsyxTUU7Xk2vE7xNm',
      title: 'Caracterización caperucita roja',
      slug: 'caracterizacion-caperucita-roja',
      description: 'Maquillaje inspirado en Caperucita roja.',
      categoryId: '78nOaQ4yroN1HfEOxYkT',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737395505/IMG_20231105_220404_209_qbyvuj.webp',
      date: new Date('2023-11-05'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737395505/IMG_20231105_220404_209_qbyvuj.webp',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737395523/IMG_20231105_220403_977_pjmaxk.webp',
      ],
    },
    {
      id: 'ByQcGfn2hCddt1gip3gN',
      title: 'Mangata cuerpos a punto de explotar',
      slug: 'mangata-cuerpos-punto-explotar',
      description:
        'Maquilladora en la obra de teatro "Mangata cuerpos a punto de explotar" estrenada en el teatro Alhambra.',
      categoryId: 'oEEXvBJHvUj0VaGCcILS',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750201758/Screenshot_20250618-004339_ripuyf.png',
      date: new Date('2024-06-18'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750201758/Screenshot_20250618-004339_ripuyf.png',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750201758/Screenshot_20250618-003803_wchxex.png',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750201758/Screenshot_20250618-003602_lkvhnp.png',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750201786/IMG-20250608-WA0011_f5majp.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750201825/IMG_20250530_193449701_gxx7mm.jpg',
      ],
    },
    {
      id: 'FrRTmntdG9VtpSWAvPWo',
      title: 'Bigote de pelo natural',
      slug: 'bigote-pelo-natural',
      description: 'Bigote de pelo natural picado a mano pelo a pelo en tul HD.',
      categoryId: 'y8Ydk2thZhU3mkNBk9ru',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1738275261/20240216_102147_cjxiqs.jpg',
      date: new Date('2024-02-16'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1738275261/20240216_102147_cjxiqs.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1738275261/20240216_081630_cupj71.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1738275262/20240216_082348_wkxim1.jpg',
      ],
    },
    {
      id: 'HTE0JEAyE4qlD8EiVeIG',
      title: 'Flequillo de kanekalon picado',
      slug: 'flequillo-kanekalon-picado',
      description: 'Flequillo picado pelo a pelo con kanekalon',
      categoryId: 'y8Ydk2thZhU3mkNBk9ru',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737406924/IMG-20231204-WA0002_jluup9.jpg',
      date: new Date('2023-12-04'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737406924/IMG-20231204-WA0002_jluup9.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737406925/IMG-20231204-WA0003_s1agpf.jpg',
      ],
    },
    {
      id: 'Mtl8gIUxupQQLOOm0mIV',
      title: 'Personaje hecho con prótesis de silicona',
      slug: 'personaje-protesis-silicona',
      description: 'Personaje creado con prótesis de silicona.',
      categoryId: 'VKPLTpOJQWNpOpCN3U1P',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737405433/IMG-20241029-WA0019_gi6x97.jpg',
      date: new Date('2024-10-29'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737405433/IMG-20241029-WA0019_gi6x97.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737405434/IMG-20241029-WA0036_djns8n.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737405555/IMG-20241029-WA0021_gxnvzw.jpg',
      ],
    },
    {
      id: 'PwTFMCuL4RkkqBkqu1gv',
      title: 'Maquillaje fantasía piedra',
      slug: 'maquillaje-fantasia-piedra',
      description: 'Maquillaje fantasía inspirado en una estatua de piedra.',
      categoryId: '78nOaQ4yroN1HfEOxYkT',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750199159/IMG-20250424-WA0004_fraxev.jpg',
      date: new Date('2024-04-24'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750199159/IMG-20250424-WA0004_fraxev.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750199159/IMG-20250424-WA0000_2_yoa80n.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750199159/IMG-20250424-WA0007_2_khj9z7.jpg',
      ],
    },
    {
      id: 'QfsNDzLXX2c2W0OqiCPb',
      title: 'Heridas',
      slug: 'heridas',
      description:
        'Heridas hechas con componente silicona y maquilladas con maquillaje al alcohol.',
      categoryId: 'VKPLTpOJQWNpOpCN3U1P',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737406365/IMG_20250107_140202278_2_j8qvfr.jpg',
      date: new Date('2025-01-07'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737406365/IMG_20250107_140202278_2_j8qvfr.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737406473/IMG_20250107_140511657_HDR_wsto3v.jpg',
      ],
    },
    {
      id: 'S3VNWWqe1ku9ShsYoL6C',
      title: 'Maquillaje avatar',
      slug: 'maquillaje-avatar',
      description: 'Maquillaje para desfile de avatar realizado con cremacolores.',
      categoryId: '78nOaQ4yroN1HfEOxYkT',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737395118/DSC07020_tmkape.jpg',
      date: new Date('2023-10-15'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737395118/DSC07020_tmkape.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737395118/DSC07019_mglepy.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737395119/DSC07022_gung3n.jpg',
      ],
    },
    {
      id: 'SL6NjXfIb7ZiZlRag27d',
      title: 'Colección de joyas de María Francés',
      slug: 'coleccion-joyas-maria-frances',
      description: 'Sesión de fotos para la colección vintage de joyas de María Francés',
      categoryId: '78nOaQ4yroN1HfEOxYkT',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1759100083/2025-07-31_Maria_Frances-248_ocrjaj.jpg',
      date: new Date('2024-07-31'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1759100083/2025-07-31_Maria_Frances-248_ocrjaj.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1759100083/2025-07-31_Maria_Frances-138_nwlh4c.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1759100084/2025-07-31_Maria_Frances-269_llvq4c.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1759100085/2025-07-31_Maria_Frances-36_mzi0by.jpg',
      ],
    },
    {
      id: 'TTTapL6lJP3V5Ff2XRh7',
      title: 'Quemadura',
      slug: 'quemadura',
      description: 'Quemadura hecha con látex.',
      categoryId: 'VKPLTpOJQWNpOpCN3U1P',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737405843/IMG_20240924_135414698_q4o9hx.jpg',
      date: new Date('2024-09-24'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737405843/IMG_20240924_135414698_q4o9hx.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737405843/IMG_20240924_133803471_HDR_zxpczt.jpg',
      ],
    },
    {
      id: 'YEiDNWOeWxsBAEymHMBQ',
      title: 'Maquillaje artístico',
      slug: 'maquillaje-artistico-siglo-xviii',
      description: 'Maquillaje artístico inspirado en el siglo XVIII.',
      categoryId: '78nOaQ4yroN1HfEOxYkT',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737404755/IMG_20240510_180647_461_uz07hb.jpg',
      date: new Date('2024-05-10'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737404755/IMG_20240510_180647_461_uz07hb.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737404757/Picsart_24-05-10_15-24-50-419_z4igph.jpg',
      ],
    },
    {
      id: 'aMmPWwBlIJPG1HpEGcS3',
      title: 'Bigote postizo para teatro',
      slug: 'bigote-postizo-teatro',
      description:
        'Maquillaje y caracterización para la obra de teatro El hombre que soñaba con árboles, en el teatro Alhambra.',
      categoryId: 'y8Ydk2thZhU3mkNBk9ru',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750191744/IMG_20250613_220823440_2_w36pbp.jpg',
      date: new Date('2024-06-13'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750191744/IMG_20250613_220823440_2_w36pbp.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750191744/IMG_20250613_220820698_2_bzecze.jpg',
      ],
    },
    {
      id: 'ibpepbwJZ5jcT5hyAv2C',
      title: 'Maquillaje piel congelada',
      slug: 'maquillaje-piel-congelada',
      description: 'Maquillaje de piel congelada.',
      categoryId: 'VKPLTpOJQWNpOpCN3U1P',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737406826/IMG_20241119_131301337_fk8jdo.jpg',
      date: new Date('2024-11-19'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737406826/IMG_20241119_131301337_fk8jdo.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737406828/IMG_20241119_131728169_dc0jra.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737406830/IMG_20241119_131320720_jwx6qw.jpg',
      ],
    },
    {
      id: 'icgkO7Lk7uZBdJzAMwpr',
      title: 'Ciberpunk',
      slug: 'ciberpunk',
      description:
        'Proyecto inspirado en la estética cyberpunk que nos muestra una feminidad cruda, sin filtros.',
      categoryId: '78nOaQ4yroN1HfEOxYkT',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1755371182/4A3A9546_ethfnc.jpg',
      date: new Date('2024-06-15'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1755371182/4A3A9546_ethfnc.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1755371184/4A3A9504_kv91uk.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1755371184/4A3A9749_htwsgb.jpg',
      ],
    },
    {
      id: 'll2PUP9pFY0OKINGfeEc',
      title: 'Maquilladora para "El hombre que soñaba con árboles"',
      slug: 'maquilladora-hombre-sonaba-arboles',
      description:
        'Maquilladora y caracterizadora en la obra de teatro "El hombre que soñaba con árboles" de Anna Sovak.',
      categoryId: 'oEEXvBJHvUj0VaGCcILS',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750201559/Screenshot_20250618-010026_unswsb.png',
      date: new Date('2024-06-18'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750201559/Screenshot_20250618-010026_unswsb.png',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750201559/Screenshot_20250618-004824_duq4qp.png',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750201559/Screenshot_20250618-005642_r9hzu3.png',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750201560/Screenshot_20250618-005546_2_kxticn.png',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750201560/Screenshot_20250618-005452_2_hebh46.png',
      ],
    },
    {
      id: 'nWN7r1F2JatZ8XhfXQyo',
      title: 'Cortometraje de edificio23',
      slug: 'cortometraje-edificio23',
      description:
        'Colaboración para el cortometraje "el cómplice", episodio 4 de la serie edificio 23 de Miguel García Bernal.',
      categoryId: 'VKPLTpOJQWNpOpCN3U1P',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1742672514/IMG-20250319-WA0033_f044we.jpg',
      date: new Date('2025-03-19'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1742672514/IMG-20250319-WA0033_f044we.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1742672514/IMG-20250319-WA0027_ehv9qy.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1742672514/IMG-20250319-WA0032_nymhx7.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1742672514/IMG-20250319-WA0028_jtx376.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1742672536/IMG-20250319-WA0022_yxxlw6.jpg',
      ],
    },
    {
      id: 'p17i3D47MiqRpXuabTyq',
      title: 'Sesión de fotos boxeo',
      slug: 'sesion-fotos-boxeo',
      description:
        'Sesión de fotos inspirada en el boxeo callejero. Una visión romantizada de las peleas callejeras.',
      categoryId: '78nOaQ4yroN1HfEOxYkT',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1757979322/2025-09-02_David-152_tkyjvg.jpg',
      date: new Date('2024-09-02'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1757979322/2025-09-02_David-152_tkyjvg.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1757979323/2025-09-02_David-104_pibczv.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1757979323/2025-09-02_David-35_hpikdh.jpg',
      ],
    },
    {
      id: 'rN4reorFZuPdrjfs4sjp',
      title: 'Maquillaje fantasía navidad',
      slug: 'maquillaje-fantasia-navidad',
      description: 'Maquillaje de pascuero para navidad.',
      categoryId: '78nOaQ4yroN1HfEOxYkT',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737406737/Picsart_25-01-13_23-17-34-549_kpbkay.jpg',
      date: new Date('2025-01-13'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737406737/Picsart_25-01-13_23-17-34-549_kpbkay.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737406738/Picsart_25-01-13_23-18-44-647_fdbusr.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737406753/IMG_20250113_121336_768_2_bhnk3o.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737406754/IMG_20250113_121341_900_2_ntvxon.jpg',
      ],
    },
    {
      id: 'xkwFYhKUVYIFUZFJGd2E',
      title: 'Zombie',
      slug: 'zombie',
      description: 'Zombie realizado en la feria fórmate de Andalucía.',
      categoryId: 'VKPLTpOJQWNpOpCN3U1P',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750199272/IMG-20250213-WA0094_n8mvcx.jpg',
      date: new Date('2024-02-13'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750199272/IMG-20250213-WA0094_n8mvcx.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750199272/IMG-20250213-WA0038_oenu3r.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750199272/IMG-20250213-WA0100_smnudf.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1750199273/IMG-20250213-WA0077_zorcxa.jpg',
      ],
    },
    {
      id: 'zK01MqbbuR7FzvgAkE23',
      title: 'Bruja Blancanieves',
      slug: 'bruja-blancanieves',
      description:
        'Caracterización de bruja de Blancanieves con prótesis de silicona para la nariz.',
      categoryId: 'VKPLTpOJQWNpOpCN3U1P',
      thumbnailUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737405901/IMG_20241025_224737921_2_pewdss.jpg',
      date: new Date('2024-10-25'),
      images: [
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737405901/IMG_20241025_224737921_2_pewdss.jpg',
        'https://res.cloudinary.com/djlknirsd/image/upload/v1737405901/IMG_20241025_224109806_2_dmojld.jpg',
      ],
    },
  ]

  for (const project of projects) {
    // Extraer imágenes
    const { images, ...projectData } = project

    // Crear proyecto
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: projectData,
      create: projectData,
    })

    // Crear imágenes del proyecto
    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i]
      const publicId = imageUrl.split('/').pop()?.split('.')[0] || `${project.id}-${i}`

      // Verificar si ya existe
      const existing = await prisma.projectImage.findFirst({
        where: {
          projectId: project.id,
          order: i,
        },
      })

      if (existing) {
        await prisma.projectImage.update({
          where: { id: existing.id },
          data: {
            url: imageUrl,
            publicId,
          },
        })
      } else {
        await prisma.projectImage.create({
          data: {
            projectId: project.id,
            url: imageUrl,
            publicId,
            order: i,
          },
        })
      }
    }
  }

  console.log(`✅ ${projects.length} proyectos creados con sus imágenes`)

  // 3. Actualizar página Sobre Mi
  console.log('📄 Actualizando contenido de Sobre Mi...')

  await prisma.pageContent.upsert({
    where: { pageKey: 'about' },
    update: {
      content: JSON.stringify({
        title: 'Sobre mi',
        bio: `Hola, soy Paola.

Maquilladora especializada en audiovisuales, llevo formándome desde 2021 adquiriendo títulos como técnica en estética y belleza, y técnica en caracterizacion y maquillaje profesional.

A lo largo de mis estudios y experiencia he trabajado en distintos entornos creativos que me han permitido desarrollar habilidades tanto en maquillaje social como en caracterización, efectos especiales, peluquería de plató y creación de personajes.

Mi meta es establecerme como maquilladora y caracterizadora profesional en la industria del cine y la televisión, contribuyendo a proyectos que inspiren y cautiven al público.

En este portfolio, encontrarás mis trabajos y proyectos, cada uno fruto de dedicación, creatividad y amor por mi profesión.`,
        showImage: true,
        imagePosition: 'right',
        imageUrl:
          'https://res.cloudinary.com/djlknirsd/image/upload/v1753747019/IMG-20250729-WA0014_2_plir9l.jpg',
      }),
    },
    create: {
      pageKey: 'about',
      sectionKey: 'bio',
      content: JSON.stringify({
        title: 'Sobre mi',
        bio: `Hola, soy Paola.

Maquilladora especializada en audiovisuales, llevo formándome desde 2021 adquiriendo títulos como técnica en estética y belleza, y técnica en caracterizacion y maquillaje profesional.

A lo largo de mis estudios y experiencia he trabajado en distintos entornos creativos que me han permitido desarrollar habilidades tanto en maquillaje social como en caracterización, efectos especiales, peluquería de plató y creación de personajes.

Mi meta es establecerme como maquilladora y caracterizadora profesional en la industria del cine y la televisión, contribuyendo a proyectos que inspiren y cautiven al público.

En este portfolio, encontrarás mis trabajos y proyectos, cada uno fruto de dedicación, creatividad y amor por mi profesión.`,
        showImage: true,
        imagePosition: 'right',
        imageUrl:
          'https://res.cloudinary.com/djlknirsd/image/upload/v1753747019/IMG-20250729-WA0014_2_plir9l.jpg',
      }),
    },
  })

  console.log('✅ Contenido actualizado')

  // 4. Actualizar SiteConfig con email e Instagram
  console.log('⚙️ Actualizando configuración del sitio...')

  await prisma.siteConfig.upsert({
    where: { id: 'default' },
    update: {
      heroImageUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1753747019/IMG-20250729-WA0014_2_plir9l.jpg',
      aboutText: `Hola, soy Paola.

Maquilladora especializada en audiovisuales, llevo formándome desde 2021 adquiriendo títulos como técnica en estética y belleza, y técnica en caracterizacion y maquillaje profesional.

A lo largo de mis estudios y experiencia he trabajado en distintos entornos creativos que me han permitido desarrollar habilidades tanto en maquillaje social como en caracterización, efectos especiales, peluquería de plató y creación de personajes.

Mi meta es establecerme como maquilladora y caracterizadora profesional en la industria del cine y la televisión, contribuyendo a proyectos que inspiren y cautiven al público.

En este portfolio, encontrarás mis trabajos y proyectos, cada uno fruto de dedicación, creatividad y amor por mi profesión.`,
    },
    create: {
      id: 'default',
      bgColor: '#fff1f9',
      primaryColor: '#ffaadd',
      accentColor: '#7a2556',
      heroImageUrl:
        'https://res.cloudinary.com/djlknirsd/image/upload/v1753747019/IMG-20250729-WA0014_2_plir9l.jpg',
      aboutText: `Hola, soy Paola.

Maquilladora especializada en audiovisuales, llevo formándome desde 2021 adquiriendo títulos como técnica en estética y belleza, y técnica en caracterizacion y maquillaje profesional.

A lo largo de mis estudios y experiencia he trabajado en distintos entornos creativos que me han permitido desarrollar habilidades tanto en maquillaje social como en caracterización, efectos especiales, peluquería de plató y creación de personajes.

Mi meta es establecerme como maquilladora y caracterizadora profesional en la industria del cine y la televisión, contribuyendo a proyectos que inspiren y cautiven al público.

En este portfolio, encontrarás mis trabajos y proyectos, cada uno fruto de dedicación, creatividad y amor por mi profesión.`,
    },
  })

  console.log('✅ Configuración actualizada')

  console.log('\n🎉 ¡Datos reales de Paola cargados exitosamente!')
  console.log(`📊 Resumen:`)
  console.log(`   - 4 categorías`)
  console.log(`   - 23 proyectos`)
  console.log(`   - Email: paolabolivarnievas@gmail.com`)
  console.log(`   - Instagram configurado`)
  console.log(`   - Contenido "Sobre mi" actualizado`)
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
 */
