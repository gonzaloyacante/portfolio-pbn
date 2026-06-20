//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:portfolio_pbn_api/src/model/service_pricing_tier.dart';
import 'package:json_annotation/json_annotation.dart';

part 'service_detail.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ServiceDetail {
  /// Returns a new [ServiceDetail] instance.
  ServiceDetail({

    required  this.id,

    required  this.name,

    required  this.slug,

    required  this.description,

    required  this.shortDesc,

    required  this.price,

    required  this.priceLabel,

    required  this.currency,

    required  this.duration,

    required  this.durationMinutes,

    required  this.imageUrl,

    required  this.videoUrl,

    required  this.isActive,

    required  this.isFeatured,

    required  this.isAvailable,

    required  this.maxBookingsPerDay,

    required  this.advanceNoticeDays,

    required  this.sortOrder,

    required  this.requirements,

    required  this.cancellationPolicy,

    required  this.pricingTiers,

    required  this.createdAt,

    required  this.updatedAt,
  });

  @JsonKey(
    
    name: r'id',
    required: true,
    includeIfNull: false,
  )


  final String id;



  @JsonKey(
    
    name: r'name',
    required: true,
    includeIfNull: false,
  )


  final String name;



  @JsonKey(
    
    name: r'slug',
    required: true,
    includeIfNull: false,
  )


  final String slug;



  @JsonKey(
    
    name: r'description',
    required: true,
    includeIfNull: true,
  )


  final String? description;



  @JsonKey(
    
    name: r'shortDesc',
    required: true,
    includeIfNull: true,
  )


  final String? shortDesc;



  @JsonKey(
    
    name: r'price',
    required: true,
    includeIfNull: true,
  )


  final String? price;



  @JsonKey(
    
    name: r'priceLabel',
    required: true,
    includeIfNull: true,
  )


  final String? priceLabel;



  @JsonKey(
    
    name: r'currency',
    required: true,
    includeIfNull: false,
  )


  final String currency;



  @JsonKey(
    
    name: r'duration',
    required: true,
    includeIfNull: true,
  )


  final String? duration;



  @JsonKey(
    
    name: r'durationMinutes',
    required: true,
    includeIfNull: true,
  )


  final num? durationMinutes;



  @JsonKey(
    
    name: r'imageUrl',
    required: true,
    includeIfNull: true,
  )


  final String? imageUrl;



  @JsonKey(
    
    name: r'videoUrl',
    required: true,
    includeIfNull: true,
  )


  final String? videoUrl;



  @JsonKey(
    
    name: r'isActive',
    required: true,
    includeIfNull: false,
  )


  final bool isActive;



  @JsonKey(
    
    name: r'isFeatured',
    required: true,
    includeIfNull: false,
  )


  final bool isFeatured;



  @JsonKey(
    
    name: r'isAvailable',
    required: true,
    includeIfNull: false,
  )


  final bool isAvailable;



  @JsonKey(
    
    name: r'maxBookingsPerDay',
    required: true,
    includeIfNull: true,
  )


  final num? maxBookingsPerDay;



  @JsonKey(
    
    name: r'advanceNoticeDays',
    required: true,
    includeIfNull: true,
  )


  final num? advanceNoticeDays;



  @JsonKey(
    
    name: r'sortOrder',
    required: true,
    includeIfNull: false,
  )


  final num sortOrder;



  @JsonKey(
    
    name: r'requirements',
    required: true,
    includeIfNull: true,
  )


  final String? requirements;



  @JsonKey(
    
    name: r'cancellationPolicy',
    required: true,
    includeIfNull: true,
  )


  final String? cancellationPolicy;



  @JsonKey(
    
    name: r'pricingTiers',
    required: true,
    includeIfNull: false,
  )


  final List<ServicePricingTier> pricingTiers;



  @JsonKey(
    
    name: r'createdAt',
    required: true,
    includeIfNull: false,
  )


  final String createdAt;



  @JsonKey(
    
    name: r'updatedAt',
    required: true,
    includeIfNull: false,
  )


  final String updatedAt;





    @override
    bool operator ==(Object other) => identical(this, other) || other is ServiceDetail &&
      other.id == id &&
      other.name == name &&
      other.slug == slug &&
      other.description == description &&
      other.shortDesc == shortDesc &&
      other.price == price &&
      other.priceLabel == priceLabel &&
      other.currency == currency &&
      other.duration == duration &&
      other.durationMinutes == durationMinutes &&
      other.imageUrl == imageUrl &&
      other.videoUrl == videoUrl &&
      other.isActive == isActive &&
      other.isFeatured == isFeatured &&
      other.isAvailable == isAvailable &&
      other.maxBookingsPerDay == maxBookingsPerDay &&
      other.advanceNoticeDays == advanceNoticeDays &&
      other.sortOrder == sortOrder &&
      other.requirements == requirements &&
      other.cancellationPolicy == cancellationPolicy &&
      other.pricingTiers == pricingTiers &&
      other.createdAt == createdAt &&
      other.updatedAt == updatedAt;

    @override
    int get hashCode =>
        id.hashCode +
        name.hashCode +
        slug.hashCode +
        (description == null ? 0 : description.hashCode) +
        (shortDesc == null ? 0 : shortDesc.hashCode) +
        (price == null ? 0 : price.hashCode) +
        (priceLabel == null ? 0 : priceLabel.hashCode) +
        currency.hashCode +
        (duration == null ? 0 : duration.hashCode) +
        (durationMinutes == null ? 0 : durationMinutes.hashCode) +
        (imageUrl == null ? 0 : imageUrl.hashCode) +
        (videoUrl == null ? 0 : videoUrl.hashCode) +
        isActive.hashCode +
        isFeatured.hashCode +
        isAvailable.hashCode +
        (maxBookingsPerDay == null ? 0 : maxBookingsPerDay.hashCode) +
        (advanceNoticeDays == null ? 0 : advanceNoticeDays.hashCode) +
        sortOrder.hashCode +
        (requirements == null ? 0 : requirements.hashCode) +
        (cancellationPolicy == null ? 0 : cancellationPolicy.hashCode) +
        pricingTiers.hashCode +
        createdAt.hashCode +
        updatedAt.hashCode;

  factory ServiceDetail.fromJson(Map<String, dynamic> json) => _$ServiceDetailFromJson(json);

  Map<String, dynamic> toJson() => _$ServiceDetailToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

