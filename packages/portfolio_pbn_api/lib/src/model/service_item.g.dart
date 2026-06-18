// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'service_item.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ServiceItem _$ServiceItemFromJson(Map<String, dynamic> json) =>
    $checkedCreate('ServiceItem', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const [
          'id',
          'name',
          'slug',
          'shortDesc',
          'price',
          'priceLabel',
          'currency',
          'duration',
          'imageUrl',
          'isActive',
          'isFeatured',
          'isAvailable',
          'sortOrder',
          'createdAt',
          'updatedAt',
        ],
      );
      final val = ServiceItem(
        id: $checkedConvert('id', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
        slug: $checkedConvert('slug', (v) => v as String),
        shortDesc: $checkedConvert('shortDesc', (v) => v as String?),
        price: $checkedConvert('price', (v) => v as String?),
        priceLabel: $checkedConvert('priceLabel', (v) => v as String?),
        currency: $checkedConvert('currency', (v) => v as String),
        duration: $checkedConvert('duration', (v) => v as String?),
        imageUrl: $checkedConvert('imageUrl', (v) => v as String?),
        isActive: $checkedConvert('isActive', (v) => v as bool),
        isFeatured: $checkedConvert('isFeatured', (v) => v as bool),
        isAvailable: $checkedConvert('isAvailable', (v) => v as bool),
        sortOrder: $checkedConvert('sortOrder', (v) => v as num),
        createdAt: $checkedConvert('createdAt', (v) => v as String),
        updatedAt: $checkedConvert('updatedAt', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$ServiceItemToJson(ServiceItem instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'slug': instance.slug,
      'shortDesc': instance.shortDesc,
      'price': instance.price,
      'priceLabel': instance.priceLabel,
      'currency': instance.currency,
      'duration': instance.duration,
      'imageUrl': instance.imageUrl,
      'isActive': instance.isActive,
      'isFeatured': instance.isFeatured,
      'isAvailable': instance.isAvailable,
      'sortOrder': instance.sortOrder,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };
