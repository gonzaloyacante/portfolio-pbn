import 'package:flutter/material.dart';

import '../../core/theme/app_breakpoints.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_spacing.dart';

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
  });

  final IconData icon;
  final String label;
  final String value;
  final String? trend;
  final bool? trendPositive;
  final VoidCallback? onTap;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final cardColor = color ?? colorScheme.primary;
    final isExpanded = AppBreakpoints.isExpanded(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // Fondo tintado: más intenso en dark, más suave en light
    final bgTint = isDark ? cardColor.withAlpha(55) : cardColor.withAlpha(26);
    final iconBgTint = isDark
        ? cardColor.withAlpha(90)
        : cardColor.withAlpha(45);

    return Material(
      color: bgTint,
      borderRadius: BorderRadius.circular(AppRadius.card),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        splashColor: cardColor.withAlpha(40),
        highlightColor: cardColor.withAlpha(20),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.base),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              // ── Cabecera: icono + indicador de tap ───────────────────
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: iconBgTint,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    alignment: Alignment.center,
                    child: Icon(icon, color: cardColor, size: 24),
                  ),
                  const Spacer(),
                  if (onTap != null && trend == null)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Icon(
                        Icons.arrow_forward_ios_rounded,
                        size: 13,
                        color: cardColor.withAlpha(180),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Valor numérico: heredada el color de la tarjeta ──────
              Flexible(
                child: Text(
                  value,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style:
                      (isExpanded
                              ? textTheme.headlineMedium
                              : textTheme.headlineSmall)
                          ?.copyWith(
                            fontWeight: FontWeight.w800,
                            color: cardColor,
                            height: 1.0,
                            letterSpacing: -0.5,
                          ),
                ),
              ),
              const SizedBox(height: AppSpacing.xs),

              // ── Etiqueta descriptiva ─────────────────────────────────
              Text(
                label,
                style: textTheme.bodySmall?.copyWith(
                  color: colorScheme.onSurface.withAlpha(160),
                  fontWeight: FontWeight.w500,
                  letterSpacing: 0.1,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),

              // ── Badge de tendencia ───────────────────────────────────
              if (trend != null) ...[
                const SizedBox(height: AppSpacing.sm),
                _TrendBadge(trend: trend!, isPositive: trendPositive ?? true),
              ],
            ],
          ),
        ),
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
        color: color.withAlpha(28),
        borderRadius: AppRadius.forChip,
        border: Border.all(color: color.withAlpha(70), width: 0.8),
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
