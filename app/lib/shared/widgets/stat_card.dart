import 'package:flutter/material.dart';

// ── StatCard ──────────────────────────────────────────────────────────────────

/// Tarjeta de estadística para el Dashboard.
///
/// Muestra un valor numérico con icono, etiqueta y variación opcional.
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

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: cardColor.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
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
                      size: 12,
                      color: colorScheme.outline.withValues(alpha: 0.5),
                    ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                value,
                style: textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w700,
                  color: colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                label,
                style: textTheme.bodySmall?.copyWith(
                  color: colorScheme.outline,
                ),
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
    final color = isPositive
        ? const Color(0xFF10B981) // success
        : const Color(0xFFEF4444); // destructive

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            isPositive
                ? Icons.trending_up_rounded
                : Icons.trending_down_rounded,
            size: 14,
            color: color,
          ),
          const SizedBox(width: 4),
          Text(
            trend,
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
              color: color,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
