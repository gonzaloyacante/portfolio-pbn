import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_breakpoints.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class DashboardQuickActions extends StatelessWidget {
  const DashboardQuickActions({super.key});

  @override
  Widget build(BuildContext context) {
    final actions = [
      (
        icon: Icons.home_outlined,
        label: 'Editar inicio',
        detail: 'Portada y textos principales',
        route: RouteNames.settingsHome,
        color: AppColors.lightPrimary,
      ),
      (
        icon: Icons.photo_library_outlined,
        label: 'Portfolio',
        detail: 'Categorías e imágenes',
        route: RouteNames.categories,
        color: AppColors.categoriesColor,
      ),
      (
        icon: Icons.design_services_outlined,
        label: 'Servicios',
        detail: 'Precios y disponibilidad',
        route: RouteNames.services,
        color: AppColors.servicesColor,
      ),
      (
        icon: Icons.contact_mail_outlined,
        label: 'Contacto',
        detail: 'Email, redes y formulario',
        route: RouteNames.settingsContact,
        color: AppColors.warning,
      ),
    ];

    return AdaptiveGrid(
      compactCols: 1,
      mediumCols: 2,
      expandedCols: 4,
      childAspectRatio: AppBreakpoints.value(
        context,
        compact: 4.0,
        medium: 3.3,
        expanded: 2.9,
      ),
      padding: EdgeInsets.zero,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        for (final action in actions)
          AppCard(
            onTap: () => context.goNamed(action.route),
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Row(
              children: [
                Icon(action.icon, color: action.color, size: 28),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        action.label,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        action.detail,
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
                Icon(
                  Icons.chevron_right_rounded,
                  color: action.color.withValues(alpha: 0.8),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
