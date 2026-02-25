import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_names.dart';
import '../../../core/theme/app_colors.dart';
import 'widgets/page_views_chart.dart';
import 'widgets/bookings_bar_chart.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/error_state.dart';
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
    return CustomScrollView(
      slivers: [
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 8),
          sliver: SliverToBoxAdapter(
            child: Text(
              'Resumen general',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
            ),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          sliver: SliverToBoxAdapter(
            child: LayoutBuilder(
              builder: (context, constraints) {
                final cols = _gridColumns(context);
                final spacing = 10.0;
                final totalSpacing = spacing * (cols - 1);
                final itemWidth = (constraints.maxWidth - totalSpacing) / cols;

                final items = [
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
                    color: const Color(0xFF7C3AED),
                    onTap: () => context.goNamed(RouteNames.categories),
                  ),
                  StatCard(
                    icon: Icons.design_services_outlined,
                    label: 'Servicios',
                    value: stats.totalServices.toString(),
                    color: const Color(0xFF0891B2),
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
                    icon: Icons.remove_red_eye_outlined,
                    label: 'Visitas (30d)',
                    value: _formatNumber(stats.pageViews30d),
                    color: const Color(0xFF059669),
                  ),
                ];

                return Wrap(
                  spacing: spacing,
                  runSpacing: spacing,
                  children: items
                      .map((w) => SizedBox(width: itemWidth, child: w))
                      .toList(),
                );
              },
            ),
          ),
        ),
        const SliverPadding(padding: EdgeInsets.only(bottom: 4)),

        // ── Sección de tendencias ────────────────────────────────────────
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          sliver: SliverToBoxAdapter(
            child: Text(
              'Tendencias',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
            ),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          sliver: SliverToBoxAdapter(child: _DashboardCharts()),
        ),
        const SliverPadding(padding: EdgeInsets.only(bottom: 32)),
      ],
    );
  }

  int _gridColumns(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width >= 1200) return 4;
    if (width >= 800) return 3;
    return 2;
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
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 16),
      child: GridView.count(
        crossAxisCount: 2,
        childAspectRatio: 1.6,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        children: List.generate(
          6,
          (_) => ShimmerBox(
            width: double.infinity,
            height: double.infinity,
            borderRadius: 16,
          ),
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
class _DashboardCharts extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final chartsAsync = ref.watch(dashboardChartsProvider);

    return chartsAsync.when(
      loading: () => _buildSkeleton(),
      error: (_, _) => const SizedBox.shrink(),
      data: (charts) => Column(
        children: [
          PageViewsChart(data: charts.dailyPageViews),
          const SizedBox(height: 16),
          BookingsBarChart(data: charts.monthlyBookings),
        ],
      ),
    );
  }

  Widget _buildSkeleton() {
    return Column(
      children: [
        ShimmerBox(width: double.infinity, height: 180, borderRadius: 16),
        const SizedBox(height: 16),
        ShimmerBox(width: double.infinity, height: 180, borderRadius: 16),
      ],
    );
  }
}

// Chart widgets extracted to `widgets/` to keep this file small and maintainable.
