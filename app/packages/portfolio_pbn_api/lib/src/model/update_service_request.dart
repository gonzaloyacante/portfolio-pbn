//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'update_service_request.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UpdateServiceRequest {
  /// Returns a new [UpdateServiceRequest] instance.
  UpdateServiceRequest({

     this.name,

     this.slug,

     this.description,

     this.shortDesc,

     this.price,

     this.priceLabel,

     this.currency,

     this.duration,

     this.durationMinutes,

     this.imageUrl,

     this.isActive,

     this.isFeatured,

     this.isAvailable,

     this.sortOrder,
  });

  @JsonKey(
    
    name: r'name',
    required: false,
    includeIfNull: false,
  )


  final String? name;



  @JsonKey(
    
    name: r'slug',
    required: false,
    includeIfNull: false,
  )


  final String? slug;



  @JsonKey(
    
    name: r'description',
    required: false,
    includeIfNull: false,
  )


  final String? description;



  @JsonKey(
    
    name: r'shortDesc',
    required: false,
    includeIfNull: false,
  )


  final String? shortDesc;



  @JsonKey(
    
    name: r'price',
    required: false,
    includeIfNull: false,
  )


  final num? price;



  @JsonKey(
    
    name: r'priceLabel',
    required: false,
    includeIfNull: false,
  )


  final String? priceLabel;



  @JsonKey(
    
    name: r'currency',
    required: false,
    includeIfNull: false,
  )


  final String? currency;



  @JsonKey(
    
    name: r'duration',
    required: false,
    includeIfNull: false,
  )


  final String? duration;



  @JsonKey(
    
    name: r'durationMinutes',
    required: false,
    includeIfNull: false,
  )


  final int? durationMinutes;



  @JsonKey(
    
    name: r'imageUrl',
    required: false,
    includeIfNull: false,
  )


  final String? imageUrl;



  @JsonKey(
    
    name: r'isActive',
    required: false,
    includeIfNull: false,
  )


  final bool? isActive;



  @JsonKey(
    
    name: r'isFeatured',
    required: false,
    includeIfNull: false,
  )


  final bool? isFeatured;



  @JsonKey(
    
    name: r'isAvailable',
    required: false,
    includeIfNull: false,
  )


  final bool? isAvailable;



  @JsonKey(
    
    name: r'sortOrder',
    required: false,
    includeIfNull: false,
  )


  final int? sortOrder;





    @override
    bool operator ==(Object other) => identical(this, other) || other is UpdateServiceRequest &&
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
      other.isActive == isActive &&
      other.isFeatured == isFeatured &&
      other.isAvailable == isAvailable &&
      other.sortOrder == sortOrder;

    @override
    int get hashCode =>
        name.hashCode +
        slug.hashCode +
        (description == null ? 0 : description.hashCode) +
        (shortDesc == null ? 0 : shortDesc.hashCode) +
        (price == null ? 0 : price.hashCode) +
        priceLabel.hashCode +
        currency.hashCode +
        (duration == null ? 0 : duration.hashCode) +
        (durationMinutes == null ? 0 : durationMinutes.hashCode) +
        (imageUrl == null ? 0 : imageUrl.hashCode) +
        isActive.hashCode +
        isFeatured.hashCode +
        isAvailable.hashCode +
        sortOrder.hashCode;

  factory UpdateServiceRequest.fromJson(Map<String, dynamic> json) => _$UpdateServiceRequestFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateServiceRequestToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

