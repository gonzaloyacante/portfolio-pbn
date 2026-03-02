import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../data/dashboard_repository.dart';

// ── AlertsSection ─────────────────────────────────────────────────────────────

/// Tarjetas de alerta que resumen elementos que requieren atención.
///
/// Se muestra solo cuando hay al menos una alerta activa.
/// Cada alerta navega a la pantalla correspondiente al hacer tap.
class AlertsSection extends StatelessWidget {
  const AlertsSection({super.key, required this.stats});

  final DashboardStats stats;

  @override
  Widget build(BuildContext context) {
    final alerts = _buildAlerts(context);
    if (alerts.isEmpty) return const SizedBox.shrink();

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Wrap(
          spacing: AppSpacing.sm,
          runSpacing: AppSpacing.sm,
          children: alerts,
        ),
      ],
    );
  }

  List<Widget> _buildAlerts(BuildContext context) {
    final items = <Widget>[];

    if (stats.newContacts > 0) {
      items.add(
        _AlertChip(
          icon: Icons.mail_outline_rounded,
          label:
              '${stats.newContacts} contacto${stats.newContacts == 1 ? '' : 's'} sin leer',
          color: AppColors.darkPrimary,
          onTap: () => context.goNamed(RouteNames.contacts),
        ),
      );
    }

    if (stats.pendingTestimonials > 0) {
      items.add(
        _AlertChip(
          icon: Icons.format_quote_outlined,
          label:
              '${stats.pendingTestimonials} testimonio${stats.pendingTestimonials == 1 ? '' : 's'} pendiente${stats.pendingTestimonials == 1 ? '' : 's'}',
          color: AppColors.warning,
          onTap: () => context.goNamed(RouteNames.testimonials),
        ),
      );
    }

    if (stats.pendingBookings > 0) {
      items.add(
        _AlertChip(
          icon: Icons.calendar_month_outlined,
          label:
              '${stats.pendingBookings} reserva${stats.pendingBookings == 1 ? '' : 's'} pendiente${stats.pendingBookings == 1 ? '' : 's'}',
          color: AppColors.warning,
          onTap: () => context.goNamed(RouteNames.calendar),
        ),
      );
    }

    if (stats.trashCount > 0) {
      items.add(
        _AlertChip(
          icon: Icons.delete_outline_rounded,
          label:
              '${stats.trashCount} elemento${stats.trashCount == 1 ? '' : 's'} en papelera',
          color: AppColors.destructive,
          onTap: () => context.goNamed(RouteNames.trash),
        ),
      );
    }

    return items;
  }
}

// ── _AlertChip ────────────────────────────────────────────────────────────────

class _AlertChip extends StatelessWidget {
  const _AlertChip({
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
    return Material(
      color: color.withAlpha(20),
      borderRadius: BorderRadius.circular(AppRadius.card),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadius.card),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.base,
            vertical: AppSpacing.sm,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 18, color: color),
              const SizedBox(width: AppSpacing.xs),
              Flexible(
                child: Text(
                  label,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: color,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.xs),
              Icon(Icons.arrow_forward_ios_rounded, size: 12, color: color),
            ],
          ),
        ),
      ),
    );
  }
}
