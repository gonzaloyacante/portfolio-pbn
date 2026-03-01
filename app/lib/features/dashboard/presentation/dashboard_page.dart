import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_radius.dart';
import 'widgets/page_views_chart.dart';
import 'widgets/bookings_bar_chart.dart';
import 'widgets/alerts_section.dart';
import 'widgets/quick_actions.dart';
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
        // ── Bienvenida ────────────────────────────────────────────────────
        SliverPadding(
          padding: padding.copyWith(bottom: AppSpacing.md),
          sliver: const SliverToBoxAdapter(child: _DashboardGreeting()),
        ),

        // ── Sección: Alertas ─────────────────────────────────────────────
        SliverPadding(
          padding: padding.copyWith(bottom: AppSpacing.sm),
          sliver: SliverToBoxAdapter(child: AlertsSection(stats: stats)),
        ),

        // ── Sección: Acciones rápidas ────────────────────────────────────
        SliverPadding(
          padding: padding.copyWith(top: 0, bottom: AppSpacing.md),
          sliver: const SliverToBoxAdapter(child: QuickActions()),
        ),

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

        // ── Sección: Dispositivos ─────────────────────────────────────────
        if (stats.deviceUsage.isNotEmpty) ...[
          SliverPadding(
            padding: padding.copyWith(
              top: AppSpacing.lg,
              bottom: AppSpacing.sm,
            ),
            sliver: SliverToBoxAdapter(
              child: SectionHeader(title: 'Dispositivos (30d)'),
            ),
          ),
          SliverPadding(
            padding: padding.copyWith(top: 0),
            sliver: SliverToBoxAdapter(
              child: _DeviceUsageSection(
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
            sliver: SliverToBoxAdapter(
              child: SectionHeader(title: 'Top proyectos (30d)'),
            ),
          ),
          SliverPadding(
            padding: padding.copyWith(top: 0),
            sliver: SliverToBoxAdapter(
              child: _TopRankingSection(
                items: [for (final p in stats.topProjects) (p.label, p.count)],
              ),
            ),
          ),
        ],

        // ── Sección: Top ubicaciones ──────────────────────────────────────
        if (stats.topLocations.isNotEmpty) ...[
          SliverPadding(
            padding: padding.copyWith(
              top: AppSpacing.lg,
              bottom: AppSpacing.sm,
            ),
            sliver: SliverToBoxAdapter(
              child: SectionHeader(title: 'Top ubicaciones (30d)'),
            ),
          ),
          SliverPadding(
            padding: padding.copyWith(top: 0),
            sliver: SliverToBoxAdapter(
              child: _TopRankingSection(
                items: [for (final l in stats.topLocations) (l.label, l.count)],
              ),
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
                childAspectRatio: 1.1,
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

// ── _DeviceUsageSection ───────────────────────────────────────────────────────

class _DeviceUsageSection extends StatelessWidget {
  const _DeviceUsageSection({required this.deviceUsage, required this.total});

  final Map<String, int> deviceUsage;
  final int total;

  static const _icons = {
    'mobile': Icons.smartphone_outlined,
    'tablet': Icons.tablet_outlined,
    'desktop': Icons.computer_outlined,
  };

  static const _labels = {
    'mobile': 'Móvil',
    'tablet': 'Tablet',
    'desktop': 'Escritorio',
  };

  static const _colors = {
    'mobile': AppColors.lightPrimary,
    'tablet': AppColors.warning,
    'desktop': AppColors.success,
  };

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final safeTotal = total > 0 ? total : 1;

    final sorted = deviceUsage.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Row(
          children: sorted.map((entry) {
            final pct = (entry.value / safeTotal * 100).round();
            final color = _colors[entry.key] ?? AppColors.lightPrimary;
            return Expanded(
              child: Column(
                children: [
                  Icon(
                    _icons[entry.key] ?? Icons.devices_outlined,
                    color: color,
                    size: 28,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '$pct%',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
                  ),
                  Text(
                    _labels[entry.key] ?? entry.key,
                    style: theme.textTheme.bodySmall,
                  ),
                  Text(
                    '${entry.value} visitas',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurface.withOpacity(0.5),
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}

// ── _TopRankingSection ────────────────────────────────────────────────────────

class _TopRankingSection extends StatelessWidget {
  const _TopRankingSection({required this.items});

  final List<(String, int)> items;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final maxCount = items.isEmpty
        ? 1
        : items.map((e) => e.$2).reduce((a, b) => a > b ? a : b);

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.base,
          vertical: AppSpacing.sm,
        ),
        child: Column(
          children: items.asMap().entries.map((entry) {
            final rank = entry.key + 1;
            final (label, count) = entry.value;
            final progress = count / maxCount;
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: AppSpacing.xs),
              child: Row(
                children: [
                  SizedBox(
                    width: 24,
                    child: Text(
                      '$rank',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.4),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                label,
                                style: theme.textTheme.bodyMedium,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            Text(
                              '$count',
                              style: theme.textTheme.bodySmall?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: theme.colorScheme.primary,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: progress,
                            minHeight: 4,
                            backgroundColor: theme.colorScheme.primary
                                .withOpacity(0.12),
                            valueColor: AlwaysStoppedAnimation<Color>(
                              theme.colorScheme.primary,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}

// ── _DashboardGreeting ────────────────────────────────────────────────────────

/// Banner de bienvenida con saludo horario y fecha actual en español.
class _DashboardGreeting extends StatelessWidget {
  const _DashboardGreeting();

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 13) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  }

  String _formattedDate() {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ];
    const days = [
      'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo',
    ];
    final now = DateTime.now();
    return '${days[now.weekday - 1]} ${now.day} de ${months[now.month - 1]}';
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = colorScheme.primary;

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isDark
              ? [primary.withAlpha(80), colorScheme.secondary.withAlpha(50)]
              : [primary.withAlpha(38), colorScheme.secondary.withAlpha(22)],
        ),
        borderRadius: BorderRadius.circular(AppRadius.card),
      ),
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.base,
        vertical: AppSpacing.md,
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${_greeting()}, Paola 👋',
                  style: textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w700,
                    color: colorScheme.onSurface,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _formattedDate(),
                  style: textTheme.bodyMedium?.copyWith(
                    color: colorScheme.onSurface.withAlpha(160),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: primary.withAlpha(isDark ? 70 : 40),
              borderRadius: BorderRadius.circular(16),
            ),
            alignment: Alignment.center,
            child: Icon(Icons.spa_outlined, color: primary, size: 28),
          ),
        ],
      ),
    );
  }
}
