import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../data/dashboard_repository.dart';

part 'dashboard_provider.g.dart';

// ── dashboardStatsProvider ────────────────────────────────────────────────────

/// Provee las métricas del dashboard con auto-refresh.
///
/// Se invalida automáticamente al hacer pull-to-refresh desde [DashboardPage].
@riverpod
Future<DashboardStats> dashboardStats(Ref ref) {
  ref.keepAlive();
  return ref.watch(dashboardRepositoryProvider).getOverview();
}

// ── dashboardChartsProvider ───────────────────────────────────────────────────

/// Provee los datos de tendencias para los gráficos del dashboard.
@riverpod
Future<DashboardCharts> dashboardCharts(Ref ref) {
  ref.keepAlive();
  return ref.watch(dashboardRepositoryProvider).getCharts();
}
