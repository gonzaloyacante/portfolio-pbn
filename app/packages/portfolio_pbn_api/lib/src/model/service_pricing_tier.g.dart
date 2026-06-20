// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'service_pricing_tier.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ServicePricingTier _$ServicePricingTierFromJson(Map<String, dynamic> json) =>
    $checkedCreate('ServicePricingTier', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const ['id', 'name', 'price', 'description', 'sortOrder'],
      );
      final val = ServicePricingTier(
        id: $checkedConvert('id', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
        price: $checkedConvert('price', (v) => v as String),
        description: $checkedConvert('description', (v) => v as String?),
        sortOrder: $checkedConvert('sortOrder', (v) => v as num),
      );
      return val;
    });

Map<String, dynamic> _$ServicePricingTierToJson(ServicePricingTier instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'price': instance.price,
      'description': instance.description,
      'sortOrder': instance.sortOrder,
    };
