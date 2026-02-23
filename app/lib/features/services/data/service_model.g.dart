// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'service_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ServiceItemImpl _$$ServiceItemImplFromJson(Map<String, dynamic> json) =>
    _$ServiceItemImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      shortDesc: json['shortDesc'] as String?,
      price: json['price'] as String?,
      priceLabel: json['priceLabel'] as String?,
      currency: json['currency'] as String? ?? 'ARS',
      duration: json['duration'] as String?,
      imageUrl: json['imageUrl'] as String?,
      iconName: json['iconName'] as String?,
      color: json['color'] as String?,
      isActive: json['isActive'] as bool? ?? true,
      isFeatured: json['isFeatured'] as bool? ?? false,
      isAvailable: json['isAvailable'] as bool? ?? true,
      sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
      bookingCount: (json['bookingCount'] as num?)?.toInt() ?? 0,
      viewCount: (json['viewCount'] as num?)?.toInt() ?? 0,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );

Map<String, dynamic> _$$ServiceItemImplToJson(_$ServiceItemImpl instance) =>
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
      'iconName': instance.iconName,
      'color': instance.color,
      'isActive': instance.isActive,
      'isFeatured': instance.isFeatured,
      'isAvailable': instance.isAvailable,
      'sortOrder': instance.sortOrder,
      'bookingCount': instance.bookingCount,
      'viewCount': instance.viewCount,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };

_$ServiceDetailImpl _$$ServiceDetailImplFromJson(Map<String, dynamic> json) =>
    _$ServiceDetailImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String?,
      shortDesc: json['shortDesc'] as String?,
      price: json['price'] as String?,
      priceLabel: json['priceLabel'] as String?,
      currency: json['currency'] as String? ?? 'ARS',
      duration: json['duration'] as String?,
      durationMinutes: (json['durationMinutes'] as num?)?.toInt(),
      imageUrl: json['imageUrl'] as String?,
      iconName: json['iconName'] as String?,
      color: json['color'] as String?,
      isActive: json['isActive'] as bool? ?? true,
      isFeatured: json['isFeatured'] as bool? ?? false,
      isAvailable: json['isAvailable'] as bool? ?? true,
      maxBookingsPerDay: (json['maxBookingsPerDay'] as num?)?.toInt(),
      advanceNoticeDays: (json['advanceNoticeDays'] as num?)?.toInt(),
      sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
      metaTitle: json['metaTitle'] as String?,
      metaDescription: json['metaDescription'] as String?,
      metaKeywords:
          (json['metaKeywords'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      requirements: json['requirements'] as String?,
      cancellationPolicy: json['cancellationPolicy'] as String?,
      bookingCount: (json['bookingCount'] as num?)?.toInt() ?? 0,
      viewCount: (json['viewCount'] as num?)?.toInt() ?? 0,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );

Map<String, dynamic> _$$ServiceDetailImplToJson(_$ServiceDetailImpl instance) =>
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
      'iconName': instance.iconName,
      'color': instance.color,
      'isActive': instance.isActive,
      'isFeatured': instance.isFeatured,
      'isAvailable': instance.isAvailable,
      'maxBookingsPerDay': instance.maxBookingsPerDay,
      'advanceNoticeDays': instance.advanceNoticeDays,
      'sortOrder': instance.sortOrder,
      'metaTitle': instance.metaTitle,
      'metaDescription': instance.metaDescription,
      'metaKeywords': instance.metaKeywords,
      'requirements': instance.requirements,
      'cancellationPolicy': instance.cancellationPolicy,
      'bookingCount': instance.bookingCount,
      'viewCount': instance.viewCount,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };
