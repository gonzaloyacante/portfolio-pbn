/**
 * Theme Settings - Valores por defecto desde diseño de Canva
 * Portfolio Paola Bolívar Nievas
 */

export const themeDefaults = [
  // ========== COLORES ==========
  {
    key: 'color_background',
    category: 'colors',
    label: 'Color de Fondo Principal',
    value: '#fff1f9',
    type: 'hex',
    description: 'Color de fondo principal del sitio (rosa muy claro)',
    order: 1,
  },
  {
    key: 'color_primary',
    category: 'colors',
    label: 'Color Primario',
    value: '#ffaadd',
    type: 'hex',
    description: 'Color principal para títulos y elementos destacados',
    order: 2,
  },
  {
    key: 'color_text_primary',
    category: 'colors',
    label: 'Color de Texto Principal',
    value: '#6c0a0a',
    type: 'hex',
    description: 'Color para textos principales (granate oscuro)',
    order: 3,
  },
  {
    key: 'color_accent',
    category: 'colors',
    label: 'Color de Acento',
    value: '#7a2556',
    type: 'hex',
    description: 'Color de acento púrpura oscuro',
    order: 4,
  },
  {
    key: 'color_secondary',
    category: 'colors',
    label: 'Color Secundario',
    value: '#ffa1da',
    type: 'hex',
    description: 'Color rosa alternativo para variaciones',
    order: 5,
  },
  {
    key: 'color_dark',
    category: 'colors',
    label: 'Color Oscuro',
    value: '#511a3a',
    type: 'hex',
    description: 'Color púrpura más oscuro para contraste',
    order: 6,
  },

  // ========== TIPOGRAFÍA ==========
  {
    key: 'font_heading',
    category: 'typography',
    label: 'Fuente para Títulos',
    value: 'Aileron',
    type: 'font',
    description: 'Fuente principal para títulos y navegación',
    options: JSON.stringify([
      'Aileron',
      'Amsterdam Four',
      'Open Sans',
      'Arimo',
      'Montserrat',
      'Playfair Display',
      'Roboto',
      'Inter',
    ]),
    order: 10,
  },
  {
    key: 'font_heading_weight',
    category: 'typography',
    label: 'Peso de Fuente - Títulos',
    value: '700',
    type: 'select',
    description: 'Peso de la fuente para títulos',
    options: JSON.stringify([
      { label: 'Normal (400)', value: '400' },
      { label: 'Medium (500)', value: '500' },
      { label: 'Semi-Bold (600)', value: '600' },
      { label: 'Bold (700)', value: '700' },
      { label: 'Extra-Bold (800)', value: '800' },
    ]),
    order: 11,
  },
  {
    key: 'font_body',
    category: 'typography',
    label: 'Fuente para Textos',
    value: 'Open Sans',
    type: 'font',
    description: 'Fuente para párrafos y textos largos',
    options: JSON.stringify([
      'Open Sans',
      'Arimo',
      'Aileron',
      'Montserrat',
      'Roboto',
      'Inter',
      'Lato',
    ]),
    order: 12,
  },
  {
    key: 'font_script',
    category: 'typography',
    label: 'Fuente Script/Decorativa',
    value: 'Amsterdam Four',
    type: 'font',
    description: 'Fuente decorativa tipo script (ej: "Make-up")',
    options: JSON.stringify([
      'Amsterdam Four',
      'Pacifico',
      'Dancing Script',
      'Great Vibes',
      'Satisfy',
    ]),
    order: 13,
  },

  // ========== TAMAÑOS DE FUENTE ==========
  {
    key: 'font_size_hero',
    category: 'typography',
    label: 'Tamaño - Título Hero',
    value: '338',
    type: 'number',
    description: 'Tamaño en px del título principal hero (ej: "Portfolio")',
    order: 20,
  },
  {
    key: 'font_size_h1',
    category: 'typography',
    label: 'Tamaño - H1',
    value: '147',
    type: 'number',
    description: 'Tamaño en px para H1 (ej: "Make-up", "Paola Bolívar Nievas")',
    order: 21,
  },
  {
    key: 'font_size_h2',
    category: 'typography',
    label: 'Tamaño - H2',
    value: '82',
    type: 'number',
    description: 'Tamaño en px para H2',
    order: 22,
  },
  {
    key: 'font_size_h3',
    category: 'typography',
    label: 'Tamaño - H3',
    value: '28',
    type: 'number',
    description: 'Tamaño en px para H3 (títulos de sección)',
    order: 23,
  },
  {
    key: 'font_size_nav',
    category: 'typography',
    label: 'Tamaño - Navegación',
    value: '24',
    type: 'number',
    description: 'Tamaño en px para items de navegación',
    order: 24,
  },
  {
    key: 'font_size_body',
    category: 'typography',
    label: 'Tamaño - Texto Normal',
    value: '23',
    type: 'number',
    description: 'Tamaño en px para textos de párrafos',
    order: 25,
  },

  // ========== ESPACIADO ==========
  {
    key: 'spacing_section',
    category: 'spacing',
    label: 'Espaciado entre Secciones',
    value: '120',
    type: 'number',
    description: 'Espaciado vertical entre secciones principales (px)',
    order: 30,
  },
  {
    key: 'spacing_container',
    category: 'spacing',
    label: 'Padding del Contenedor',
    value: '108',
    type: 'number',
    description: 'Padding horizontal del contenedor principal (px)',
    order: 31,
  },
  {
    key: 'spacing_element',
    category: 'spacing',
    label: 'Espaciado entre Elementos',
    value: '40',
    type: 'number',
    description: 'Espaciado entre elementos relacionados (px)',
    order: 32,
  },

  // ========== LAYOUT ==========
  {
    key: 'layout_max_width',
    category: 'layout',
    label: 'Ancho Máximo del Contenedor',
    value: '1920',
    type: 'number',
    description: 'Ancho máximo del contenedor principal (px)',
    order: 40,
  },
  {
    key: 'layout_grid_columns',
    category: 'layout',
    label: 'Columnas de Grid - Proyectos',
    value: '3',
    type: 'select',
    description: 'Número de columnas para grid de proyectos (desktop)',
    options: JSON.stringify([
      { label: '2 columnas', value: '2' },
      { label: '3 columnas', value: '3' },
      { label: '4 columnas', value: '4' },
    ]),
    order: 41,
  },
  {
    key: 'layout_border_radius',
    category: 'layout',
    label: 'Radio de Bordes',
    value: '42',
    type: 'number',
    description: 'Radio de bordes para cards e imágenes (px)',
    order: 42,
  },

  // ========== EFECTOS Y ANIMACIONES ==========
  {
    key: 'effect_transition_duration',
    category: 'effects',
    label: 'Duración de Transiciones',
    value: '300',
    type: 'number',
    description: 'Duración de transiciones y animaciones (ms)',
    order: 50,
  },
  {
    key: 'effect_hover_scale',
    category: 'effects',
    label: 'Escala al Hover',
    value: '1.05',
    type: 'number',
    description: 'Factor de escala al hacer hover (ej: 1.05 = 5% más grande)',
    order: 51,
  },
]

export const pageContentDefaults = [
  // ========== HOME PAGE ==========
  {
    pageKey: 'home',
    sectionKey: 'hero',
    content: JSON.stringify({
      mainTitle: 'Portfolio',
      scriptTitle: 'Make-up',
      subtitle: 'Paola Bolívar Nievas',
      showImage: false,
    }),
  },

  // ========== ABOUT PAGE ==========
  {
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
    }),
  },

  // ========== PROJECTS PAGE ==========
  {
    pageKey: 'projects',
    sectionKey: 'hero',
    content: JSON.stringify({
      title: 'Proyectos',
      description: 'Explora mi trabajo en diferentes categorías',
      layout: 'grid',
    }),
  },

  // ========== CONTACT PAGE ==========
  {
    pageKey: 'contact',
    sectionKey: 'info',
    content: JSON.stringify({
      title: 'Contacto',
      description: 'Ponte en contacto conmigo',
      showContactForm: true,
      showImage: true,
      imageShape: 'circle',
    }),
  },
]
