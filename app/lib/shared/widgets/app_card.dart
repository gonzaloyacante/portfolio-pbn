import 'package:flutter/material.dart';

import '../../core/theme/app_radius.dart';
import '../../core/theme/app_spacing.dart';

/// AppCard — tarjeta base reutilizable para la app.
///
/// Implementa las buenas prácticas del artículo indicado:
/// - Container claro y responsivo
/// - Padding y radio consistentes desde el design system
/// - Estados interactivos (InkWell)
/// - Header opcional (leading / title / subtitle / trailing)
///
/// Uso básico:
/// ```dart
/// AppCard(
///   title: 'Sección',
///   leading: Icon(Icons.settings),
///   trailing: Switch(...),
///   child: Text('Contenido'),
/// )
/// ```
class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    this.title,
    this.subtitle,
    this.leading,
    this.trailing,
    required this.child,
    this.onTap,
    this.color,
    this.padding,
    this.elevation,
    this.borderRadius,
  });

  final String? title;
  final String? subtitle;
  final Widget? leading;
  final Widget? trailing;
  final Widget child;
  final VoidCallback? onTap;
  final Color? color;
  final EdgeInsets? padding;
  final double? elevation;
  final BorderRadius? borderRadius;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final bg = color ?? theme.cardColor;
    final br = borderRadius ?? BorderRadius.circular(AppRadius.card);
    final pad = padding ?? const EdgeInsets.all(AppSpacing.cardPadding);

    return Material(
      color: bg,
      shape: RoundedRectangleBorder(borderRadius: br),
      elevation: elevation ?? 0,
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        splashColor: theme.colorScheme.primary.withValues(alpha: 0.08),
        highlightColor: theme.colorScheme.primary.withValues(alpha: 0.04),
        child: Padding(
          padding: pad,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              if (title != null ||
                  leading != null ||
                  trailing != null ||
                  subtitle != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      if (leading != null) ...[
                        leading!,
                        const SizedBox(width: AppSpacing.sm),
                      ],
                      if (title != null)
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                title!,
                                style: theme.textTheme.titleSmall?.copyWith(
                                  fontWeight: FontWeight.w700,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              if (subtitle != null)
                                Text(
                                  subtitle!,
                                  style: theme.textTheme.bodySmall?.copyWith(
                                    color: theme.colorScheme.onSurface
                                        .withValues(alpha: 0.7),
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                            ],
                          ),
                        ),
                      if (trailing != null) ...[
                        const SizedBox(width: AppSpacing.sm),
                        trailing!,
                      ],
                    ],
                  ),
                ),

              // Contenido principal proporcionado por el consumidor
              Flexible(child: child),
            ],
          ),
        ),
      ),
    );
  }
}
