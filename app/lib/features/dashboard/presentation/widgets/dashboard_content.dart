import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/theme/app_breakpoints.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../data/dashboard_repository.dart';
import 'dashboard_charts.dart';
import 'dashboard_greeting.dart';
import 'dashboard_stats_grid.dart';
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
          sliver: DashboardStatsGrid(stats: stats),
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

        // ── Sección: Top categorías ────────────────────────────────────
        if (stats.topCategories.isNotEmpty) ...[
          SliverPadding(
            padding: padding.copyWith(
              top: AppSpacing.lg,
              bottom: AppSpacing.sm,
            ),
            sliver: const SliverToBoxAdapter(
              child: SectionHeader(title: 'Top categorías (30d)'),
            ),
          ),
          SliverPadding(
            padding: padding.copyWith(top: 0),
            sliver: SliverToBoxAdapter(
              child: TopRankingSection(
                items: [
                  for (final p in stats.topCategories) (p.label, p.count),
                ],
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
}
