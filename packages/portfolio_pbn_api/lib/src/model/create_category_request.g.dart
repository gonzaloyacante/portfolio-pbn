// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_category_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateCategoryRequest _$CreateCategoryRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('CreateCategoryRequest', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['name']);
  final val = CreateCategoryRequest(
    name: $checkedConvert('name', (v) => v as String),
    slug: $checkedConvert('slug', (v) => v as String?),
    description: $checkedConvert('description', (v) => v as String?),
    coverImageUrl: $checkedConvert('coverImageUrl', (v) => v as String?),
    isActive: $checkedConvert('isActive', (v) => v as bool?),
  );
  return val;
});

Map<String, dynamic> _$CreateCategoryRequestToJson(
  CreateCategoryRequest instance,
) => <String, dynamic>{
  'name': instance.name,
  'slug': ?instance.slug,
  'description': ?instance.description,
  'coverImageUrl': ?instance.coverImageUrl,
  'isActive': ?instance.isActive,
};
