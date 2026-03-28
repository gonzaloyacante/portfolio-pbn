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
      thumbnailUrl: json['thumbnailUrl'] as String?,
      coverImageUrl: json['coverImageUrl'] as String?,
      sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
      isActive: json['isActive'] as bool? ?? true,
      projectCount: (json['projectCount'] as num?)?.toInt() ?? 0,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );

Map<String, dynamic> _$CategoryItemToJson(_CategoryItem instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'slug': instance.slug,
      'description': instance.description,
      'thumbnailUrl': instance.thumbnailUrl,
      'coverImageUrl': instance.coverImageUrl,
      'sortOrder': instance.sortOrder,
      'isActive': instance.isActive,
      'projectCount': instance.projectCount,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };

_CategoryDetail _$CategoryDetailFromJson(Map<String, dynamic> json) =>
    _CategoryDetail(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String?,
      thumbnailUrl: json['thumbnailUrl'] as String?,
      coverImageUrl: json['coverImageUrl'] as String?,
      metaTitle: json['metaTitle'] as String?,
      metaDescription: json['metaDescription'] as String?,
      metaKeywords:
          (json['metaKeywords'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      ogImage: json['ogImage'] as String?,
      sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
      isActive: json['isActive'] as bool? ?? true,
      projectCount: (json['projectCount'] as num?)?.toInt() ?? 0,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );

Map<String, dynamic> _$CategoryDetailToJson(_CategoryDetail instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'slug': instance.slug,
      'description': instance.description,
      'thumbnailUrl': instance.thumbnailUrl,
      'coverImageUrl': instance.coverImageUrl,
      'metaTitle': instance.metaTitle,
      'metaDescription': instance.metaDescription,
      'metaKeywords': instance.metaKeywords,
      'ogImage': instance.ogImage,
      'sortOrder': instance.sortOrder,
      'isActive': instance.isActive,
      'projectCount': instance.projectCount,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };

_GalleryImageItem _$GalleryImageItemFromJson(Map<String, dynamic> json) =>
    _GalleryImageItem(
      id: json['id'] as String,
      url: json['url'] as String,
      thumbnailUrl: json['thumbnailUrl'] as String,
      publicId: json['publicId'] as String?,
      alt: json['alt'] as String?,
      caption: json['caption'] as String?,
      width: (json['width'] as num?)?.toInt(),
      height: (json['height'] as num?)?.toInt(),
      isCover: json['isCover'] as bool? ?? false,
      isHero: json['isHero'] as bool? ?? false,
      categoryGalleryOrder: (json['categoryGalleryOrder'] as num?)?.toInt(),
      projectId: json['projectId'] as String,
      projectTitle: json['projectTitle'] as String,
      projectSlug: json['projectSlug'] as String,
    );

Map<String, dynamic> _$GalleryImageItemToJson(_GalleryImageItem instance) =>
    <String, dynamic>{
      'id': instance.id,
      'url': instance.url,
      'thumbnailUrl': instance.thumbnailUrl,
      'publicId': instance.publicId,
      'alt': instance.alt,
      'caption': instance.caption,
      'width': instance.width,
      'height': instance.height,
      'isCover': instance.isCover,
      'isHero': instance.isHero,
      'categoryGalleryOrder': instance.categoryGalleryOrder,
      'projectId': instance.projectId,
      'projectTitle': instance.projectTitle,
      'projectSlug': instance.projectSlug,
    };
