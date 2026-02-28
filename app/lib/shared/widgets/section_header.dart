import 'package:flutter/material.dart';

import '../../core/theme/app_spacing.dart';

/// Cabecera de sección reutilizable: título + subtítulo opcional + acción opcional.
///
/// Uso:
/// ```dart
/// SectionHeader(
///   title: 'Proyectos recientes',
///   subtitle: '12 proyectos publicados',
///   trailing: TextButton(onPressed: ..., child: Text('Ver todo')),
/// )
/// ```
class SectionHeader extends StatelessWidget {
  const SectionHeader({super.key, required this.title, this.subtitle, this.trailing, this.padding, this.titleStyle});

  final String title;
  final String? subtitle;
  final Widget? trailing;
  final EdgeInsetsGeometry? padding;
  final TextStyle? titleStyle;

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final colorScheme = Theme.of(context).colorScheme;

    return Padding(
      padding: padding ?? EdgeInsets.fromLTRB(AppSpacing.base, AppSpacing.base, AppSpacing.base, AppSpacing.sm),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: titleStyle ?? textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
                if (subtitle != null) ...[
                  const SizedBox(height: 2),
                  Text(subtitle!, style: textTheme.bodySmall?.copyWith(color: colorScheme.onSurface.withAlpha(140))),
                ],
              ],
            ),
          ),
          if (trailing != null) trailing!,
        ],
      ),
    );
  }
}
