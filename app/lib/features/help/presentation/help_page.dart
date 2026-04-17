import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../core/config/app_constants.dart';
import '../../../core/debug/debug_provider.dart';
import 'widgets/help_item.dart';
import 'widgets/help_section_card.dart';

/// Pantalla de ayuda — información de la app y guía de uso básica.
class HelpPage extends ConsumerWidget {
  const HelpPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final version = ref
        .watch(appBuildInfoProvider)
        .when(
          data: (info) => '${info.version} (build ${info.buildNumber})',
          loading: () => '…',
          error: (_, _) => '—',
        );
    return AppScaffold(
      title: 'Ayuda',
      body: ListView(
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
      ),
    );
  }
}
