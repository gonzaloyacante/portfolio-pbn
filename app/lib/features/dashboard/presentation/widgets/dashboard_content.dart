import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/theme/app_breakpoints.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../data/dashboard_repository.dart';
import 'dashboard_greeting.dart';
import 'dashboard_priority_section.dart';
import 'dashboard_quick_actions.dart';
import 'dashboard_stats_grid.dart';
import 'dashboard_traffic_info.dart';

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
        SliverPadding(
          padding: padding.copyWith(top: AppSpacing.lg, bottom: AppSpacing.sm),
          sliver: const SliverToBoxAdapter(
            child: SectionHeader(title: 'Qué necesita atención'),
          ),
        ),
        SliverPadding(
          padding: padding.copyWith(top: 0),
          sliver: SliverToBoxAdapter(
            child: DashboardPrioritySection(stats: stats),
          ),
        ),
        SliverPadding(
          padding: padding.copyWith(top: AppSpacing.lg, bottom: AppSpacing.sm),
          sliver: const SliverToBoxAdapter(
            child: SectionHeader(title: 'Accesos rápidos'),
          ),
        ),
        SliverPadding(
          padding: padding.copyWith(top: 0),
          sliver: const SliverToBoxAdapter(child: DashboardQuickActions()),
        ),
        SliverPadding(
          padding: padding.copyWith(top: AppSpacing.lg),
          sliver: const SliverToBoxAdapter(child: DashboardTrafficInfo()),
        ),
        const SliverPadding(padding: EdgeInsets.only(bottom: AppSpacing.xxxl)),
      ],
    );
  }
}
