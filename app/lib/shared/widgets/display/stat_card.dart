import 'package:flutter/material.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../app_card.dart';
import 'stat_card_content.dart';

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
///   label: 'Imágenes',
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
            child: StatCardContent(
              value: value,
              label: label,
              isExpanded: isExpanded,
              cardColor: cardColor,
              trend: trend,
              trendPositive: trendPositive,
              valueSuffix: valueSuffix,
              valueSuffixIcon: valueSuffixIcon,
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
