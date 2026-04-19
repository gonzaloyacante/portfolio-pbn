import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/dashboard_repository.dart';

String formatDashboardNumber(int n) {
  if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(1)}M';
  if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}k';
  return n.toString();
}

/// Grid de 8 StatCards del dashboard — extraído de DashboardContent.
class DashboardStatsGrid extends StatelessWidget {
  const DashboardStatsGrid({super.key, required this.stats});

  final DashboardStats stats;

  @override
  Widget build(BuildContext context) {
    return SliverAdaptiveGrid(
      compactCols: 2,
      mediumCols: 2,
      expandedCols: 4,
      childAspectRatio: 2.6,
      children: [
        StatCard(
          icon: Icons.photo_library_outlined,
          label: 'Imágenes',
          value: stats.totalImages.toString(),
          color: AppColors.lightPrimary,
          onTap: () => context.goNamed(RouteNames.categories),
        ),
        StatCard(
          icon: Icons.category_outlined,
          label: 'Categorías',
          value: stats.totalCategories.toString(),
          color: AppColors.categoriesColor,
          onTap: () => context.goNamed(RouteNames.categories),
        ),
        StatCard(
          icon: Icons.design_services_outlined,
          label: 'Servicios',
          value: stats.totalServices.toString(),
          color: AppColors.servicesColor,
          onTap: () => context.goNamed(RouteNames.services),
        ),
        StatCard(
          icon: Icons.format_quote_outlined,
          label: 'Testimonios',
          value: stats.totalTestimonials.toString(),
          valueSuffix: stats.pendingTestimonials > 0
              ? stats.pendingTestimonials.toString()
              : null,
          valueSuffixIcon: stats.pendingTestimonials > 0
              ? Icons.schedule
              : null,
          color: AppColors.success,
          onTap: () => context.goNamed(RouteNames.testimonials),
        ),
        StatCard(
          icon: Icons.mail_outline_rounded,
          label: 'Contactos nuevos',
          value: stats.newContacts.toString(),
          trend: stats.newContacts > 0 ? '+${stats.newContacts}' : null,
          trendPositive: true,
          color: AppColors.darkPrimary,
          onTap: () => context.goNamed(RouteNames.contacts),
        ),
        StatCard(
          icon: Icons.calendar_month_outlined,
          label: 'Reservas pendientes',
          value: stats.pendingBookings.toString(),
          trend: stats.pendingBookings > 0
              ? '${stats.pendingBookings} pendientes'
              : null,
          trendPositive: stats.pendingBookings == 0,
          color: AppColors.warning,
          onTap: () => context.goNamed(RouteNames.calendar),
        ),
        StatCard(
          icon: Icons.people_outline_rounded,
          label: 'Visitantes (30d)',
          value: formatDashboardNumber(stats.uniqueVisitors30d),
          trendPositive: true,
          color: AppColors.success,
        ),
        StatCard(
          icon: Icons.delete_outline_rounded,
          label: 'Papelera',
          value: stats.trashCount.toString(),
          color: AppColors.destructive,
          onTap: () => context.goNamed(RouteNames.trash),
        ),
      ],
    );
  }
}
