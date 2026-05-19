import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_breakpoints.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../data/dashboard_repository.dart';

class DashboardPrioritySection extends StatelessWidget {
  const DashboardPrioritySection({super.key, required this.stats});

  final DashboardStats stats;

  @override
  Widget build(BuildContext context) {
    final items =
        <
              ({
                IconData icon,
                String label,
                String detail,
                int value,
                Color color,
                VoidCallback onTap,
              })
            >[
              (
                icon: Icons.mail_outline_rounded,
                label: 'Mensajes sin leer',
                detail: 'Responder cuanto antes',
                value: stats.newContacts,
                color: AppColors.warning,
                onTap: () => context.goNamed(RouteNames.contacts),
              ),
              (
                icon: Icons.calendar_month_outlined,
                label: 'Reservas pendientes',
                detail: 'Confirmar o reprogramar',
                value: stats.pendingBookings,
                color: AppColors.info,
                onTap: () => context.goNamed(RouteNames.calendar),
              ),
              (
                icon: Icons.rate_review_outlined,
                label: 'Testimonios pendientes',
                detail: 'Revisar antes de publicar',
                value: stats.pendingTestimonials,
                color: AppColors.success,
                onTap: () => context.goNamed(RouteNames.testimonials),
              ),
              (
                icon: Icons.delete_outline_rounded,
                label: 'Papelera',
                detail: 'Recuperar o dejar vencer',
                value: stats.trashCount,
                color: AppColors.destructive,
                onTap: () => context.goNamed(RouteNames.trash),
              ),
            ]
            .where((item) => item.value > 0)
            .toList();

    if (items.isEmpty) {
      return const AppCard(
        leading: Icon(Icons.check_circle_outline, color: AppColors.success),
        title: 'Todo al día',
        subtitle: 'No hay pendientes importantes ahora',
        child: SizedBox.shrink(),
      );
    }

    return AdaptiveGrid(
      compactCols: 1,
      mediumCols: 2,
      expandedCols: 4,
      childAspectRatio: AppBreakpoints.value(
        context,
        compact: 4.0,
        medium: 3.4,
        expanded: 2.8,
      ),
      padding: EdgeInsets.zero,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        for (final item in items)
          AppCard(
            color: item.color.withValues(alpha: 26 / 255),
            onTap: item.onTap,
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Row(
              children: [
                Icon(item.icon, color: item.color, size: 28),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        item.value.toString(),
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          color: item.color,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      Text(
                        item.label,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        item.detail,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Theme.of(
                            context,
                          ).colorScheme.onSurface.withValues(alpha: 0.68),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
