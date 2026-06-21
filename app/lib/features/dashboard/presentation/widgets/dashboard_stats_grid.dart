import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_breakpoints.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/dashboard_repository.dart';

/// Grid de contenido publicado. No muestra analítica de visitas.
class DashboardStatsGrid extends StatelessWidget {
  const DashboardStatsGrid({super.key, required this.stats});

  final DashboardStats stats;

  @override
  Widget build(BuildContext context) {
    final aspectRatio = AppBreakpoints.value(
      context,
      compact: 2.2,
      medium: 2.5,
      expanded: 2.8,
    );
    return SliverAdaptiveGrid(
      compactCols: 2,
      mediumCols: 2,
      expandedCols: 4,
      childAspectRatio: aspectRatio,
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
          color: AppColors.success,
          onTap: () => context.goNamed(RouteNames.testimonials),
        ),
      ],
    );
  }
}
