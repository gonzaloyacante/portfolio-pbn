//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'analytics_overview.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AnalyticsOverview {
  /// Returns a new [AnalyticsOverview] instance.
  AnalyticsOverview({

    required  this.totalImages,

    required  this.totalCategories,

    required  this.totalServices,

    required  this.totalTestimonials,

    required  this.newContacts,

    required  this.pendingBookings,

    required  this.pendingTestimonials,

    required  this.trashCount,

    required  this.pageViews30d,

    required  this.uniqueVisitors30d,

    required  this.deviceUsage,

    required  this.topLocations,

    required  this.topCategories,

    required  this.analyticsDisabled,
  });

  @JsonKey(
    
    name: r'totalImages',
    required: true,
    includeIfNull: false,
  )


  final num totalImages;



  @JsonKey(
    
    name: r'totalCategories',
    required: true,
    includeIfNull: false,
  )


  final num totalCategories;



  @JsonKey(
    
    name: r'totalServices',
    required: true,
    includeIfNull: false,
  )


  final num totalServices;



  @JsonKey(
    
    name: r'totalTestimonials',
    required: true,
    includeIfNull: false,
  )


  final num totalTestimonials;



  @JsonKey(
    
    name: r'newContacts',
    required: true,
    includeIfNull: false,
  )


  final num newContacts;



  @JsonKey(
    
    name: r'pendingBookings',
    required: true,
    includeIfNull: false,
  )


  final num pendingBookings;



  @JsonKey(
    
    name: r'pendingTestimonials',
    required: true,
    includeIfNull: false,
  )


  final num pendingTestimonials;



  @JsonKey(
    
    name: r'trashCount',
    required: true,
    includeIfNull: false,
  )


  final num trashCount;



  @JsonKey(
    
    name: r'pageViews30d',
    required: true,
    includeIfNull: false,
  )


  final num pageViews30d;



  @JsonKey(
    
    name: r'uniqueVisitors30d',
    required: true,
    includeIfNull: false,
  )


  final num uniqueVisitors30d;



  @JsonKey(
    
    name: r'deviceUsage',
    required: true,
    includeIfNull: false,
  )


  final Map<String, Object> deviceUsage;



  @JsonKey(
    
    name: r'topLocations',
    required: true,
    includeIfNull: false,
  )


  final List<Object> topLocations;



  @JsonKey(
    
    name: r'topCategories',
    required: true,
    includeIfNull: false,
  )


  final List<Object> topCategories;



  @JsonKey(
    
    name: r'analyticsDisabled',
    required: true,
    includeIfNull: false,
  )


  final bool analyticsDisabled;





    @override
    bool operator ==(Object other) => identical(this, other) || other is AnalyticsOverview &&
      other.totalImages == totalImages &&
      other.totalCategories == totalCategories &&
      other.totalServices == totalServices &&
      other.totalTestimonials == totalTestimonials &&
      other.newContacts == newContacts &&
      other.pendingBookings == pendingBookings &&
      other.pendingTestimonials == pendingTestimonials &&
      other.trashCount == trashCount &&
      other.pageViews30d == pageViews30d &&
      other.uniqueVisitors30d == uniqueVisitors30d &&
      other.deviceUsage == deviceUsage &&
      other.topLocations == topLocations &&
      other.topCategories == topCategories &&
      other.analyticsDisabled == analyticsDisabled;

    @override
    int get hashCode =>
        totalImages.hashCode +
        totalCategories.hashCode +
        totalServices.hashCode +
        totalTestimonials.hashCode +
        newContacts.hashCode +
        pendingBookings.hashCode +
        pendingTestimonials.hashCode +
        trashCount.hashCode +
        pageViews30d.hashCode +
        uniqueVisitors30d.hashCode +
        deviceUsage.hashCode +
        topLocations.hashCode +
        topCategories.hashCode +
        analyticsDisabled.hashCode;

  factory AnalyticsOverview.fromJson(Map<String, dynamic> json) => _$AnalyticsOverviewFromJson(json);

  Map<String, dynamic> toJson() => _$AnalyticsOverviewToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

