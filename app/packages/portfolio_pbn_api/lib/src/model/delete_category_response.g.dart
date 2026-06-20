// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_category_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DeleteCategoryResponse _$DeleteCategoryResponseFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('DeleteCategoryResponse', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['ok']);
  final val = DeleteCategoryResponse(
    ok: $checkedConvert('ok', (v) => v as bool),
  );
  return val;
});

Map<String, dynamic> _$DeleteCategoryResponseToJson(
  DeleteCategoryResponse instance,
) => <String, dynamic>{'ok': instance.ok};
