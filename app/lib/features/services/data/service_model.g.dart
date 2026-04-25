// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'service_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ServicePricingTierItem _$ServicePricingTierItemFromJson(
  Map<String, dynamic> json,
) => _ServicePricingTierItem(
  id: json['id'] as String,
  name: json['name'] as String,
  price: json['price'] as String? ?? '',
  description: json['description'] as String?,
  sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
);

Map<String, dynamic> _$ServicePricingTierItemToJson(
  _ServicePricingTierItem instance,
) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'price': instance.price,
  'description': instance.description,
  'sortOrder': instance.sortOrder,
};

_ServiceItem _$ServiceItemFromJson(Map<String, dynamic> json) => _ServiceItem(
  id: json['id'] as String,
  name: json['name'] as String,
  slug: json['slug'] as String,
  shortDesc: json['shortDesc'] as String?,
  price: json['price'] as String?,
  priceLabel: json['priceLabel'] as String?,
  currency: json['currency'] as String? ?? 'EUR',
  duration: json['duration'] as String?,
  imageUrl: json['imageUrl'] as String?,
  isActive: json['isActive'] as bool? ?? true,
  isFeatured: json['isFeatured'] as bool? ?? false,
  isAvailable: json['isAvailable'] as bool? ?? true,
  sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
  createdAt: json['createdAt'] as String,
  updatedAt: json['updatedAt'] as String,
);

Map<String, dynamic> _$ServiceItemToJson(_ServiceItem instance) =>
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

_ServiceDetail _$ServiceDetailFromJson(Map<String, dynamic> json) =>
    _ServiceDetail(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String?,
      shortDesc: json['shortDesc'] as String?,
      price: json['price'] as String?,
      priceLabel: json['priceLabel'] as String?,
      currency: json['currency'] as String? ?? 'EUR',
      duration: json['duration'] as String?,
      durationMinutes: (json['durationMinutes'] as num?)?.toInt(),
      imageUrl: json['imageUrl'] as String?,
      videoUrl: json['videoUrl'] as String?,
      isActive: json['isActive'] as bool? ?? true,
      isFeatured: json['isFeatured'] as bool? ?? false,
      isAvailable: json['isAvailable'] as bool? ?? true,
      maxBookingsPerDay: (json['maxBookingsPerDay'] as num?)?.toInt(),
      advanceNoticeDays: (json['advanceNoticeDays'] as num?)?.toInt(),
      sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
      pricingTiers:
          (json['pricingTiers'] as List<dynamic>?)
              ?.map(
                (e) =>
                    ServicePricingTierItem.fromJson(e as Map<String, dynamic>),
              )
              .toList() ??
          const [],
      requirements: json['requirements'] as String?,
      cancellationPolicy: json['cancellationPolicy'] as String?,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );

Map<String, dynamic> _$ServiceDetailToJson(_ServiceDetail instance) =>
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
      'pricingTiers': instance.pricingTiers,
      'requirements': instance.requirements,
      'cancellationPolicy': instance.cancellationPolicy,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };
