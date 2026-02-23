// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dashboard_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$dashboardStatsHash() => r'1e569f721a0a97874e876c1fe7e1613a209ec571';

/// Provee las métricas del dashboard con auto-refresh.
///
/// Se invalida automáticamente al hacer pull-to-refresh desde [DashboardPage].
///
/// Copied from [dashboardStats].
@ProviderFor(dashboardStats)
final dashboardStatsProvider =
    AutoDisposeFutureProvider<DashboardStats>.internal(
      dashboardStats,
      name: r'dashboardStatsProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$dashboardStatsHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef DashboardStatsRef = AutoDisposeFutureProviderRef<DashboardStats>;
String _$dashboardChartsHash() => r'34aded17448a934363ebcfaf82175c3c18052982';

/// Provee los datos de tendencias para los gráficos del dashboard.
///
/// Copied from [dashboardCharts].
@ProviderFor(dashboardCharts)
final dashboardChartsProvider =
    AutoDisposeFutureProvider<DashboardCharts>.internal(
      dashboardCharts,
      name: r'dashboardChartsProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$dashboardChartsHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef DashboardChartsRef = AutoDisposeFutureProviderRef<DashboardCharts>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
