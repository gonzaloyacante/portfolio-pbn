// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_service_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateServiceRequest _$CreateServiceRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('CreateServiceRequest', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['name']);
  final val = CreateServiceRequest(
    name: $checkedConvert('name', (v) => v as String),
    slug: $checkedConvert('slug', (v) => v as String?),
    description: $checkedConvert('description', (v) => v as String?),
    shortDesc: $checkedConvert('shortDesc', (v) => v as String?),
    price: $checkedConvert('price', (v) => v as num?),
    priceLabel: $checkedConvert('priceLabel', (v) => v as String?),
    currency: $checkedConvert('currency', (v) => v as String?),
    duration: $checkedConvert('duration', (v) => v as String?),
    durationMinutes: $checkedConvert(
      'durationMinutes',
      (v) => (v as num?)?.toInt(),
    ),
    imageUrl: $checkedConvert('imageUrl', (v) => v as String?),
    isActive: $checkedConvert('isActive', (v) => v as bool?),
    isFeatured: $checkedConvert('isFeatured', (v) => v as bool?),
    isAvailable: $checkedConvert('isAvailable', (v) => v as bool?),
  );
  return val;
});

Map<String, dynamic> _$CreateServiceRequestToJson(
  CreateServiceRequest instance,
) => <String, dynamic>{
  'name': instance.name,
  'slug': ?instance.slug,
  'description': ?instance.description,
  'shortDesc': ?instance.shortDesc,
  'price': ?instance.price,
  'priceLabel': ?instance.priceLabel,
  'currency': ?instance.currency,
  'duration': ?instance.duration,
  'durationMinutes': ?instance.durationMinutes,
  'imageUrl': ?instance.imageUrl,
  'isActive': ?instance.isActive,
  'isFeatured': ?instance.isFeatured,
  'isAvailable': ?instance.isAvailable,
};
