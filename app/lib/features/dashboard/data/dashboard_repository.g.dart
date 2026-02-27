// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dashboard_repository.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DashboardStats _$DashboardStatsFromJson(Map<String, dynamic> json) =>
    _DashboardStats(
      totalProjects: (json['totalProjects'] as num?)?.toInt() ?? 0,
      totalCategories: (json['totalCategories'] as num?)?.toInt() ?? 0,
      totalServices: (json['totalServices'] as num?)?.toInt() ?? 0,
      totalTestimonials: (json['totalTestimonials'] as num?)?.toInt() ?? 0,
      newContacts: (json['newContacts'] as num?)?.toInt() ?? 0,
      pendingBookings: (json['pendingBookings'] as num?)?.toInt() ?? 0,
      pageViews30d: (json['pageViews30d'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$DashboardStatsToJson(_DashboardStats instance) =>
    <String, dynamic>{
      'totalProjects': instance.totalProjects,
      'totalCategories': instance.totalCategories,
      'totalServices': instance.totalServices,
      'totalTestimonials': instance.totalTestimonials,
      'newContacts': instance.newContacts,
      'pendingBookings': instance.pendingBookings,
      'pageViews30d': instance.pageViews30d,
    };

_ChartDataPoint _$ChartDataPointFromJson(Map<String, dynamic> json) =>
    _ChartDataPoint(
      label: json['label'] as String,
      count: (json['count'] as num).toInt(),
    );

Map<String, dynamic> _$ChartDataPointToJson(_ChartDataPoint instance) =>
    <String, dynamic>{'label': instance.label, 'count': instance.count};

_DashboardCharts _$DashboardChartsFromJson(Map<String, dynamic> json) =>
    _DashboardCharts(
      dailyPageViews:
          (json['dailyPageViews'] as List<dynamic>?)
              ?.map((e) => ChartDataPoint.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      monthlyBookings:
          (json['monthlyBookings'] as List<dynamic>?)
              ?.map((e) => ChartDataPoint.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$DashboardChartsToJson(_DashboardCharts instance) =>
    <String, dynamic>{
      'dailyPageViews': instance.dailyPageViews,
      'monthlyBookings': instance.monthlyBookings,
    };

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(dashboardRepository)
final dashboardRepositoryProvider = DashboardRepositoryProvider._();

final class DashboardRepositoryProvider
    extends
        $FunctionalProvider<
          DashboardRepository,
          DashboardRepository,
          DashboardRepository
        >
    with $Provider<DashboardRepository> {
  DashboardRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'dashboardRepositoryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$dashboardRepositoryHash();

  @$internal
  @override
  $ProviderElement<DashboardRepository> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  DashboardRepository create(Ref ref) {
    return dashboardRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(DashboardRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<DashboardRepository>(value),
    );
  }
}

String _$dashboardRepositoryHash() =>
    r'9e1d19f1b9966ea45739ad0535c4759562482815';
