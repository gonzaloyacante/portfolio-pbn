export const homeSettings = {
  id: 'default-home',
  heroTitle1: 'Make-up',
  heroTitle2: 'Portfolio',
  illustrationUrl:
    'https://res.cloudinary.com/demo/image/upload/v1/samples/woman-on-a-football-field.jpg', // Placeholder
  illustrationAlt: 'Ilustración maquilladora',
  ownerName: 'Paola Bolívar Nievas',
  heroMainImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/smile.jpg', // Placeholder
  heroMainImageAlt: 'Trabajo destacado',
  heroMainImageCaption: 'Editorial 2024',
  ctaText: 'Ver Portfolio',
  ctaLink: '/proyectos',
  showFeaturedProjects: true,
  featuredTitle: 'Trabajos Destacados',
  featuredCount: 6,
  isActive: true,
}

export const aboutSettings = {
  id: 'default-about',
  illustrationUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/bicycle.jpg', // Placeholder
  illustrationAlt: 'Ilustración sobre mí',
  bioTitle: 'Hola, soy Paola.',
  bioIntro:
    'Maquilladora especializada en audiovisuales, llevo formándome desde 2021 adquiriendo títulos como técnica en estética y belleza, y técnica en caracterización y maquillaje profesional.',
  bioDescription: `A lo largo de mis estudios y experiencia he trabajado en distintos entornos creativos que me han permitido desarrollar habilidades tanto en maquillaje social como en caracterización, efectos especiales, peluquería de plató y creación de personajes.

Mi meta es establecerme como maquilladora y caracterizadora profesional en la industria del cine y la televisión, contribuyendo a proyectos que inspiren y cautiven al público.

En este portfolio, encontrarás mis trabajos y proyectos, cada uno fruto de dedicación, creatividad y amor por mi profesión.`,
  profileImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg', // Placeholder should be Paola
  profileImageAlt: 'Paola Bolívar Nievas',
  skills: [
    'Caracterización',
    'Efectos Especiales',
    'Maquillaje Social',
    'Maquillaje Nupcial',
    'Bodypainting',
    'Aerografía',
    'Peluquería de plató',
  ],
  yearsExperience: 4,
  certifications: [
    'Técnica en Estética y Belleza',
    'Técnica en Caracterización y Maquillaje Profesional',
  ],
  showTestimonials: true,
  testimonialsTitle: 'Lo que dicen mis clientes',
  isActive: true,
}

export const contactSettings = {
  id: 'default-contact',
  pageTitle: 'Contacto',
  illustrationUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/animals/cat.jpg', // Placeholder
  illustrationAlt: 'Ilustración contacto',
  ownerName: 'Paola Bolívar Nievas',
  email: 'contacto@paolabolivar.com',
  phone: '+34 600 000 000',
  whatsapp: '+34600000000',
  location: 'Málaga, España',

  formTitle: 'Envíame un mensaje',
  nameLabel: 'Tu nombre',
  emailLabel: 'Tu email',
  phoneLabel: 'Tu teléfono (opcional)',
  messageLabel: 'Mensaje',
  preferenceLabel: '¿Cómo preferís que te contacte?',
  submitLabel: 'Enviar mensaje',

  successTitle: '¡Mensaje enviado!',
  successMessage: 'Gracias por contactarme. Te responderé lo antes posible.',
  sendAnotherLabel: 'Enviar otro mensaje',

  showSocialLinks: true,
  isActive: true,
}
