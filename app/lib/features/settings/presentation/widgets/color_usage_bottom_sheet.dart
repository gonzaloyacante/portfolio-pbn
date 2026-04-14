import 'package:flutter/material.dart';
import 'package:portfolio_pbn/core/theme/app_spacing.dart';

// ── Color usage map ───────────────────────────────────────────────────────────

/// Maps a color field label to the UI components that use it.
const _colorUsageMap = <String, List<({String category, List<String> items})>>{
  'Primario': [
    (
      category: 'Botones',
      items: ['Botón primario (CTA)', 'Botón "Reservar sesión"'],
    ),
    (
      category: 'Navegación',
      items: ['Ítem activo del menú', 'Indicador de página actual'],
    ),
    (
      category: 'Acentos',
      items: ['Íconos destacados', 'Badges de estado activo'],
    ),
  ],
  'Secundario': [
    (
      category: 'Fondos',
      items: ['Fondo de secciones destacadas', 'Callouts informativos'],
    ),
    (
      category: 'Chips',
      items: ['Etiquetas de categoría', 'Tags de filtro en galería'],
    ),
  ],
  'Acento': [
    (
      category: 'Interacción',
      items: ['Hover de enlaces', 'Borde de inputs enfocados'],
    ),
    (
      category: 'Indicadores',
      items: ['Elemento seleccionado', 'Fondo de tooltip'],
    ),
  ],
  'Fondo': [
    (
      category: 'Estructura',
      items: [
        'Fondo principal de la página',
        'Fondo del hero',
        'Fondo del footer',
      ],
    ),
  ],
  'Texto': [
    (
      category: 'Tipografía',
      items: [
        'Títulos H1–H4',
        'Párrafos de cuerpo de texto',
        'Labels de formularios',
      ],
    ),
    (
      category: 'Navegación',
      items: ['Ítems del menú principal', 'Breadcrumbs'],
    ),
  ],
  'Fondo tarjetas': [
    (
      category: 'Tarjetas',
      items: [
        'Cards de servicios',
        'Cards de portfolio/galería',
        'Cards de testimonios',
      ],
    ),
    (
      category: 'Layout',
      items: ['Panel lateral de navegación', 'Sidebar admin'],
    ),
  ],
  'Primario (dark)': [
    (
      category: 'Botones (modo oscuro)',
      items: ['Botón primario en dark', 'Links y CTAs en fondo oscuro'],
    ),
  ],
  'Secundario (dark)': [
    (
      category: 'Fondos (modo oscuro)',
      items: ['Secciones destacadas en dark', 'Chips activos en dark'],
    ),
  ],
  'Acento (dark)': [
    (
      category: 'Interacción (modo oscuro)',
      items: ['Hover en dark mode', 'Bordes de focus en dark'],
    ),
  ],
  'Fondo (dark)': [
    (
      category: 'Estructura (modo oscuro)',
      items: ['Fondo principal en dark mode'],
    ),
  ],
  'Texto (dark)': [
    (
      category: 'Tipografía (modo oscuro)',
      items: ['Texto principal en dark', 'Subtítulos en dark'],
    ),
  ],
  'Fondo tarjetas (dark)': [
    (
      category: 'Tarjetas (modo oscuro)',
      items: ['Cards en dark mode', 'Paneles secundarios en dark'],
    ),
  ],
};

// ── ColorUsageBottomSheet ─────────────────────────────────────────────────────

/// Shows a bottom sheet listing UI components affected by a given color.
///
/// Usage:
/// ```dart
/// showColorUsageSheet(context, label: 'Primario', hexColor: '#6C0A0A');
/// ```
void showColorUsageSheet(
  BuildContext context, {
  required String label,
  required String hexColor,
}) {
  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
    ),
    builder: (_) => _ColorUsageSheet(label: label, hexColor: hexColor),
  );
}

class _ColorUsageSheet extends StatelessWidget {
  const _ColorUsageSheet({required this.label, required this.hexColor});

  final String label;
  final String hexColor;

  Color? _parseColor() {
    try {
      final h = hexColor.replaceAll('#', '');
      if (h.isEmpty) return null;
      return Color(int.parse('FF$h', radix: 16));
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final groups = _colorUsageMap[label] ?? [];
    final color = _parseColor();

    return DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.5,
      minChildSize: 0.3,
      maxChildSize: 0.85,
      builder: (_, controller) => ListView(
        controller: controller,
        padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: theme.colorScheme.onSurfaceVariant.withValues(
                  alpha: 0.3,
                ),
                borderRadius: const BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Title
          Text(
            '¿Dónde se usa "$label"?',
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          // Color preview
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border.all(
                color: theme.colorScheme.outline.withValues(alpha: 0.3),
              ),
              borderRadius: const BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                if (color != null)
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: color,
                      borderRadius: const BorderRadius.circular(8),
                      border: Border.all(
                        color: theme.colorScheme.outline.withValues(alpha: 0.4),
                      ),
                    ),
                  ),
                if (color != null) const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        label,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Text(
                        hexColor.toUpperCase(),
                        style: theme.textTheme.bodySmall?.copyWith(
                          fontFamily: 'monospace',
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          if (groups.isEmpty)
            Text(
              'No hay información de uso disponible.',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            )
          else
            ...groups.map(
              (group) => Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    group.category.toUpperCase(),
                    style: theme.textTheme.labelSmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                      letterSpacing: 1.2,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  ...group.items.map(
                    (item) => Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Row(
                        children: [
                          if (color != null)
                            Container(
                              width: 8,
                              height: 8,
                              margin: const EdgeInsets.only(right: 10),
                              decoration: BoxDecoration(
                                color: color,
                                shape: BoxShape.circle,
                              ),
                            ),
                          Expanded(
                            child: Text(
                              item,
                              style: theme.textTheme.bodyMedium,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                ],
              ),
            ),

          const Divider(height: 1),
          const SizedBox(height: AppSpacing.sm),
          Text(
            'Al cambiar este color, todos los elementos listados se verán afectados en tiempo real.',
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}
