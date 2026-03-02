// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dashboard_repository.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_LocationStat _$LocationStatFromJson(Map<String, dynamic> json) =>
    _LocationStat(
      label: json['label'] as String,
      count: (json['count'] as num).toInt(),
      code: json['code'] as String?,
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      cities:
          (json['cities'] as List<dynamic>?)
              ?.map((e) => CityStat.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$LocationStatToJson(_LocationStat instance) =>
    <String, dynamic>{
      'label': instance.label,
      'count': instance.count,
      'code': instance.code,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'cities': instance.cities,
    };

_CityStat _$CityStatFromJson(Map<String, dynamic> json) => _CityStat(
  label: json['label'] as String,
  count: (json['count'] as num).toInt(),
  percent: (json['percent'] as num?)?.toInt() ?? 0,
  latitude: (json['latitude'] as num?)?.toDouble(),
  longitude: (json['longitude'] as num?)?.toDouble(),
);

Map<String, dynamic> _$CityStatToJson(_CityStat instance) => <String, dynamic>{
  'label': instance.label,
  'count': instance.count,
  'percent': instance.percent,
  'latitude': instance.latitude,
  'longitude': instance.longitude,
};

_DashboardStats _$DashboardStatsFromJson(Map<String, dynamic> json) =>
    _DashboardStats(
      totalProjects: (json['totalProjects'] as num?)?.toInt() ?? 0,
      totalCategories: (json['totalCategories'] as num?)?.toInt() ?? 0,
      totalServices: (json['totalServices'] as num?)?.toInt() ?? 0,
      totalTestimonials: (json['totalTestimonials'] as num?)?.toInt() ?? 0,
      newContacts: (json['newContacts'] as num?)?.toInt() ?? 0,
      pendingBookings: (json['pendingBookings'] as num?)?.toInt() ?? 0,
      pendingTestimonials: (json['pendingTestimonials'] as num?)?.toInt() ?? 0,
      trashCount: (json['trashCount'] as num?)?.toInt() ?? 0,
      pageViews30d: (json['pageViews30d'] as num?)?.toInt() ?? 0,
      uniqueVisitors30d: (json['uniqueVisitors30d'] as num?)?.toInt() ?? 0,
      deviceUsage:
          (json['deviceUsage'] as Map<String, dynamic>?)?.map(
            (k, e) => MapEntry(k, (e as num).toInt()),
          ) ??
          const {},
      topLocations:
          (json['topLocations'] as List<dynamic>?)
              ?.map((e) => LocationStat.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      topProjects:
          (json['topProjects'] as List<dynamic>?)
              ?.map((e) => ChartDataPoint.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$DashboardStatsToJson(_DashboardStats instance) =>
    <String, dynamic>{
      'totalProjects': instance.totalProjects,
      'totalCategories': instance.totalCategories,
      'totalServices': instance.totalServices,
      'totalTestimonials': instance.totalTestimonials,
      'newContacts': instance.newContacts,
      'pendingBookings': instance.pendingBookings,
      'pendingTestimonials': instance.pendingTestimonials,
      'trashCount': instance.trashCount,
      'pageViews30d': instance.pageViews30d,
      'uniqueVisitors30d': instance.uniqueVisitors30d,
      'deviceUsage': instance.deviceUsage,
      'topLocations': instance.topLocations,
      'topProjects': instance.topProjects,
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
        isAutoDispose: false,
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
    r'a341376f387b5b966d01fbef0fe1a3ecb790ada3';
