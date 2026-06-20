// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'category_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CategoryList _$CategoryListFromJson(Map<String, dynamic> json) =>
    $checkedCreate('CategoryList', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['data', 'pagination']);
      final val = CategoryList(
        data: $checkedConvert(
          'data',
          (v) => (v as List<dynamic>)
              .map((e) => CategoryItem.fromJson(e as Map<String, dynamic>))
              .toList(),
        ),
        pagination: $checkedConvert(
          'pagination',
          (v) => Pagination.fromJson(v as Map<String, dynamic>),
        ),
      );
      return val;
    });

Map<String, dynamic> _$CategoryListToJson(CategoryList instance) =>
    <String, dynamic>{
      'data': instance.data.map((e) => e.toJson()).toList(),
      'pagination': instance.pagination.toJson(),
    };
