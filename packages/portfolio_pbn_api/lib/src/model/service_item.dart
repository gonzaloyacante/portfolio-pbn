//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'service_item.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ServiceItem {
  /// Returns a new [ServiceItem] instance.
  ServiceItem({

    required  this.id,

    required  this.name,

    required  this.slug,

    required  this.shortDesc,

    required  this.price,

    required  this.priceLabel,

    required  this.currency,

    required  this.duration,

    required  this.imageUrl,

    required  this.isActive,

    required  this.isFeatured,

    required  this.isAvailable,

    required  this.sortOrder,

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
    
    name: r'imageUrl',
    required: true,
    includeIfNull: true,
  )


  final String? imageUrl;



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
    
    name: r'sortOrder',
    required: true,
    includeIfNull: false,
  )


  final num sortOrder;



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
    bool operator ==(Object other) => identical(this, other) || other is ServiceItem &&
      other.id == id &&
      other.name == name &&
      other.slug == slug &&
      other.shortDesc == shortDesc &&
      other.price == price &&
      other.priceLabel == priceLabel &&
      other.currency == currency &&
      other.duration == duration &&
      other.imageUrl == imageUrl &&
      other.isActive == isActive &&
      other.isFeatured == isFeatured &&
      other.isAvailable == isAvailable &&
      other.sortOrder == sortOrder &&
      other.createdAt == createdAt &&
      other.updatedAt == updatedAt;

    @override
    int get hashCode =>
        id.hashCode +
        name.hashCode +
        slug.hashCode +
        (shortDesc == null ? 0 : shortDesc.hashCode) +
        (price == null ? 0 : price.hashCode) +
        (priceLabel == null ? 0 : priceLabel.hashCode) +
        currency.hashCode +
        (duration == null ? 0 : duration.hashCode) +
        (imageUrl == null ? 0 : imageUrl.hashCode) +
        isActive.hashCode +
        isFeatured.hashCode +
        isAvailable.hashCode +
        sortOrder.hashCode +
        createdAt.hashCode +
        updatedAt.hashCode;

  factory ServiceItem.fromJson(Map<String, dynamic> json) => _$ServiceItemFromJson(json);

  Map<String, dynamic> toJson() => _$ServiceItemToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

