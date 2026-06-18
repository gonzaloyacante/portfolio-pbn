// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'service_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ServiceDetail _$ServiceDetailFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('ServiceDetail', json, ($checkedConvert) {
  $checkKeys(
    json,
    requiredKeys: const [
      'id',
      'name',
      'slug',
      'description',
      'shortDesc',
      'price',
      'priceLabel',
      'currency',
      'duration',
      'durationMinutes',
      'imageUrl',
      'videoUrl',
      'isActive',
      'isFeatured',
      'isAvailable',
      'maxBookingsPerDay',
      'advanceNoticeDays',
      'sortOrder',
      'requirements',
      'cancellationPolicy',
      'pricingTiers',
      'createdAt',
      'updatedAt',
    ],
  );
  final val = ServiceDetail(
    id: $checkedConvert('id', (v) => v as String),
    name: $checkedConvert('name', (v) => v as String),
    slug: $checkedConvert('slug', (v) => v as String),
    description: $checkedConvert('description', (v) => v as String?),
    shortDesc: $checkedConvert('shortDesc', (v) => v as String?),
    price: $checkedConvert('price', (v) => v as String?),
    priceLabel: $checkedConvert('priceLabel', (v) => v as String?),
    currency: $checkedConvert('currency', (v) => v as String),
    duration: $checkedConvert('duration', (v) => v as String?),
    durationMinutes: $checkedConvert('durationMinutes', (v) => v as num?),
    imageUrl: $checkedConvert('imageUrl', (v) => v as String?),
    videoUrl: $checkedConvert('videoUrl', (v) => v as String?),
    isActive: $checkedConvert('isActive', (v) => v as bool),
    isFeatured: $checkedConvert('isFeatured', (v) => v as bool),
    isAvailable: $checkedConvert('isAvailable', (v) => v as bool),
    maxBookingsPerDay: $checkedConvert('maxBookingsPerDay', (v) => v as num?),
    advanceNoticeDays: $checkedConvert('advanceNoticeDays', (v) => v as num?),
    sortOrder: $checkedConvert('sortOrder', (v) => v as num),
    requirements: $checkedConvert('requirements', (v) => v as String?),
    cancellationPolicy: $checkedConvert(
      'cancellationPolicy',
      (v) => v as String?,
    ),
    pricingTiers: $checkedConvert(
      'pricingTiers',
      (v) => (v as List<dynamic>)
          .map((e) => ServicePricingTier.fromJson(e as Map<String, dynamic>))
          .toList(),
    ),
    createdAt: $checkedConvert('createdAt', (v) => v as String),
    updatedAt: $checkedConvert('updatedAt', (v) => v as String),
  );
  return val;
});

Map<String, dynamic> _$ServiceDetailToJson(ServiceDetail instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'slug': instance.slug,
      'description': instance.description,
      'shortDesc': instance.shortDesc,
      'price': instance.price,
      'priceLabel': instance.priceLabel,
      'currency': instance.currency,
      'duration': instance.duration,
      'durationMinutes': instance.durationMinutes,
      'imageUrl': instance.imageUrl,
      'videoUrl': instance.videoUrl,
      'isActive': instance.isActive,
      'isFeatured': instance.isFeatured,
      'isAvailable': instance.isAvailable,
      'maxBookingsPerDay': instance.maxBookingsPerDay,
      'advanceNoticeDays': instance.advanceNoticeDays,
      'sortOrder': instance.sortOrder,
      'requirements': instance.requirements,
      'cancellationPolicy': instance.cancellationPolicy,
      'pricingTiers': instance.pricingTiers.map((e) => e.toJson()).toList(),
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };
