// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_category_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UpdateCategoryRequest _$UpdateCategoryRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('UpdateCategoryRequest', json, ($checkedConvert) {
  final val = UpdateCategoryRequest(
    name: $checkedConvert('name', (v) => v as String?),
    slug: $checkedConvert('slug', (v) => v as String?),
    description: $checkedConvert('description', (v) => v as String?),
    coverImageUrl: $checkedConvert('coverImageUrl', (v) => v as String?),
    isActive: $checkedConvert('isActive', (v) => v as bool?),
    sortOrder: $checkedConvert('sortOrder', (v) => (v as num?)?.toInt()),
  );
  return val;
});

Map<String, dynamic> _$UpdateCategoryRequestToJson(
  UpdateCategoryRequest instance,
) => <String, dynamic>{
  'name': ?instance.name,
  'slug': ?instance.slug,
  'description': ?instance.description,
  'coverImageUrl': ?instance.coverImageUrl,
  'isActive': ?instance.isActive,
  'sortOrder': ?instance.sortOrder,
};
