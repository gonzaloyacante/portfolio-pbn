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

String _$dashboardStatsHash() => r'd12a950380585ae905ec700cf2bbdb05ffece7ea';
