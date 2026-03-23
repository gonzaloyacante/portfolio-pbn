import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/adaptive_grid.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/section_header.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../../../shared/widgets/stat_card.dart';
import '../providers/dashboard_provider.dart';
import 'widgets/dashboard_charts.dart';
import 'widgets/dashboard_greeting.dart';
import 'widgets/device_usage_section.dart';
import 'widgets/top_ranking_section.dart';
import 'widgets/visitors_map.dart';

// ── DashboardPage ─────────────────────────────────────────────────────────────

/// Pantalla principal del panel de administración.
///
/// Cada sección maneja su propio estado de carga (skeleton/error/data)
/// de forma independiente. Pull-to-refresh recarga todos los providers.
class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  String _formatNumber(int n) {
    if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(1)}M';
    if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}k';
    return n.toString();
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(dashboardStatsProvider);
    final padding = AppBreakpoints.pagePadding(context);

    return AppScaffold(
      title: 'Dashboard',
      actions: [
        IconButton(
          icon: const Icon(Icons.refresh_rounded),
          tooltip: 'Actualizar',
          onPressed: () {
            ref.invalidate(dashboardStatsProvider);
            ref.invalidate(dashboardChartsProvider);
          },
        ),
      ],
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(dashboardStatsProvider);
          ref.invalidate(dashboardChartsProvider);
        },
        child: CustomScrollView(
          slivers: [
            // ── Bienvenida (siempre visible) ─────────────────────────────
            SliverPadding(
              padding: padding.copyWith(bottom: AppSpacing.sm),
              sliver: const SliverToBoxAdapter(child: DashboardGreeting()),
            ),

            // ── Sección: Stats ────────────────────────────────────────────
            statsAsync.when(
              loading: () {
                final cols = AppBreakpoints.gridColumns(
                  context,
                  compact: 2,
                  medium: 2,
                  expanded: 4,
                );
                final gutter = AppBreakpoints.gutter(context);
                return SliverPadding(
                  padding: padding.copyWith(top: 0, bottom: 0),
                  sliver: SliverToBoxAdapter(
                    child: ShimmerLoader(
                      child: GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: cols,
                          mainAxisSpacing: gutter,
                          crossAxisSpacing: gutter,
                          childAspectRatio: 2.6,
                        ),
                        itemCount: 8,
                        itemBuilder: (_, _) => const SkeletonStatCard(),
                      ),
                    ),
                  ),
                );
              },
              error: (err, _) => SliverPadding(
                padding: padding,
                sliver: SliverToBoxAdapter(
                  child: ErrorState(
                    message: 'No se pudieron cargar las métricas',
                    onRetry: () => ref.invalidate(dashboardStatsProvider),
                  ),
                ),
              ),
              data: (stats) => SliverPadding(
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
                      trend: stats.newContacts > 0
                          ? '+${stats.newContacts}'
                          : null,
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
            ),

            // ── Sección: Tendencias / Charts ──────────────────────────────
            // DashboardChartsSection maneja su propio provider internamente.
            SliverPadding(
              padding: padding.copyWith(
                top: AppSpacing.lg,
                bottom: AppSpacing.sm,
              ),
              sliver: const SliverToBoxAdapter(
                child: SectionHeader(title: 'Tendencias'),
              ),
            ),
            SliverPadding(
              padding: padding.copyWith(top: 0),
              sliver: const SliverToBoxAdapter(child: DashboardChartsSection()),
            ),

            // ── Sección: Dispositivos (30d) ───────────────────────────────
            statsAsync.when(
              loading: () => SliverPadding(
                padding: padding.copyWith(top: AppSpacing.lg, bottom: 0),
                sliver: const SliverToBoxAdapter(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ShimmerLoader(
                        child: ShimmerBox(
                          width: 180,
                          height: 18,
                          borderRadius: 6,
                        ),
                      ),
                      SizedBox(height: AppSpacing.sm),
                      SkeletonDeviceUsageSection(),
                    ],
                  ),
                ),
              ),
              error: (_, _) =>
                  const SliverToBoxAdapter(child: SizedBox.shrink()),
              data: (stats) => stats.deviceUsage.isEmpty
                  ? const SliverToBoxAdapter(child: SizedBox.shrink())
                  : SliverPadding(
                      padding: padding.copyWith(top: AppSpacing.lg, bottom: 0),
                      sliver: SliverToBoxAdapter(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SectionHeader(title: 'Dispositivos (30d)'),
                            const SizedBox(height: AppSpacing.sm),
                            DeviceUsageSection(
                              deviceUsage: stats.deviceUsage,
                              total: stats.pageViews30d,
                            ),
                          ],
                        ),
                      ),
                    ),
            ),

            // ── Sección: Top proyectos / Ranking ──────────────────────────
            statsAsync.when(
              loading: () => SliverPadding(
                padding: padding.copyWith(top: AppSpacing.lg, bottom: 0),
                sliver: SliverToBoxAdapter(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const ShimmerLoader(
                        child: ShimmerBox(
                          width: 200,
                          height: 18,
                          borderRadius: 6,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      ...List.generate(
                        5,
                        (_) => const Padding(
                          padding: EdgeInsets.only(bottom: AppSpacing.sm),
                          child: SkeletonRankingItem(),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              error: (_, _) =>
                  const SliverToBoxAdapter(child: SizedBox.shrink()),
              data: (stats) => stats.topProjects.isEmpty
                  ? const SliverToBoxAdapter(child: SizedBox.shrink())
                  : SliverPadding(
                      padding: padding.copyWith(top: AppSpacing.lg, bottom: 0),
                      sliver: SliverToBoxAdapter(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SectionHeader(title: 'Top proyectos (30d)'),
                            const SizedBox(height: AppSpacing.sm),
                            TopRankingSection(
                              items: [
                                for (final p in stats.topProjects)
                                  (p.label, p.count),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
            ),

            // ── Sección: Visitantes por ubicación / Mapa ─────────────────
            statsAsync.when(
              loading: () => SliverPadding(
                padding: padding.copyWith(top: AppSpacing.lg, bottom: 0),
                sliver: const SliverToBoxAdapter(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ShimmerLoader(
                        child: ShimmerBox(
                          width: 240,
                          height: 18,
                          borderRadius: 6,
                        ),
                      ),
                      SizedBox(height: AppSpacing.sm),
                      SkeletonVisitorsMap(),
                    ],
                  ),
                ),
              ),
              error: (_, _) =>
                  const SliverToBoxAdapter(child: SizedBox.shrink()),
              data: (stats) => stats.topLocations.isEmpty
                  ? const SliverToBoxAdapter(child: SizedBox.shrink())
                  : SliverPadding(
                      padding: padding.copyWith(top: AppSpacing.lg, bottom: 0),
                      sliver: SliverToBoxAdapter(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SectionHeader(
                              title: 'Visitantes por ubicación (30d)',
                            ),
                            const SizedBox(height: AppSpacing.sm),
                            RepaintBoundary(
                              child: VisitorsMapWidget(
                                locations: stats.topLocations,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
            ),

            const SliverPadding(
              padding: EdgeInsets.only(bottom: AppSpacing.xxxl),
            ),
          ],
        ),
      ),
    );
  }
}
