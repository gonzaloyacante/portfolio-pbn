import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_names.dart';
import '../../../core/theme/app_colors.dart';
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
          sliver: SliverGrid.count(
            crossAxisCount: _gridColumns(context),
            childAspectRatio: 1.6,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
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
                color: const Color(0xFF059669),
              ),
            ],
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
          _PageViewsChart(data: charts.dailyPageViews),
          const SizedBox(height: 16),
          _BookingsBarChart(data: charts.monthlyBookings),
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

// ── _PageViewsChart ────────────────────────────────────────────────────────────

class _PageViewsChart extends StatelessWidget {
  const _PageViewsChart({required this.data});

  final List<ChartDataPoint> data;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textStyle = Theme.of(
      context,
    ).textTheme.labelSmall?.copyWith(color: scheme.outline, fontSize: 9);

    final spots = data.asMap().entries.map((e) {
      return FlSpot(e.key.toDouble(), e.value.count.toDouble());
    }).toList();

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: scheme.outlineVariant.withValues(alpha: 0.3)),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(12, 16, 16, 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Visitas diarias (7 días)',
              style: Theme.of(
                context,
              ).textTheme.labelMedium?.copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 160,
              child: LineChart(
                LineChartData(
                  lineTouchData: LineTouchData(
                    handleBuiltInTouches: true,
                    touchTooltipData: LineTouchTooltipData(
                      getTooltipColor: (_) =>
                          scheme.inverseSurface.withValues(alpha: 0.9),
                      getTooltipItems: (spots) => spots
                          .map(
                            (s) => LineTooltipItem(
                              '${s.y.toInt()} visitas',
                              TextStyle(
                                color: scheme.onInverseSurface,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          )
                          .toList(),
                    ),
                  ),
                  lineBarsData: [
                    LineChartBarData(
                      spots: spots.isEmpty ? [const FlSpot(0, 0)] : spots,
                      isCurved: true,
                      curveSmoothness: 0.35,
                      color: AppColors.lightPrimary,
                      barWidth: 2.5,
                      dotData: FlDotData(
                        show: true,
                        getDotPainter: (spot, _, _, _) => FlDotCirclePainter(
                          radius: 3,
                          color: AppColors.lightPrimary,
                          strokeWidth: 1.5,
                          strokeColor: Colors.white,
                        ),
                      ),
                      belowBarData: BarAreaData(
                        show: true,
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            AppColors.lightPrimary.withValues(alpha: 0.18),
                            AppColors.lightPrimary.withValues(alpha: 0.0),
                          ],
                        ),
                      ),
                    ),
                  ],
                  gridData: FlGridData(
                    show: true,
                    drawVerticalLine: false,
                    horizontalInterval: 1,
                    getDrawingHorizontalLine: (_) => FlLine(
                      color: scheme.outlineVariant.withValues(alpha: 0.3),
                      strokeWidth: 1,
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  titlesData: _buildLineTitles(data, textStyle),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  FlTitlesData _buildLineTitles(
    List<ChartDataPoint> data,
    TextStyle? textStyle,
  ) {
    return FlTitlesData(
      topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      leftTitles: AxisTitles(
        sideTitles: SideTitles(
          showTitles: true,
          reservedSize: 28,
          getTitlesWidget: (value, _) =>
              Text(value.toInt().toString(), style: textStyle),
        ),
      ),
      bottomTitles: AxisTitles(
        sideTitles: SideTitles(
          showTitles: true,
          interval: 1,
          reservedSize: 24,
          getTitlesWidget: (value, _) {
            final idx = value.toInt();
            if (idx < 0 || idx >= data.length) return const SizedBox.shrink();
            return Padding(
              padding: const EdgeInsets.only(top: 4),
              child: Text(data[idx].label, style: textStyle),
            );
          },
        ),
      ),
    );
  }
}

// ── _BookingsBarChart ──────────────────────────────────────────────────────────

class _BookingsBarChart extends StatelessWidget {
  const _BookingsBarChart({required this.data});

  final List<ChartDataPoint> data;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textStyle = Theme.of(
      context,
    ).textTheme.labelSmall?.copyWith(color: scheme.outline, fontSize: 9);

    final barGroups = data.asMap().entries.map((e) {
      return BarChartGroupData(
        x: e.key,
        barRods: [
          BarChartRodData(
            toY: e.value.count.toDouble(),
            color: AppColors.darkPrimary,
            width: 16,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
          ),
        ],
      );
    }).toList();

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: scheme.outlineVariant.withValues(alpha: 0.3)),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(12, 16, 16, 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Reservas mensuales (6 meses)',
              style: Theme.of(
                context,
              ).textTheme.labelMedium?.copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 160,
              child: BarChart(
                BarChartData(
                  barTouchData: BarTouchData(
                    handleBuiltInTouches: true,
                    touchTooltipData: BarTouchTooltipData(
                      getTooltipColor: (_) =>
                          scheme.inverseSurface.withValues(alpha: 0.9),
                      getTooltipItem: (group, groupIndex, rod, rodIndex) =>
                          BarTooltipItem(
                            '${rod.toY.toInt()} reservas',
                            TextStyle(
                              color: scheme.onInverseSurface,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                    ),
                  ),
                  barGroups: barGroups,
                  borderData: FlBorderData(show: false),
                  gridData: FlGridData(
                    show: true,
                    drawVerticalLine: false,
                    getDrawingHorizontalLine: (_) => FlLine(
                      color: scheme.outlineVariant.withValues(alpha: 0.3),
                      strokeWidth: 1,
                    ),
                  ),
                  titlesData: _buildBarTitles(data, textStyle),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  FlTitlesData _buildBarTitles(
    List<ChartDataPoint> data,
    TextStyle? textStyle,
  ) {
    return FlTitlesData(
      topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      leftTitles: AxisTitles(
        sideTitles: SideTitles(
          showTitles: true,
          reservedSize: 28,
          getTitlesWidget: (value, _) =>
              Text(value.toInt().toString(), style: textStyle),
        ),
      ),
      bottomTitles: AxisTitles(
        sideTitles: SideTitles(
          showTitles: true,
          interval: 1,
          reservedSize: 24,
          getTitlesWidget: (value, _) {
            final idx = value.toInt();
            if (idx < 0 || idx >= data.length) return const SizedBox.shrink();
            return Padding(
              padding: const EdgeInsets.only(top: 4),
              child: Text(data[idx].label, style: textStyle),
            );
          },
        ),
      ),
    );
  }
}
