part of 'dashboard_page.dart';

extension _DashboardPageBuilders on DashboardPage {
  Widget _buildBody(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(dashboardStatsProvider);
    final padding = AppBreakpoints.pagePadding(context);

    return AppScaffold(
      title: 'Panel',
      actions: [
        IconButton(
          icon: const Icon(Icons.refresh_rounded),
          tooltip: 'Actualizar',
          onPressed: () => ref.invalidate(dashboardStatsProvider),
        ),
      ],
      body: RefreshIndicator(
        onRefresh: () async => ref.invalidate(dashboardStatsProvider),
        child: CustomScrollView(
          slivers: [
            SliverPadding(
              padding: padding.copyWith(bottom: AppSpacing.sm),
              sliver: const SliverToBoxAdapter(child: DashboardGreeting()),
            ),
            statsAsync.when(
              loading: () => _buildLoadingStats(context, padding),
              error: (err, _) => SliverPadding(
                padding: padding,
                sliver: SliverToBoxAdapter(
                  child: ErrorState.forFailure(
                    err,
                    fallbackMessage: 'No se pudo cargar el panel',
                    onRetry: () => ref.invalidate(dashboardStatsProvider),
                  ),
                ),
              ),
              data: (stats) => _buildDashboardData(context, stats, padding),
            ),
            const SliverPadding(
              padding: EdgeInsets.only(bottom: AppSpacing.xxxl),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingStats(BuildContext context, EdgeInsets padding) {
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
            itemCount: 4,
            itemBuilder: (BuildContext _, int _) => const SkeletonStatCard(),
          ),
        ),
      ),
    );
  }

  Widget _buildDashboardData(
    BuildContext context,
    DashboardStats stats,
    EdgeInsets padding,
  ) {
    return SliverMainAxisGroup(
      slivers: [
        SliverPadding(
          padding: padding.copyWith(top: 0, bottom: AppSpacing.sm),
          sliver: const SliverToBoxAdapter(
            child: SectionHeader(
              title: 'Qué necesita atención',
              subtitle: 'Lo importante aparece primero',
            ),
          ),
        ),
        SliverPadding(
          padding: padding.copyWith(top: 0, bottom: AppSpacing.lg),
          sliver: SliverToBoxAdapter(
            child: DashboardPrioritySection(stats: stats),
          ),
        ),
        SliverPadding(
          padding: padding.copyWith(top: 0, bottom: AppSpacing.sm),
          sliver: const SliverToBoxAdapter(
            child: SectionHeader(title: 'Contenido publicado'),
          ),
        ),
        DashboardStatsGrid(stats: stats),
        SliverPadding(
          padding: padding.copyWith(top: AppSpacing.lg, bottom: AppSpacing.sm),
          sliver: const SliverToBoxAdapter(
            child: SectionHeader(title: 'Accesos rápidos'),
          ),
        ),
        SliverPadding(
          padding: padding.copyWith(top: 0, bottom: AppSpacing.lg),
          sliver: const SliverToBoxAdapter(child: DashboardQuickActions()),
        ),
        SliverPadding(
          padding: padding.copyWith(top: 0),
          sliver: const SliverToBoxAdapter(child: DashboardTrafficInfo()),
        ),
      ],
    );
  }
}
