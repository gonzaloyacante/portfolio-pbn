import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/debug/debug_provider.dart';
import '../../../core/theme/app_radius.dart';
import '../../../shared/widgets/app_scaffold.dart';

/// Pantalla de ayuda — información de la app y guía de uso básica.
class HelpPage extends ConsumerWidget {
  const HelpPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final version = ref
        .watch(appBuildInfoProvider)
        .when(data: (info) => '${info.version} (build ${info.buildNumber})', loading: () => '…', error: (_, _) => '—');
    return AppScaffold(
      title: 'Ayuda',
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
        children: [
          _SectionCard(
            icon: Icons.info_outline,
            title: 'Acerca de la app',
            children: [
              const _HelpItem(label: 'Nombre', value: 'Portfolio PBN — Admin'),
              _HelpItem(label: 'Versión', value: version),
              const _HelpItem(
                label: 'Descripción',
                value:
                    'Panel de administración de Paola Bolívar Nievas. '
                    'Gestiona proyectos, servicios, testimonios, '
                    'contactos, reservas y configuración del sitio.',
              ),
            ],
          ),
          const SizedBox(height: 16),
          _SectionCard(
            icon: Icons.dashboard_outlined,
            title: 'Secciones del panel',
            children: [
              _HelpItem(label: 'Dashboard', value: 'Resumen de actividad y métricas principales.'),
              _HelpItem(label: 'Proyectos', value: 'Gestiona el portfolio: título, descripción, imágenes y categoría.'),
              _HelpItem(label: 'Categorías', value: 'Organiza los proyectos por tipo de trabajo.'),
              _HelpItem(label: 'Servicios', value: 'Servicios ofrecidos con precio y descripción.'),
              _HelpItem(label: 'Testimonios', value: 'Opiniones de clientes que aparecen en el sitio.'),
              _HelpItem(label: 'Contactos', value: 'Mensajes recibidos desde el formulario de contacto.'),
              _HelpItem(label: 'Calendario', value: 'Reservas agendadas con estado y detalles del cliente.'),
              _HelpItem(label: 'Configuración', value: 'Ajustes del sitio: textos, colores, redes sociales y más.'),
              _HelpItem(
                label: 'Papelera',
                value: 'Elementos eliminados. Se pueden restaurar o eliminar permanentemente.',
              ),
            ],
          ),
          SizedBox(height: 16),
          _SectionCard(
            icon: Icons.help_outline,
            title: 'Preguntas frecuentes',
            children: [
              _HelpItem(
                label: '¿Cómo publicar un proyecto?',
                value:
                    'Ve a Proyectos → "+" → completa el formulario y guarda. '
                    'El proyecto aparecerá en el sitio web inmediatamente.',
              ),
              _HelpItem(
                label: '¿Cómo restaurar un elemento eliminado?',
                value: 'Ve a Papelera, localiza el elemento y pulsa "Restaurar".',
              ),
              _HelpItem(label: '¿Cómo cambiar la contraseña?', value: 'Ve a Mi cuenta → Cambiar contraseña.'),
            ],
          ),
          SizedBox(height: 16),
          _SectionCard(
            icon: Icons.support_agent_outlined,
            title: 'Soporte',
            children: [
              _HelpItem(label: 'Email', value: 'hola@paolabolivar.es'),
              _HelpItem(label: 'Sitio web', value: 'www.paolabolivar.es'),
            ],
          ),
        ],
      ),
    );
  }
}

// ── Widgets auxiliares ─────────────────────────────────────────────────────────

class _SectionCard extends StatelessWidget {
  const _SectionCard({required this.icon, required this.title, required this.children});

  final IconData icon;
  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: AppRadius.forCard),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: Theme.of(context).colorScheme.primary),
                const SizedBox(width: 10),
                Text(title, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
              ],
            ),
            const Divider(height: 24),
            ...children,
          ],
        ),
      ),
    );
  }
}

class _HelpItem extends StatelessWidget {
  const _HelpItem({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w600)),
          const SizedBox(height: 2),
          Text(value, style: Theme.of(context).textTheme.bodyMedium),
        ],
      ),
    );
  }
}
