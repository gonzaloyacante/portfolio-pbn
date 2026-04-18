import 'package:flutter/material.dart';

import '../../../../core/config/app_constants.dart';
import 'help_item.dart';
import 'help_section_card.dart';

/// Cuerpo estático de la pantalla de ayuda.
class HelpContent extends StatelessWidget {
  const HelpContent({super.key, required this.version});

  final String version;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      children: [
        HelpSectionCard(
          icon: Icons.info_outline,
          title: 'Acerca de la app',
          children: [
            const HelpItem(label: 'Nombre', value: AppConstants.appName),
            HelpItem(label: 'Versión', value: version),
            const HelpItem(
              label: 'Descripción',
              value:
                  'Panel de administración de ${AppConstants.ownerFullName}. '
                  'Gestiona el portfolio, servicios, testimonios, '
                  'contactos, reservas y configuración del sitio.',
            ),
          ],
        ),
        const SizedBox(height: 16),
        const HelpSectionCard(
          icon: Icons.dashboard_outlined,
          title: 'Secciones del panel',
          children: [
            HelpItem(
              label: 'Dashboard',
              value: 'Resumen de actividad y métricas principales.',
            ),
            HelpItem(
              label: 'Portfolio',
              value: 'Gestiona las categorías y sus galerías de imágenes.',
            ),
            HelpItem(
              label: 'Categorías',
              value:
                  'Organiza el portfolio por tipo de trabajo y galería de imágenes.',
            ),
            HelpItem(
              label: 'Servicios',
              value: 'Servicios ofrecidos con precio y descripción.',
            ),
            HelpItem(
              label: 'Testimonios',
              value: 'Opiniones de clientes que aparecen en el sitio.',
            ),
            HelpItem(
              label: 'Contactos',
              value: 'Mensajes recibidos desde el formulario de contacto.',
            ),
            HelpItem(
              label: 'Calendario',
              value: 'Reservas agendadas con estado y detalles del cliente.',
            ),
            HelpItem(
              label: 'Configuración',
              value:
                  'Ajustes del sitio: textos, colores, redes sociales y más.',
            ),
            HelpItem(
              label: 'Papelera',
              value:
                  'Elementos eliminados. Se pueden restaurar o eliminar permanentemente.',
            ),
          ],
        ),
        const SizedBox(height: 16),
        const HelpSectionCard(
          icon: Icons.help_outline,
          title: 'Preguntas frecuentes',
          children: [
            HelpItem(
              label: '¿Cómo subir imágenes a una categoría?',
              value:
                  'Ve a Categorías → edita la categoría → sección Galería → '
                  'sube las imágenes. Aparecerán en el sitio web inmediatamente.',
            ),
            HelpItem(
              label: '¿Cómo restaurar un elemento eliminado?',
              value:
                  'Ve a Papelera, localiza el elemento y pulsa "Restaurar".',
            ),
            HelpItem(
              label: '¿Cómo cambiar la contraseña?',
              value: 'Ve a Mi cuenta → Cambiar contraseña.',
            ),
          ],
        ),
        const SizedBox(height: 16),
        const HelpSectionCard(
          icon: Icons.support_agent_outlined,
          title: 'Soporte',
          children: [
            HelpItem(label: 'Email', value: AppConstants.supportEmail),
            HelpItem(label: 'Sitio web', value: AppConstants.siteUrl),
          ],
        ),
      ],
    );
  }
}
