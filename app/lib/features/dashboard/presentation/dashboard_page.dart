import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import 'widgets/page_views_chart.dart';
import 'widgets/bookings_bar_chart.dart';
import '../../../shared/widgets/adaptive_grid.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/section_header.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../../../shared/widgets/stat_card.dart';
import '../data/dashboard_repository.dart';
import '../providers/dashboard_provider.dart';

// ── DashboardPage ─────────────────────────────────────────────────────────────

/// Pantalla principal del panel de administración.
///
/// Muestra estadísticas globales y actividad reciente.
/// Soporta pull-to-refresh para recargar métricas.
class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(dashboardStatsProvider);

    return AppScaffold(
      title: 'Dashboard',
      actions: [
        IconButton(
          icon: const Icon(Icons.refresh_rounded),
          tooltip: 'Actualizar',
          onPressed: () => ref.invalidate(dashboardStatsProvider),
        ),
      ],
      body: RefreshIndicator(
        onRefresh: () async => ref.invalidate(dashboardStatsProvider),
        child: statsAsync.when(
          loading: () => const _DashboardSkeleton(),
          error: (err, _) => ErrorState(
            message: 'No se pudieron cargar las métricas',
            onRetry: () => ref.invalidate(dashboardStatsProvider),
          ),
          data: (stats) => _DashboardContent(stats: stats),
        ),
      ),
    );
  }
}

// ── _DashboardContent ──────────────────────────────────────────────────────────

class _DashboardContent extends StatelessWidget {
  const _DashboardContent({required this.stats});

  final DashboardStats stats;

  @override
  Widget build(BuildContext context) {
    final padding = AppBreakpoints.pagePadding(context);

    return CustomScrollView(
      slivers: [
        // ── Sección: Resumen ─────────────────────────────────────────────
        SliverPadding(
          padding: padding.copyWith(bottom: AppSpacing.sm),
          sliver: SliverToBoxAdapter(
            child: SectionHeader(title: 'Resumen general'),
          ),
        ),
        SliverPadding(
          padding: padding.copyWith(top: 0, bottom: 0),
          sliver: SliverAdaptiveGrid(
            compactCols: 2,
            mediumCols: 3,
            expandedCols: 4,
            childAspectRatio: 1.45,
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
                icon: Icons.remove_red_eye_outlined,
                label: 'Visitas (30d)',
                value: _formatNumber(stats.pageViews30d),
                color: AppColors.success,
              ),
            ],
          ),
        ),
        const SliverPadding(padding: EdgeInsets.only(bottom: AppSpacing.md)),

        // ── Sección: Tendencias ──────────────────────────────────────────
        SliverPadding(
          padding: padding.copyWith(bottom: AppSpacing.sm),
          sliver: SliverToBoxAdapter(child: SectionHeader(title: 'Tendencias')),
        ),
        SliverPadding(
          padding: padding.copyWith(top: 0),
          sliver: SliverToBoxAdapter(child: _DashboardCharts()),
        ),
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

// ── _DashboardSkeleton ────────────────────────────────────────────────────────

class _DashboardSkeleton extends StatelessWidget {
  const _DashboardSkeleton();

  @override
  Widget build(BuildContext context) {
    final padding = AppBreakpoints.pagePadding(context);

    return ShimmerLoader(
      child: SingleChildScrollView(
        physics: const NeverScrollableScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: padding.copyWith(bottom: AppSpacing.sm),
              child: ShimmerBox(width: 160, height: 18, borderRadius: 6),
            ),
            Padding(
              padding: padding.copyWith(top: 0, bottom: 0),
              child: SkeletonGridView(
                itemCount: 7,
                compactCols: 2,
                childAspectRatio: 1.45,
              ),
            ),
            const SizedBox(height: AppSpacing.xl),
            Padding(
              padding: padding.copyWith(bottom: AppSpacing.sm),
              child: ShimmerBox(width: 120, height: 18, borderRadius: 6),
            ),
            Padding(
              padding: padding.copyWith(top: 0),
              child: Column(
                children: [
                  ShimmerBox(
                    width: double.infinity,
                    height: 180,
                    borderRadius: 16,
                  ),
                  const SizedBox(height: AppSpacing.base),
                  ShimmerBox(
                    width: double.infinity,
                    height: 180,
                    borderRadius: 16,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
// ── _DashboardCharts ──────────────────────────────────────────────────────────

/// Sección de gráficos de tendencias del dashboard.
///
/// Muestra:
/// - Visitas diarias de los últimos 7 días (LineChart).
/// - Reservas mensuales de los últimos 6 meses (BarChart).
/// En pantallas expanded (≥840px), los gráficos se muestran lado a lado.
class _DashboardCharts extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final chartsAsync = ref.watch(dashboardChartsProvider);
    final isExpanded = AppBreakpoints.isExpanded(context);

    return chartsAsync.when(
      loading: () => _buildSkeleton(isExpanded),
      error: (_, _) => const SizedBox.shrink(),
      data: (charts) {
        final pageViewsChart = PageViewsChart(data: charts.dailyPageViews);
        final bookingsChart = BookingsBarChart(data: charts.monthlyBookings);

        if (isExpanded) {
          return IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Expanded(child: pageViewsChart),
                const SizedBox(width: AppSpacing.base),
                Expanded(child: bookingsChart),
              ],
            ),
          );
        }

        return Column(
          children: [
            pageViewsChart,
            const SizedBox(height: AppSpacing.base),
            bookingsChart,
          ],
        );
      },
    );
  }

  Widget _buildSkeleton(bool isExpanded) {
    if (isExpanded) {
      return Row(
        children: [
          Expanded(
            child: ShimmerBox(
              width: double.infinity,
              height: 180,
              borderRadius: 16,
            ),
          ),
          const SizedBox(width: AppSpacing.base),
          Expanded(
            child: ShimmerBox(
              width: double.infinity,
              height: 180,
              borderRadius: 16,
            ),
          ),
        ],
      );
    }
    return Column(
      children: [
        ShimmerBox(width: double.infinity, height: 180, borderRadius: 16),
        const SizedBox(height: AppSpacing.base),
        ShimmerBox(width: double.infinity, height: 180, borderRadius: 16),
      ],
    );
  }
}

// Chart widgets extracted to `widgets/` to keep this file small and maintainable.
