import 'package:flutter/material.dart';

import '../../core/theme/app_breakpoints.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_spacing.dart';

// ── StatCard ──────────────────────────────────────────────────────────────────

/// Tarjeta de estadística para el Dashboard — responsive.
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

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.base),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: cardColor.withAlpha(30),
                      borderRadius: AppRadius.forIconContainer,
                    ),
                    alignment: Alignment.center,
                    child: Icon(icon, color: cardColor, size: 22),
                  ),
                  const Spacer(),
                  if (trend != null)
                    _TrendBadge(
                      trend: trend!,
                      isPositive: trendPositive ?? true,
                    )
                  else if (onTap != null)
                    Icon(
                      Icons.arrow_forward_ios_rounded,
                      size: 13,
                      color: colorScheme.outline,
                    ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              Text(
                value,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style:
                    (isExpanded
                            ? textTheme.headlineMedium
                            : textTheme.headlineSmall)
                        ?.copyWith(
                          fontWeight: FontWeight.w700,
                          color: colorScheme.onSurface,
                          height: 1.0,
                        ),
              ),
              const SizedBox(height: AppSpacing.xs),
              Text(
                label,
                style: textTheme.bodySmall?.copyWith(
                  color: colorScheme.onSurface.withAlpha(150),
                  fontWeight: FontWeight.w500,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
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
        color: color.withAlpha(30),
        borderRadius: AppRadius.forChip,
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
