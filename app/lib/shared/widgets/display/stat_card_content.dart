import 'package:flutter/material.dart';

import '../../../core/theme/app_spacing.dart';
import 'trend_badge.dart';

/// Columna de contenido de StatCard: valor, etiqueta y badge de tendencia.
class StatCardContent extends StatelessWidget {
  const StatCardContent({
    super.key,
    required this.value,
    required this.label,
    required this.isExpanded,
    required this.cardColor,
    this.trend,
    this.trendPositive,
    this.valueSuffix,
    this.valueSuffixIcon,
  });

  final String value;
  final String label;
  final bool isExpanded;
  final Color cardColor;
  final String? trend;
  final bool? trendPositive;
  final String? valueSuffix;
  final IconData? valueSuffixIcon;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                value,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style:
                    (isExpanded ? textTheme.titleLarge : textTheme.titleMedium)
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
                  color: colorScheme.onSurface.withValues(alpha: 12 / 255),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (valueSuffixIcon != null) ...[
                      Icon(
                        valueSuffixIcon,
                        size: 14,
                        color: colorScheme.onSurface,
                      ),
                      const SizedBox(width: AppSpacing.xs),
                    ],
                    Text(
                      valueSuffix!,
                      style: textTheme.labelSmall?.copyWith(
                        color: colorScheme.onSurface,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
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
        if (trend != null) ...[
          const SizedBox(height: 4),
          TrendBadge(trend: trend!, isPositive: trendPositive ?? true),
        ],
      ],
    );
  }
}
