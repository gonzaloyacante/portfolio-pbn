import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/theme/app_spacing.dart';

// ── QuickActions ──────────────────────────────────────────────────────────────

/// Fila de acciones rápidas para crear contenido frecuente.
class QuickActions extends StatelessWidget {
  const QuickActions({super.key});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: AppSpacing.sm,
      runSpacing: AppSpacing.sm,
      children: [
        _QuickActionButton(
          icon: Icons.add_photo_alternate_outlined,
          label: 'Nuevo proyecto',
          color: AppColors.lightPrimary,
          onTap: () => context.goNamed(RouteNames.projectNew),
        ),
        _QuickActionButton(
          icon: Icons.category_outlined,
          label: 'Nueva categoría',
          color: AppColors.categoriesColor,
          onTap: () => context.goNamed(RouteNames.categoryNew),
        ),
        _QuickActionButton(
          icon: Icons.design_services_outlined,
          label: 'Nuevo servicio',
          color: AppColors.servicesColor,
          onTap: () => context.goNamed(RouteNames.serviceNew),
        ),
        _QuickActionButton(
          icon: Icons.calendar_month_outlined,
          label: 'Nueva reserva',
          color: AppColors.warning,
          onTap: () => context.goNamed(RouteNames.bookingNew),
        ),
      ],
    );
  }
}

// ── _QuickActionButton ────────────────────────────────────────────────────────

class _QuickActionButton extends StatelessWidget {
  const _QuickActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? color.withAlpha(65) : color.withAlpha(30);

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.sm,
        ),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(AppRadius.card),
          border: Border.all(
            color: color.withAlpha(isDark ? 100 : 60),
            width: 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: color),
            const SizedBox(width: AppSpacing.xs),
            Text(
              label,
              style: Theme.of(context).textTheme.labelMedium?.copyWith(
                color: color,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
