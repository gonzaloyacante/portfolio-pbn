import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_breakpoints.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../data/dashboard_repository.dart';
import 'dashboard_charts.dart';
import 'dashboard_greeting.dart';
import 'device_usage_section.dart';
import 'top_ranking_section.dart';
import 'visitors_map.dart';

class DashboardContent extends StatelessWidget {
  const DashboardContent({super.key, required this.stats});

  final DashboardStats stats;

  @override
  Widget build(BuildContext context) {
    final padding = AppBreakpoints.pagePadding(context);

    return CustomScrollView(
      slivers: [
        // ── Bienvenida ────────────────────────────────────────────────────
        SliverPadding(
          padding: padding.copyWith(bottom: AppSpacing.sm),
          sliver: const SliverToBoxAdapter(child: DashboardGreeting()),
        ),

        SliverPadding(
          padding: padding.copyWith(top: 0, bottom: 0),
          sliver: SliverAdaptiveGrid(
            compactCols: 2,
            mediumCols: 2,
            expandedCols: 4,
            childAspectRatio: 2.6,
            children: [
              StatCard(
                icon: Icons.photo_library_outlined,
                label: 'Proyectos',
                value: stats.totalProjects.toString(),
                color: AppColors.lightPrimary,
                onTap: () => context.goNamed(RouteNames.projects),
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
                value: _formatNumber(stats.uniqueVisitors30d),
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
          ),
        ),
        // ── Sección: Tendencias ──────────────────────────────────────────
        SliverPadding(
          padding: padding.copyWith(top: 0, bottom: AppSpacing.sm),
          sliver: const SliverToBoxAdapter(
            child: SectionHeader(title: 'Tendencias'),
          ),
        ),
        SliverPadding(
          padding: padding.copyWith(top: 0),
          sliver: const SliverToBoxAdapter(child: DashboardChartsSection()),
        ),

        // ── Sección: Dispositivos ─────────────────────────────────────────
        if (stats.deviceUsage.isNotEmpty) ...[
          SliverPadding(
            padding: padding.copyWith(
              top: AppSpacing.lg,
              bottom: AppSpacing.sm,
            ),
            sliver: const SliverToBoxAdapter(
              child: SectionHeader(title: 'Dispositivos (30d)'),
            ),
          ),
          SliverPadding(
            padding: padding.copyWith(top: 0),
            sliver: SliverToBoxAdapter(
              child: DeviceUsageSection(
                deviceUsage: stats.deviceUsage,
                total: stats.pageViews30d,
              ),
            ),
          ),
        ],

        // ── Sección: Top proyectos ────────────────────────────────────────
        if (stats.topProjects.isNotEmpty) ...[
          SliverPadding(
            padding: padding.copyWith(
              top: AppSpacing.lg,
              bottom: AppSpacing.sm,
            ),
            sliver: const SliverToBoxAdapter(
              child: SectionHeader(title: 'Top proyectos (30d)'),
            ),
          ),
          SliverPadding(
            padding: padding.copyWith(top: 0),
            sliver: SliverToBoxAdapter(
              child: TopRankingSection(
                items: [for (final p in stats.topProjects) (p.label, p.count)],
              ),
            ),
          ),
        ],

        // ── Sección: Top ubicaciones + Mapa ─────────────────────────────────
        if (stats.topLocations.isNotEmpty) ...[
          SliverPadding(
            padding: padding.copyWith(
              top: AppSpacing.lg,
              bottom: AppSpacing.sm,
            ),
            sliver: const SliverToBoxAdapter(
              child: SectionHeader(title: 'Visitantes por ubicación (30d)'),
            ),
          ),
          SliverPadding(
            padding: padding.copyWith(top: 0),
            sliver: SliverToBoxAdapter(
              child: VisitorsMapWidget(locations: stats.topLocations),
            ),
          ),
        ],

        const SliverPadding(padding: EdgeInsets.only(bottom: AppSpacing.xxxl)),
      ],
    );
  }

  String _formatNumber(int n) {
    if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(1)}M';
    if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}k';
    return n.toString();
  }
}
