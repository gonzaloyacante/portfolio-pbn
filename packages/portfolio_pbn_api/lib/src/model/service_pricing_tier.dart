//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

part 'service_pricing_tier.g.dart';


@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ServicePricingTier {
  /// Returns a new [ServicePricingTier] instance.
  ServicePricingTier({

    required  this.id,

    required  this.name,

    required  this.price,

    required  this.description,

    required  this.sortOrder,
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



      /// Precio como string (Decimal serializado)
  @JsonKey(
    
    name: r'price',
    required: true,
    includeIfNull: false,
  )


  final String price;



  @JsonKey(
    
    name: r'description',
    required: true,
    includeIfNull: true,
  )


  final String? description;



  @JsonKey(
    
    name: r'sortOrder',
    required: true,
    includeIfNull: false,
  )


  final num sortOrder;





    @override
    bool operator ==(Object other) => identical(this, other) || other is ServicePricingTier &&
      other.id == id &&
      other.name == name &&
      other.price == price &&
      other.description == description &&
      other.sortOrder == sortOrder;

    @override
    int get hashCode =>
        id.hashCode +
        name.hashCode +
        price.hashCode +
        (description == null ? 0 : description.hashCode) +
        sortOrder.hashCode;

  factory ServicePricingTier.fromJson(Map<String, dynamic> json) => _$ServicePricingTierFromJson(json);

  Map<String, dynamic> toJson() => _$ServicePricingTierToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }

}

