// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ProjectCategoryImpl _$$ProjectCategoryImplFromJson(
  Map<String, dynamic> json,
) => _$ProjectCategoryImpl(
  id: json['id'] as String,
  name: json['name'] as String,
  slug: json['slug'] as String,
);

Map<String, dynamic> _$$ProjectCategoryImplToJson(
  _$ProjectCategoryImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'slug': instance.slug,
};

_$ProjectImageImpl _$$ProjectImageImplFromJson(Map<String, dynamic> json) =>
    _$ProjectImageImpl(
      id: json['id'] as String,
      imageUrl: json['url'] as String,
      altText: json['alt'] as String?,
      sortOrder: (json['order'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$$ProjectImageImplToJson(_$ProjectImageImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'url': instance.imageUrl,
      'alt': instance.altText,
      'order': instance.sortOrder,
    };

_$ProjectListItemImpl _$$ProjectListItemImplFromJson(
  Map<String, dynamic> json,
) => _$ProjectListItemImpl(
  id: json['id'] as String,
  title: json['title'] as String,
  slug: json['slug'] as String,
  excerpt: json['excerpt'] as String?,
  thumbnailUrl: json['thumbnailUrl'] as String,
  date: json['date'] as String,
  sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
  isFeatured: json['isFeatured'] as bool? ?? false,
  isPinned: json['isPinned'] as bool? ?? false,
  isActive: json['isActive'] as bool? ?? true,
  viewCount: (json['viewCount'] as num?)?.toInt() ?? 0,
  createdAt: json['createdAt'] as String,
  updatedAt: json['updatedAt'] as String,
  category: ProjectCategory.fromJson(json['category'] as Map<String, dynamic>),
);

Map<String, dynamic> _$$ProjectListItemImplToJson(
  _$ProjectListItemImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'title': instance.title,
  'slug': instance.slug,
  'excerpt': instance.excerpt,
  'thumbnailUrl': instance.thumbnailUrl,
  'date': instance.date,
  'sortOrder': instance.sortOrder,
  'isFeatured': instance.isFeatured,
  'isPinned': instance.isPinned,
  'isActive': instance.isActive,
  'viewCount': instance.viewCount,
  'createdAt': instance.createdAt,
  'updatedAt': instance.updatedAt,
  'category': instance.category,
};

_$ProjectDetailImpl _$$ProjectDetailImplFromJson(Map<String, dynamic> json) =>
    _$ProjectDetailImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String,
      excerpt: json['excerpt'] as String?,
      thumbnailUrl: json['thumbnailUrl'] as String,
      videoUrl: json['videoUrl'] as String?,
      date: json['date'] as String,
      duration: json['duration'] as String?,
      client: json['client'] as String?,
      location: json['location'] as String?,
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
          const [],
      metaTitle: json['metaTitle'] as String?,
      metaDescription: json['metaDescription'] as String?,
      metaKeywords:
          (json['metaKeywords'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      ogImage: json['ogImage'] as String?,
      categoryId: json['categoryId'] as String,
      sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
      isFeatured: json['isFeatured'] as bool? ?? false,
      isPinned: json['isPinned'] as bool? ?? false,
      isActive: json['isActive'] as bool? ?? true,
      viewCount: (json['viewCount'] as num?)?.toInt() ?? 0,
      likeCount: (json['likeCount'] as num?)?.toInt() ?? 0,
      publishedAt: json['publishedAt'] as String?,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
      category: ProjectCategory.fromJson(
        json['category'] as Map<String, dynamic>,
      ),
      images:
          (json['images'] as List<dynamic>?)
              ?.map((e) => ProjectImage.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$$ProjectDetailImplToJson(_$ProjectDetailImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'slug': instance.slug,
      'description': instance.description,
      'excerpt': instance.excerpt,
      'thumbnailUrl': instance.thumbnailUrl,
      'videoUrl': instance.videoUrl,
      'date': instance.date,
      'duration': instance.duration,
      'client': instance.client,
      'location': instance.location,
      'tags': instance.tags,
      'metaTitle': instance.metaTitle,
      'metaDescription': instance.metaDescription,
      'metaKeywords': instance.metaKeywords,
      'ogImage': instance.ogImage,
      'categoryId': instance.categoryId,
      'sortOrder': instance.sortOrder,
      'isFeatured': instance.isFeatured,
      'isPinned': instance.isPinned,
      'isActive': instance.isActive,
      'viewCount': instance.viewCount,
      'likeCount': instance.likeCount,
      'publishedAt': instance.publishedAt,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
      'category': instance.category,
      'images': instance.images,
    };
