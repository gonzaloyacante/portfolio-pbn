// ============================================
// SETTINGS SEED DATA - Based on Prisma Schema
// Updated with real Paola data
// ============================================

export const homeSettings = {
  id: 'default-home',

  // Hero Title 1 ("Make-up")
  heroTitle1Text: 'Make-up',
  heroTitle1Font: null, // Inherits from theme
  heroTitle1FontUrl: null,
  heroTitle1FontSize: 112,
  heroTitle1Color: null, // Inherits --primary
  heroTitle1ColorDark: null,
  heroTitle1ZIndex: 20,
  heroTitle1OffsetX: 0,
  heroTitle1OffsetY: 0,

  // Hero Title 2 ("Portfolio")
  heroTitle2Text: 'Portfolio',
  heroTitle2Font: null,
  heroTitle2FontUrl: null,
  heroTitle2FontSize: 96,
  heroTitle2Color: null,
  heroTitle2ColorDark: null,
  heroTitle2ZIndex: 10,
  heroTitle2OffsetX: 0,
  heroTitle2OffsetY: 0,

  // Owner Name ("Paola Bolívar Nievas")
  ownerNameText: 'Paola Bolívar Nievas',
  ownerNameFont: null,
  ownerNameFontUrl: null,
  ownerNameFontSize: 36,
  ownerNameColor: null,
  ownerNameColorDark: null,
  ownerNameZIndex: 15,
  ownerNameOffsetX: 0,
  ownerNameOffsetY: 0,

  // Hero Main Image (to be set via admin)
  heroMainImageUrl: null,
  heroMainImageAlt: 'Trabajo destacado',
  heroMainImageCaption: null,
  heroImageStyle: 'original',
  heroMainImageZIndex: 5,
  heroMainImageOffsetX: 0,
  heroMainImageOffsetY: 0,

  // Illustration (to be set via admin)
  illustrationUrl: null,
  illustrationAlt: 'Ilustración maquilladora',
  illustrationZIndex: 10,
  illustrationOpacity: 100,
  illustrationSize: 100,
  illustrationOffsetX: 0,
  illustrationOffsetY: 0,
  illustrationRotation: 0,

  // CTA Button
  ctaText: 'Ver Portfolio',
  ctaLink: '/proyectos',
  ctaFont: null,
  ctaFontUrl: null,
  ctaFontSize: 16,
  ctaVariant: 'default',
  ctaSize: 'default',
  ctaOffsetX: 0,
  ctaOffsetY: 0,

  // Featured Projects Section
  showFeaturedProjects: true,
  featuredTitle: 'Trabajos Destacados',
  featuredTitleFont: null,
  featuredTitleFontUrl: null,
  featuredTitleFontSize: 32,
  featuredTitleColor: null,
  featuredTitleColorDark: null,
  featuredCount: 6,

  isActive: true,
}

export const aboutSettings = {
  id: 'default-about',

  // Illustration (to be set via admin)
  illustrationUrl: null,
  illustrationAlt: 'Ilustración sobre mí',

  // Bio - Real Paola content
  bioTitle: 'Hola, soy Paola.',
  bioIntro:
    'Maquilladora especializada en audiovisuales, llevo formándome desde 2021 adquiriendo títulos como técnica en estética y belleza, y técnica en caracterización y maquillaje profesional.',
  bioDescription: `A lo largo de mis estudios y experiencia he trabajado en distintos entornos creativos que me han permitido desarrollar habilidades tanto en maquillaje social como en caracterización, efectos especiales, peluquería de plató y creación de personajes.

Mi meta es establecerme como maquilladora y caracterizadora profesional en la industria del cine y la televisión, contribuyendo a proyectos que inspiren y cautiven al público.

En este portfolio, encontrarás mis trabajos y proyectos, cada uno fruto de dedicación, creatividad y amor por mi profesión.`,

  // Profile Image (to be set via admin)
  profileImageUrl: null,
  profileImageAlt: 'Paola Bolívar Nievas',

  // Skills - Real skills
  skills: [
    'Caracterización',
    'Efectos Especiales',
    'Maquillaje Social',
    'Maquillaje Editorial',
    'Bodypainting',
    'Posticería',
    'Peluquería de plató',
  ],
  yearsExperience: 4,

  // Certifications - Real certifications
  certifications: [
    'Técnica en Estética y Belleza',
    'Técnica en Caracterización y Maquillaje Profesional',
  ],

  isActive: true,
}

export const contactSettings = {
  id: 'default-contact',

  // Page Title
  pageTitle: 'Contacto',

  // Illustration (to be set via admin)
  illustrationUrl: null,
  illustrationAlt: 'Ilustración contacto',

  // Owner Info - Real data
  ownerName: 'Paola Bolívar Nievas',

  // Contact Info - Real data (update with actual values in .env)
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'paolabolivarnievas@gmail.com',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+34 600 000 000',
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '+34600000000',
  location: 'Málaga, España',

  // Form Configuration
  formTitle: 'Envíame un mensaje',
  nameLabel: 'Tu nombre',
  emailLabel: 'Tu email',
  phoneLabel: 'Tu teléfono (opcional)',
  messageLabel: 'Mensaje',
  preferenceLabel: '¿Cómo prefieres que te contacte?',
  submitLabel: 'Enviar mensaje',

  // Success Messages
  successTitle: '¡Mensaje enviado!',
  successMessage: 'Gracias por contactarme. Te responderé lo antes posible.',
  sendAnotherLabel: 'Enviar otro mensaje',

  // Show Social Links
  showSocialLinks: true,

  isActive: true,
}

export const testimonialSettings = {
  id: 'default-testimonials',
  showOnAbout: true,
  title: 'Lo que dicen mis clientes',
  maxDisplay: 6,
  isActive: true,
}

export const projectSettings = {
  id: 'default-projects',
  showCardTitles: true,
  showCardCategory: true,
  gridColumns: 3,
  isActive: true,
}

export const categorySettings = {
  id: 'default-categories',
  showDescription: true,
  showProjectCount: true,
  gridColumns: 4,
  isActive: true,
}
