import 'package:flutter/material.dart';

import '../../core/theme/app_breakpoints.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_spacing.dart';
import 'app_card.dart';

// ── StatCard ──────────────────────────────────────────────────────────────────

/// Tarjeta de estadística para el Dashboard — responsive, con identidad visual.
///
/// El fondo usa un tinte suave del color de la tarjeta, el icono aparece
/// prominente y el valor numérico hereda el color para dar jerarquía visual.
///
/// Uso:
/// ```dart
/// StatCard(
///   icon: Icons.photo_library_outlined,
///   label: 'Proyectos',
///   value: '24',
///   trend: '+3 este mes',
///   trendPositive: true,
/// )
/// ```
class StatCard extends StatelessWidget {
  const StatCard({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
    this.trend,
    this.trendPositive,
    this.onTap,
    this.color,
    this.valueSuffix,
    this.valueSuffixIcon,
  });

  final IconData icon;
  final String label;
  final String value;
  final String? trend;
  final bool? trendPositive;
  final VoidCallback? onTap;
  final Color? color;
  final String? valueSuffix;
  final IconData? valueSuffixIcon;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final cardColor = color ?? colorScheme.primary;
    final isExpanded = AppBreakpoints.isExpanded(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // Fondo tintado: más intenso en dark, más suave en light
    final bgTint = isDark
        ? cardColor.withValues(alpha: 55 / 255)
        : cardColor.withValues(alpha: 26 / 255);
    final iconBgTint = isDark
        ? cardColor.withValues(alpha: 90 / 255)
        : cardColor.withValues(alpha: 45 / 255);

    return AppCard(
      color: bgTint,
      borderRadius: BorderRadius.circular(AppRadius.card),
      onTap: onTap,
      padding: EdgeInsets.all(isExpanded ? AppSpacing.base : AppSpacing.sm + 2),
      child: Row(
        children: [
          // ── Icono circular ──────────────────────────────────────
          Container(
            width: isExpanded ? 48 : 40,
            height: isExpanded ? 48 : 40,
            decoration: BoxDecoration(
              color: iconBgTint,
              borderRadius: BorderRadius.circular(isExpanded ? 14 : 12),
            ),
            alignment: Alignment.center,
            child: Icon(icon, color: cardColor, size: isExpanded ? 24 : 20),
          ),
          SizedBox(width: isExpanded ? AppSpacing.md : AppSpacing.sm),

          // ── Contenido: valor + label + trend ────────────────────
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                // Valor numérico (con sufijo opcional para pendientes)
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        value,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style:
                            (isExpanded
                                    ? textTheme.titleLarge
                                    : textTheme.titleMedium)
                                ?.copyWith(
                                  fontWeight: FontWeight.w800,
                                  color: cardColor,
                                  height: 1.1,
                                  letterSpacing: -0.5,
                                ),
                      ),
                    ),
                    if (valueSuffix != null) ...[
                      const SizedBox(width: AppSpacing.sm),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.sm,
                          vertical: AppSpacing.xs,
                        ),
                        decoration: BoxDecoration(
                          color: Theme.of(
                            context,
                          ).colorScheme.onSurface.withValues(alpha: 12 / 255),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            if (valueSuffixIcon != null) ...[
                              Icon(
                                valueSuffixIcon,
                                size: 14,
                                color: Theme.of(context).colorScheme.onSurface,
                              ),
                              const SizedBox(width: AppSpacing.xs),
                            ],
                            Text(
                              valueSuffix!,
                              style: Theme.of(context).textTheme.labelSmall
                                  ?.copyWith(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.onSurface,
                                    fontWeight: FontWeight.w700,
                                  ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
                // Etiqueta descriptiva
                Text(
                  label,
                  style: textTheme.bodySmall?.copyWith(
                    color: colorScheme.onSurface.withValues(alpha: 160 / 255),
                    fontWeight: FontWeight.w500,
                    letterSpacing: 0.1,
                    fontSize: isExpanded ? null : 12,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                // Badge de tendencia
                if (trend != null) ...[
                  const SizedBox(height: 4),
                  _TrendBadge(trend: trend!, isPositive: trendPositive ?? true),
                ],
              ],
            ),
          ),

          // ── Flecha si tiene onTap ───────────────────────────────
          if (onTap != null && trend == null)
            Padding(
              padding: const EdgeInsets.only(left: 4),
              child: Icon(
                Icons.arrow_forward_ios_rounded,
                size: 13,
                color: cardColor.withValues(alpha: 180 / 255),
              ),
            ),
        ],
      ),
    );
  }
}

// ── _TrendBadge ───────────────────────────────────────────────────────────────

class _TrendBadge extends StatelessWidget {
  const _TrendBadge({required this.trend, required this.isPositive});

  final String trend;
  final bool isPositive;

  @override
  Widget build(BuildContext context) {
    final color = isPositive ? AppColors.success : AppColors.destructive;

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 28 / 255),
        borderRadius: AppRadius.forChip,
        border: Border.all(
          color: color.withValues(alpha: 70 / 255),
          width: 0.8,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            isPositive
                ? Icons.trending_up_rounded
                : Icons.trending_down_rounded,
            size: 13,
            color: color,
          ),
          const SizedBox(width: AppSpacing.xs),
          Text(
            trend,
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
              color: color,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}
