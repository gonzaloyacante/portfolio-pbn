// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'category_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_CategoryItem _$CategoryItemFromJson(Map<String, dynamic> json) => _CategoryItem(
  id: json['id'] as String,
  name: json['name'] as String,
  slug: json['slug'] as String,
  description: json['description'] as String?,
  thumbnailUrl: json['thumbnailUrl'] as String?,
  iconName: json['iconName'] as String?,
  color: json['color'] as String?,
  sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
  isActive: json['isActive'] as bool? ?? true,
  projectCount: (json['projectCount'] as num?)?.toInt() ?? 0,
  viewCount: (json['viewCount'] as num?)?.toInt() ?? 0,
  createdAt: json['createdAt'] as String,
  updatedAt: json['updatedAt'] as String,
);

Map<String, dynamic> _$CategoryItemToJson(_CategoryItem instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'slug': instance.slug,
  'description': instance.description,
  'thumbnailUrl': instance.thumbnailUrl,
  'iconName': instance.iconName,
  'color': instance.color,
  'sortOrder': instance.sortOrder,
  'isActive': instance.isActive,
  'projectCount': instance.projectCount,
  'viewCount': instance.viewCount,
  'createdAt': instance.createdAt,
  'updatedAt': instance.updatedAt,
};

_CategoryDetail _$CategoryDetailFromJson(Map<String, dynamic> json) => _CategoryDetail(
  id: json['id'] as String,
  name: json['name'] as String,
  slug: json['slug'] as String,
  description: json['description'] as String?,
  thumbnailUrl: json['thumbnailUrl'] as String?,
  coverImageUrl: json['coverImageUrl'] as String?,
  iconName: json['iconName'] as String?,
  color: json['color'] as String?,
  metaTitle: json['metaTitle'] as String?,
  metaDescription: json['metaDescription'] as String?,
  metaKeywords: (json['metaKeywords'] as List<dynamic>?)?.map((e) => e as String).toList() ?? const [],
  ogImage: json['ogImage'] as String?,
  sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
  isActive: json['isActive'] as bool? ?? true,
  projectCount: (json['projectCount'] as num?)?.toInt() ?? 0,
  viewCount: (json['viewCount'] as num?)?.toInt() ?? 0,
  createdAt: json['createdAt'] as String,
  updatedAt: json['updatedAt'] as String,
);

Map<String, dynamic> _$CategoryDetailToJson(_CategoryDetail instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'slug': instance.slug,
  'description': instance.description,
  'thumbnailUrl': instance.thumbnailUrl,
  'coverImageUrl': instance.coverImageUrl,
  'iconName': instance.iconName,
  'color': instance.color,
  'metaTitle': instance.metaTitle,
  'metaDescription': instance.metaDescription,
  'metaKeywords': instance.metaKeywords,
  'ogImage': instance.ogImage,
  'sortOrder': instance.sortOrder,
  'isActive': instance.isActive,
  'projectCount': instance.projectCount,
  'viewCount': instance.viewCount,
  'createdAt': instance.createdAt,
  'updatedAt': instance.updatedAt,
};
