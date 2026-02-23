import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad - Portfolio Paola Bolívar',
  description:
    'Política de privacidad y protección de datos personales del portfolio de Paola Bolívar Nievas',
}

import { getContactSettings } from '@/actions/settings/contact'

export default async function PrivacyPage() {
  // Fetch dynamic contact info
  const contactSettings = await getContactSettings()
  const { email, location, ownerName, phone } = contactSettings ?? {
    email: 'admin@paolabolivar.com',
    location: 'Granada, España',
    ownerName: 'Paola Bolívar Nievas',
    phone: '',
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-primary text-foreground mb-8 text-4xl font-bold">
        Política de Privacidad
      </h1>

      <div className="text-foreground space-y-8">
        {/* Introducción */}
        <section>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">1. Información General</h2>
          <p className="leading-relaxed">
            En cumplimiento de la normativa vigente en materia de protección de datos personales, el
            Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo de 27 de abril de 2016
            relativo a la protección de las personas físicas (RGPD), y la Ley Orgánica 3/2018, de 5
            de diciembre, de Protección de Datos Personales y garantía de los derechos digitales
            (LOPDGDD), le informamos de la presente Política de Privacidad.
          </p>
          <div className="bg-muted/50 mt-4 rounded-2xl p-4">
            <p className="text-sm">
              <strong>Responsable del tratamiento:</strong> {ownerName}
              <br />
              <strong>Domicilio:</strong> {location}
              <br />
              <strong>Email de contacto:</strong> {email}
            </p>
          </div>
        </section>

        {/* Datos recopilados */}
        <section>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            2. ¿Qué datos recopilamos?
          </h2>
          <p className="mb-4 leading-relaxed">
            A través del formulario de contacto de este sitio web, recopilamos los siguientes datos
            personales:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Nombre completo:</strong> Para dirigirnos a usted de forma personalizada.
            </li>
            <li>
              <strong>Correo electrónico:</strong> Para responder a su consulta.
            </li>
            <li>
              <strong>Mensaje:</strong> El contenido de su consulta o comentario.
            </li>
            <li>
              <strong>Dirección IP:</strong> Automáticamente registrada con fines de seguridad y
              prevención de spam.
            </li>
          </ul>
        </section>

        {/* Finalidad */}
        <section>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            3. ¿Para qué utilizamos sus datos?
          </h2>
          <p className="mb-4 leading-relaxed">
            Los datos personales son tratados con las siguientes finalidades:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Gestión de consultas:</strong> Responder a solicitudes de información,
              presupuestos o reservas de servicios de maquillaje.
            </li>
            <li>
              <strong>Prevención de spam:</strong> La IP se utiliza para aplicar medidas de
              rate-limiting y evitar el envío masivo de mensajes automatizados.
            </li>
            <li>
              <strong>Análisis de tráfico web (opcional):</strong> Si acepta cookies analíticas,
              utilizamos Google Analytics para entender cómo los usuarios navegan por el sitio
              (datos anónimos).
            </li>
          </ul>
        </section>

        {/* Base Legal */}
        <section>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            4. Base Legal del Tratamiento
          </h2>
          <p className="leading-relaxed">
            El tratamiento de sus datos personales se basa en el{' '}
            <strong>consentimiento explícito</strong> que usted otorga al marcar la casilla
            &quot;Acepto la política de privacidad&quot; antes de enviar el formulario de contacto.
            Este consentimiento es libre, específico, informado e inequívoco.
          </p>
        </section>

        {/* Conservación */}
        <section>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            5. ¿Cuánto tiempo conservamos sus datos?
          </h2>
          <p className="leading-relaxed">
            Los datos personales proporcionados se conservarán mientras sean necesarios para la
            finalidad para la que fueron recogidos, o hasta que usted ejerza su derecho de
            supresión. Una vez respondida su consulta, sus datos se conservarán durante un período
            máximo de <strong>2 años</strong> con el fin de atender posibles reclamaciones futuras.
          </p>
        </section>

        {/* Destinatarios */}
        <section>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            6. ¿Compartimos sus datos con terceros?
          </h2>
          <p className="mb-4 leading-relaxed">
            Sus datos personales no se cederán a terceros, salvo obligación legal. No obstante,
            utilizamos los siguientes proveedores tecnológicos como encargados del tratamiento:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Cloudinary:</strong> Almacenamiento y optimización de imágenes (USA).
            </li>
            <li>
              <strong>Neon Database:</strong> Base de datos PostgreSQL serverless (USA/EU).
            </li>
            <li>
              <strong>Vercel:</strong> Hosting de la aplicación web (USA/EU).
            </li>
            <li>
              <strong>Google Analytics:</strong> Análisis de tráfico web (solo si acepta cookies
              analíticas).
            </li>
          </ul>
          <p className="mt-4 leading-relaxed">
            Todos estos proveedores cumplen con el RGPD y/o tienen acuerdos de protección de datos
            adecuados.
          </p>
        </section>

        {/* Derechos */}
        <section>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            7. Sus Derechos (ARCO + otros)
          </h2>
          <p className="mb-4 leading-relaxed">
            En cualquier momento, usted puede ejercer los siguientes derechos sobre sus datos
            personales:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Acceso:</strong> Conocer qué datos tenemos sobre usted.
            </li>
            <li>
              <strong>Rectificación:</strong> Corregir datos inexactos o incompletos.
            </li>
            <li>
              <strong>Supresión (Derecho al Olvido):</strong> Eliminar sus datos cuando ya no sean
              necesarios.
            </li>
            <li>
              <strong>Oposición:</strong> Oponerse al tratamiento de sus datos.
            </li>
            <li>
              <strong>Limitación:</strong> Solicitar la limitación del tratamiento.
            </li>
            <li>
              <strong>Portabilidad:</strong> Recibir sus datos en formato estructurado y legible
              para trasladarlos a otro responsable.
            </li>
            <li>
              <strong>Retirar el consentimiento:</strong> En cualquier momento, sin que ello afecte
              a la licitud del tratamiento basado en el consentimiento previo.
            </li>
          </ul>
          <div className="bg-muted/50 mt-4 rounded-2xl p-4">
            <p className="text-sm">
              Para ejercer sus derechos, envíe un email a{' '}
              <a href={`mailto:${email}`} className="text-primary underline hover:no-underline">
                {email}
              </a>{' '}
              indicando claramente el derecho que desea ejercer y adjuntando copia de su DNI u otro
              documento identificativo.
            </p>
          </div>
          <p className="mt-4 leading-relaxed">
            Además, le informamos de su derecho a presentar una reclamación ante la Agencia Española
            de Protección de Datos (
            <a
              href="https://www.aepd.es"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              www.aepd.es
            </a>
            ) si considera que el tratamiento no se ajusta a la normativa vigente.
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">8. Uso de Cookies</h2>
          <p className="mb-4 leading-relaxed">
            Este sitio web utiliza cookies propias y de terceros para mejorar la experiencia del
            usuario y analizar el tráfico. Puede consultar nuestra{' '}
            <strong>Política de Cookies</strong> en el banner que aparece al acceder al sitio.
          </p>
          <p className="leading-relaxed">Tipos de cookies utilizadas:</p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              <strong>Cookies técnicas (esenciales):</strong> Necesarias para el funcionamiento del
              sitio (autenticación, preferencias de tema). No se pueden desactivar.
            </li>
            <li>
              <strong>Cookies analíticas (opcionales):</strong> Google Analytics para analizar el
              comportamiento de los usuarios. Solo se activan si acepta &quot;Cookies
              Analíticas&quot; en el banner.
            </li>
          </ul>
        </section>

        {/* Seguridad */}
        <section>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">9. Seguridad de los Datos</h2>
          <p className="leading-relaxed">
            Hemos implementado medidas técnicas y organizativas adecuadas para proteger sus datos
            personales contra acceso no autorizado, pérdida, alteración o divulgación. Estas medidas
            incluyen:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Cifrado SSL/TLS en todas las comunicaciones (HTTPS).</li>
            <li>Headers de seguridad (CSP, HSTS, X-Frame-Options).</li>
            <li>Autenticación segura con hashing bcrypt.</li>
            <li>Rate limiting para prevenir ataques de fuerza bruta.</li>
            <li>Copias de seguridad periódicas de la base de datos.</li>
          </ul>
        </section>

        {/* Modificaciones */}
        <section>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            10. Modificaciones de la Política de Privacidad
          </h2>
          <p className="leading-relaxed">
            Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento.
            Las modificaciones entrarán en vigor desde su publicación en esta página. Le
            recomendamos revisar periódicamente esta política para estar informado de cómo
            protegemos sus datos.
          </p>
          <p className="text-muted-foreground mt-4 text-sm">
            <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
          </p>
        </section>

        {/* Contacto */}
        <section className="bg-muted/50 rounded-3xl p-6">
          <h2 className="text-foreground mb-4 text-2xl font-semibold">📧 ¿Tienes dudas?</h2>
          <p className="leading-relaxed">
            Si tiene alguna pregunta sobre esta Política de Privacidad o sobre el tratamiento de sus
            datos personales, puede contactarnos en:
          </p>
          <div className="mt-4 space-y-2">
            <p>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${email}`} className="text-primary underline hover:no-underline">
                {email}
              </a>
            </p>
            <p>
              <strong>Dirección:</strong> {location}
            </p>
            {phone && (
              <p>
                <strong>Teléfono:</strong> {phone}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
