import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Centro de Ayuda - Admin',
  description: 'Manual de usuario y guías para gestionar el portfolio',
}

interface TutorialSection {
  id: string
  icon: string
  title: string
  description: string
  steps: string[]
  tips?: string[]
}

const tutorials: TutorialSection[] = [
  {
    id: 'portfolio',
    icon: '🎨',
    title: 'Gestión del Portfolio',
    description: 'Aprende a crear, editar y organizar las categorías y sus galerías',
    steps: [
      'Ve a "Portfolio → Categorías" en el menú lateral',
      'Haz clic en "Nueva Categoría" para crear una desde cero',
      'Completa los campos: nombre y descripción (opcional)',
      'Sube imágenes a la galería de la categoría arrastrándolas o usando el botón de upload',
      'Reordena las fotos arrastrándolas con el mouse (la primera puede usarse como portada)',
      'Guarda los cambios haciendo clic en "Guardar"',
      'Para editar, haz clic en la categoría desde la lista y modifica lo que necesites',
    ],
    tips: [
      'Usa imágenes de alta calidad (mínimo 1200x800px) para mejor impacto visual',
      'La primera imagen de la galería se sugiere automáticamente como portada',
      'Puedes marcar una categoría como "Inactiva" si no quieres que se muestre temporalmente',
      'Las categorías eliminadas van a "Papelera" y pueden recuperarse durante 30 días',
    ],
  },
  {
    id: 'imagenes',
    icon: '🖼️',
    title: 'Manejo de Imágenes',
    description: 'Optimiza tus fotos para la mejor experiencia visual',
    steps: [
      'Prepara tus imágenes en formato JPG o PNG (recomendado: JPG para menor peso)',
      'Tamaño ideal: entre 1200x800px y 2400x1600px para balance calidad/velocidad',
      'Arrastra las imágenes a la zona de upload o haz clic para seleccionar',
      'Las imágenes se suben automáticamente a Cloudinary (optimización gratuita)',
      'Reordena arrastrando: la primera imagen puede usarse como portada de la categoría',
      'Para eliminar una imagen, haz clic en el ícono de basura',
    ],
    tips: [
      'Cloudinary optimiza automáticamente tus imágenes (convierte a WebP/AVIF)',
      'Puedes subir múltiples imágenes por categoría',
      'Si una imagen pesa más de 5MB, se comprimirá automáticamente sin perder calidad visible',
      'Las fotos borradas se eliminan de forma permanente de Cloudinary (no se pueden recuperar)',
    ],
  },
  {
    id: 'categorias',
    icon: '📁',
    title: 'Organización con Categorías',
    description: 'Clasifica tus trabajos para facilitar la navegación',
    steps: [
      'Ve a "Gestión → Categorías" en el menú',
      'Crea categorías como "Novia", "Editorial", "Social", "Caracterización", etc.',
      'Cada categoría tiene un nombre, descripción y su propia galería de imágenes',
      'El "slug" se genera automáticamente del nombre (ej: "Maquillaje de Novia" → "maquillaje-de-novia")',
      'Sube las imágenes directamente desde el formulario de edición de la categoría',
      'Las categorías se muestran como secciones en la página pública del portfolio',
    ],
    tips: [
      'Usa nombres cortos y descriptivos (máximo 3 palabras)',
      'Las categorías sin imágenes no se muestran en el sitio público',
      'Puedes eliminar una categoría aunque tenga imágenes (las imágenes también se eliminarán)',
    ],
  },
  {
    id: 'analitica',
    icon: '📊',
    title: 'Dashboard y Estadísticas',
    description: 'Comprende el comportamiento de tus visitantes',
    steps: [
      'Las estadísticas están integradas en el "Dashboard" (página de inicio del admin)',
      'Visualiza visitas totales, imágenes vistas y leads de los últimos 7 días',
      'El gráfico muestra la tendencia de visitas por día',
      'Consulta qué categorías son las más populares',
      'Ve qué dispositivos usan tus visitantes (móvil vs escritorio)',
    ],
    tips: [
      '"Visitas" cuenta cada vez que alguien accede a una página',
      '"Imágenes Vistas" son las veces que se abrió el detalle de una categoría',
      '"Leads" son los mensajes recibidos a través del formulario de contacto',
      'Las alertas te muestran mensajes sin leer, testimonios pendientes y papelera',
    ],
  },
  {
    id: 'contactos',
    icon: '📧',
    title: 'Gestión de Mensajes',
    description: 'Administra las consultas de clientes potenciales',
    steps: [
      'Ve a "Contactos" en el menú lateral',
      'Los mensajes nuevos aparecen con la etiqueta "Nuevo"',
      'Haz clic en un mensaje para ver el detalle completo (nombre, email, texto)',
      'Marca como "Leído" una vez que hayas revisado el mensaje',
      'Marca como "Respondido" después de contactar al cliente',
      'Usa las "Notas Internas" para recordar detalles de la conversación',
      'Filtra por "Todos", "No leídos" o "Respondidos" usando el selector superior',
    ],
    tips: [
      'Responde lo antes posible (idealmente en menos de 24 horas) para mejor conversión',
      'Las notas internas son privadas (el cliente nunca las ve)',
      'El sistema tiene protección anti-spam: solo 1 mensaje cada 15 min por IP',
      'Puedes eliminar mensajes de spam haciendo clic en el ícono de basura',
      'Usa la paginación (20 mensajes por página) para navegar si tienes muchos contactos',
    ],
  },
  {
    id: 'testimonios',
    icon: '⭐',
    title: 'Reseñas y Testimonios',
    description: 'Gestiona las opiniones de tus clientes satisfechos',
    steps: [
      'Ve a "Testimonios" en el menú lateral',
      'Puedes crear testimonios manualmente con nombre, texto y calificación',
      'Los clientes también pueden dejar testimonios desde la página "Sobre Mí"',
      'Los testimonios de clientes llegan como "inactivos" para tu revisión',
      'Activa los testimonios que quieras mostrar en el sitio público',
      'Elimina testimonios no deseados o spam',
    ],
    tips: [
      'Revisa el Dashboard para ver si hay testimonios pendientes de aprobación',
      'Los testimonios con 5 estrellas tienen mayor impacto visual',
      'Mantén un balance de testimonios de diferentes tipos de servicio',
      'Un buen testimonio tiene entre 50-150 palabras (no demasiado largo)',
    ],
  },
  {
    id: 'sobre-mi',
    icon: '👤',
    title: 'Página Sobre Mí',
    description: 'Edita tu presentación e imagen principal',
    steps: [
      'Ve a "Sobre Mí" en el menú lateral',
      'Sube tu imagen de inicio arrastrándola al área de upload',
      'Escribe tu texto de presentación personal',
      'Guarda los cambios para verlos en el sitio público',
    ],
    tips: [
      'Usa una foto profesional de alta calidad',
      'Escribe en primera persona para conectar mejor con los visitantes',
      'Menciona tu experiencia, especialidades y lo que te hace única',
    ],
  },
  {
    id: 'mi-cuenta',
    icon: '🔐',
    title: 'Mi Cuenta',
    description: 'Gestiona la seguridad de tu cuenta',
    steps: [
      'Ve a "Mi Cuenta" en el menú lateral',
      'Para cambiar tu contraseña, ingresa la contraseña actual',
      'Escribe la nueva contraseña (mínimo 8 caracteres)',
      'Confirma la nueva contraseña y guarda',
    ],
    tips: [
      'Usa contraseñas seguras con letras, números y símbolos',
      'Cambia tu contraseña regularmente por seguridad',
      'No compartas tu contraseña con nadie',
    ],
  },
  {
    id: 'datos-contacto',
    icon: '📞',
    title: 'Datos de Contacto',
    description: 'Configura tu información de contacto pública',
    steps: [
      'Ve a "Datos de Contacto" en el menú lateral',
      'Ingresa tu email, teléfono y ubicación',
      'Agrega tus redes sociales (Instagram, TikTok, WhatsApp)',
      'Esta información aparecerá en el pie de página y sección de contacto',
    ],
    tips: [
      'Usa el email profesional donde recibes consultas de clientes',
      'El formato de Instagram debe ser @tuusuario',
      'Para WhatsApp, usa el formato internacional (+34600000000)',
    ],
  },
  {
    id: 'papelera',
    icon: '🗑️',
    title: 'Papelera',
    description: 'Recupera elementos eliminados',
    steps: [
      'Ve a "Papelera" en el menú lateral',
      'Verás las categorías, servicios y otros elementos que has eliminado',
      'Puedes restaurar un elemento haciendo clic en "Restaurar"',
      'O eliminarlo permanentemente con "Eliminar"',
      'Los elementos se eliminan automáticamente después de 30 días',
    ],
    tips: [
      'Revisa la papelera antes de que pasen 30 días si necesitas recuperar algo',
      'La eliminación permanente no se puede deshacer',
      'Las imágenes también se eliminan al borrar permanentemente',
    ],
  },
]

const glossary = [
  {
    term: 'Slug',
    definition:
      'Versión limpia de un nombre para usar en URLs (ej: "Maquillaje Artístico" → "maquillaje-artistico")',
  },
  {
    term: 'Soft Delete',
    definition:
      'Eliminación suave: el registro se marca como "borrado" pero permanece en la base de datos durante 30 días (recuperable)',
  },
  {
    term: 'Cloudinary',
    definition:
      'Servicio de gestión de imágenes que optimiza automáticamente tus fotos (convierte a WebP/AVIF, comprime sin perder calidad)',
  },
  {
    term: 'Rate Limiting',
    definition:
      'Protección anti-spam que limita las acciones repetitivas (ej: solo 1 mensaje cada 15 minutos por IP)',
  },
  {
    term: 'Lead',
    definition:
      'Cliente potencial que envió un mensaje de consulta a través del formulario de contacto',
  },
  {
    term: 'PWA (Progressive Web App)',
    definition:
      'Aplicación web que se puede instalar en el celular como una app nativa y funciona sin conexión',
  },
  {
    term: 'Cache',
    definition:
      'Copia temporal de datos guardada localmente para cargar más rápido sin necesidad de internet',
  },
  {
    term: 'GDPR',
    definition:
      'Reglamento europeo de protección de datos personales (obliga a pedir consentimiento antes de procesar datos)',
  },
]

export default function AyudaPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-border bg-card rounded-3xl border p-8">
        <h1 className="text-foreground mb-4 text-4xl font-bold">📘 Centro de Ayuda</h1>
        <p className="text-foreground text-lg">
          Bienvenida al manual de usuario de tu portfolio. Aquí encontrarás guías paso a paso para
          gestionar todos los aspectos de tu sitio web profesional.
        </p>
      </div>

      {/* Tutoriales */}
      <div className="space-y-6">
        <h2 className="text-foreground text-2xl font-bold">🎓 Tutoriales Interactivos</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {tutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              className="border-border bg-card rounded-3xl border p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex items-start gap-3">
                <span className="text-4xl">{tutorial.icon}</span>
                <div>
                  <h3 className="text-foreground text-xl font-bold">{tutorial.title}</h3>
                  <p className="text-muted-foreground text-sm">{tutorial.description}</p>
                </div>
              </div>

              {/* Pasos */}
              <div className="mb-4">
                <h4 className="text-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                  Pasos a seguir
                </h4>
                <ol className="text-foreground space-y-2 text-sm">
                  {tutorial.steps.map((step, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-foreground font-bold">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {tutorial.tips && (
                <div className="border-primary/20 bg-primary/20 rounded-2xl border-l-4 p-4">
                  <h4 className="text-primary mb-2 flex items-center gap-2 text-sm font-semibold">
                    💡 Tips Profesionales
                  </h4>
                  <ul className="text-foreground space-y-1.5 text-xs">
                    {tutorial.tips.map((tip, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Glosario */}
      <div className="space-y-4">
        <h2 className="text-foreground text-2xl font-bold">📖 Glosario de Términos</h2>
        <div className="border-border bg-card rounded-3xl border p-6">
          <dl className="space-y-4">
            {glossary.map((entry, index) => (
              <div key={index} className="border-border border-b pb-4 last:border-0">
                <dt className="text-foreground mb-1 font-semibold">{entry.term}</dt>
                <dd className="text-foreground text-sm">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* FAQ Rápido */}
      <div className="space-y-4">
        <h2 className="text-foreground text-2xl font-bold">❓ Preguntas Frecuentes</h2>
        <div className="space-y-4">
          <details className="border-border group bg-card rounded-2xl border p-4">
            <summary className="text-foreground cursor-pointer font-semibold">
              ¿Puedo recuperar un elemento eliminado?
            </summary>
            <p className="text-foreground mt-2 text-sm">
              Sí, los elementos eliminados usan <strong>soft delete</strong> (eliminación suave).
              Permanecen en la base de datos durante 30 días y pueden ser restaurados desde la
              sección de &quot;Papelera&quot;.
            </p>
          </details>

          <details className="border-border group bg-card rounded-2xl border p-4">
            <summary className="text-foreground cursor-pointer font-semibold">
              ¿Cuántas imágenes puedo subir por categoría?
            </summary>
            <p className="text-foreground mt-2 text-sm">
              Puedes subir múltiples imágenes por categoría sin límite fijo. Las imágenes se
              optimizan automáticamente en Cloudinary.
            </p>
          </details>

          <details className="border-border group bg-card rounded-2xl border p-4">
            <summary className="text-foreground cursor-pointer font-semibold">
              ¿Qué tamaño de imagen es el ideal?
            </summary>
            <p className="text-foreground mt-2 text-sm">
              Lo ideal es <strong>1200x800px a 2400x1600px</strong>. Cloudinary optimizará
              automáticamente las imágenes para que carguen rápido sin perder calidad visual.
            </p>
          </details>

          <details className="border-border group bg-card rounded-2xl border p-4">
            <summary className="text-foreground cursor-pointer font-semibold">
              ¿Cómo instalo la app en mi celular?
            </summary>
            <p className="text-foreground mt-2 text-sm">
              Desde tu navegador móvil (Chrome/Safari), abre el sitio y toca el menú (⋮ o
              compartir). Selecciona
              <strong> &quot;Agregar a pantalla de inicio&quot;</strong>. La app se instalará como
              una aplicación nativa y funcionará sin conexión.
            </p>
          </details>

          <details className="border-border group bg-card rounded-2xl border p-4">
            <summary className="text-foreground cursor-pointer font-semibold">
              ¿Por qué no puedo eliminar una categoría?
            </summary>
            <p className="text-foreground mt-2 text-sm">
              Las categorías se pueden eliminar en cualquier momento. Sus imágenes también se
              eliminarán (con posibilidad de recuperarlas desde Papelera por 30 días).
            </p>
          </details>
        </div>
      </div>

      {/* Contacto de soporte */}
      <div className="bg-muted/50 rounded-3xl p-6">
        <h3 className="text-foreground mb-3 text-xl font-bold">🆘 ¿Necesitas ayuda adicional?</h3>
        <p className="text-foreground mb-4">
          Si tienes alguna pregunta técnica que no esté cubierta en este manual, no dudes en
          contactarnos:
        </p>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Email de Soporte:</strong>{' '}
            <a
              href="mailto:soporte@paolabolivar.com"
              className="text-primary underline hover:no-underline"
            >
              soporte@paolabolivar.com
            </a>
          </p>
          <p>
            <strong>Documentación Técnica:</strong>{' '}
            <Link href="/docs" className="text-primary underline hover:no-underline">
              Ver documentación completa
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
