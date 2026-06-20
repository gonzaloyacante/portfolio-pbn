// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'category_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CategoryDetail _$CategoryDetailFromJson(Map<String, dynamic> json) =>
    $checkedCreate('CategoryDetail', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const [
          'id',
          'name',
          'slug',
          'description',
          'coverImageUrl',
          'sortOrder',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
      );
      final val = CategoryDetail(
        id: $checkedConvert('id', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
        slug: $checkedConvert('slug', (v) => v as String),
        description: $checkedConvert('description', (v) => v as String?),
        coverImageUrl: $checkedConvert('coverImageUrl', (v) => v as String?),
        sortOrder: $checkedConvert('sortOrder', (v) => v as num),
        isActive: $checkedConvert('isActive', (v) => v as bool),
        createdAt: $checkedConvert('createdAt', (v) => v as String),
        updatedAt: $checkedConvert('updatedAt', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$CategoryDetailToJson(CategoryDetail instance) =>
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
