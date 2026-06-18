// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_overview.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AnalyticsOverview _$AnalyticsOverviewFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('AnalyticsOverview', json, ($checkedConvert) {
  $checkKeys(
    json,
    requiredKeys: const [
      'totalImages',
      'totalCategories',
      'totalServices',
      'totalTestimonials',
      'newContacts',
      'pendingBookings',
      'pendingTestimonials',
      'trashCount',
      'pageViews30d',
      'uniqueVisitors30d',
      'deviceUsage',
      'topLocations',
      'topCategories',
      'analyticsDisabled',
    ],
  );
  final val = AnalyticsOverview(
    totalImages: $checkedConvert('totalImages', (v) => v as num),
    totalCategories: $checkedConvert('totalCategories', (v) => v as num),
    totalServices: $checkedConvert('totalServices', (v) => v as num),
    totalTestimonials: $checkedConvert('totalTestimonials', (v) => v as num),
    newContacts: $checkedConvert('newContacts', (v) => v as num),
    pendingBookings: $checkedConvert('pendingBookings', (v) => v as num),
    pendingTestimonials: $checkedConvert(
      'pendingTestimonials',
      (v) => v as num,
    ),
    trashCount: $checkedConvert('trashCount', (v) => v as num),
    pageViews30d: $checkedConvert('pageViews30d', (v) => v as num),
    uniqueVisitors30d: $checkedConvert('uniqueVisitors30d', (v) => v as num),
    deviceUsage: $checkedConvert(
      'deviceUsage',
      (v) =>
          (v as Map<String, dynamic>).map((k, e) => MapEntry(k, e as Object)),
    ),
    topLocations: $checkedConvert(
      'topLocations',
      (v) => (v as List<dynamic>).map((e) => e as Object).toList(),
    ),
    topCategories: $checkedConvert(
      'topCategories',
      (v) => (v as List<dynamic>).map((e) => e as Object).toList(),
    ),
    analyticsDisabled: $checkedConvert('analyticsDisabled', (v) => v as bool),
  );
  return val;
});

Map<String, dynamic> _$AnalyticsOverviewToJson(AnalyticsOverview instance) =>
    <String, dynamic>{
      'totalImages': instance.totalImages,
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
      'topCategories': instance.topCategories,
      'analyticsDisabled': instance.analyticsDisabled,
    };
