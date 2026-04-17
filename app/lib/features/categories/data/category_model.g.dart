// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'category_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_CategoryItem _$CategoryItemFromJson(Map<String, dynamic> json) =>
    _CategoryItem(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String?,
      coverImageUrl: json['coverImageUrl'] as String?,
      sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
      isActive: json['isActive'] as bool? ?? true,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );

Map<String, dynamic> _$CategoryItemToJson(_CategoryItem instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'slug': instance.slug,
      'description': instance.description,
      'coverImageUrl': instance.coverImageUrl,
      'sortOrder': instance.sortOrder,
      'isActive': instance.isActive,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };

_CategoryDetail _$CategoryDetailFromJson(Map<String, dynamic> json) =>
    _CategoryDetail(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String?,
      coverImageUrl: json['coverImageUrl'] as String?,
      sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
      isActive: json['isActive'] as bool? ?? true,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );

Map<String, dynamic> _$CategoryDetailToJson(_CategoryDetail instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'slug': instance.slug,
      'description': instance.description,
      'coverImageUrl': instance.coverImageUrl,
      'sortOrder': instance.sortOrder,
      'isActive': instance.isActive,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };

_GalleryImageItem _$GalleryImageItemFromJson(Map<String, dynamic> json) =>
    _GalleryImageItem(
      id: json['id'] as String,
      url: json['url'] as String,
      publicId: json['publicId'] as String?,
      order: (json['order'] as num).toInt(),
      categoryId: json['categoryId'] as String,
      width: (json['width'] as num?)?.toInt(),
      height: (json['height'] as num?)?.toInt(),
      isFeatured: json['isFeatured'] as bool? ?? false,
    );

Map<String, dynamic> _$GalleryImageItemToJson(_GalleryImageItem instance) =>
    <String, dynamic>{
      'id': instance.id,
      'url': instance.url,
      'publicId': instance.publicId,
      'order': instance.order,
      'categoryId': instance.categoryId,
      'width': instance.width,
      'height': instance.height,
      'isFeatured': instance.isFeatured,
    };
