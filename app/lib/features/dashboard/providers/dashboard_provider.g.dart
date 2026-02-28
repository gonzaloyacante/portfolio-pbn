// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dashboard_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Provee las métricas del dashboard con auto-refresh.
///
/// Se invalida automáticamente al hacer pull-to-refresh desde [DashboardPage].

@ProviderFor(dashboardStats)
final dashboardStatsProvider = DashboardStatsProvider._();

/// Provee las métricas del dashboard con auto-refresh.
///
/// Se invalida automáticamente al hacer pull-to-refresh desde [DashboardPage].

final class DashboardStatsProvider
    extends
        $FunctionalProvider<
          AsyncValue<DashboardStats>,
          DashboardStats,
          FutureOr<DashboardStats>
        >
    with $FutureModifier<DashboardStats>, $FutureProvider<DashboardStats> {
  /// Provee las métricas del dashboard con auto-refresh.
  ///
  /// Se invalida automáticamente al hacer pull-to-refresh desde [DashboardPage].
  DashboardStatsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'dashboardStatsProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$dashboardStatsHash();

  @$internal
  @override
  $FutureProviderElement<DashboardStats> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<DashboardStats> create(Ref ref) {
    return dashboardStats(ref);
  }
}

String _$dashboardStatsHash() => r'1e569f721a0a97874e876c1fe7e1613a209ec571';

/// Provee los datos de tendencias para los gráficos del dashboard.

@ProviderFor(dashboardCharts)
final dashboardChartsProvider = DashboardChartsProvider._();

/// Provee los datos de tendencias para los gráficos del dashboard.

final class DashboardChartsProvider
    extends
        $FunctionalProvider<
          AsyncValue<DashboardCharts>,
          DashboardCharts,
          FutureOr<DashboardCharts>
        >
    with $FutureModifier<DashboardCharts>, $FutureProvider<DashboardCharts> {
  /// Provee los datos de tendencias para los gráficos del dashboard.
  DashboardChartsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'dashboardChartsProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$dashboardChartsHash();

  @$internal
  @override
  $FutureProviderElement<DashboardCharts> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<DashboardCharts> create(Ref ref) {
    return dashboardCharts(ref);
  }
}

String _$dashboardChartsHash() => r'34aded17448a934363ebcfaf82175c3c18052982';
