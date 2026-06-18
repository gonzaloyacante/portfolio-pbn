// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'restore_trash_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

RestoreTrashResponse _$RestoreTrashResponseFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('RestoreTrashResponse', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['ok', 'id']);
  final val = RestoreTrashResponse(
    ok: $checkedConvert('ok', (v) => v as bool),
    id: $checkedConvert('id', (v) => v as String),
  );
  return val;
});

Map<String, dynamic> _$RestoreTrashResponseToJson(
  RestoreTrashResponse instance,
) => <String, dynamic>{'ok': instance.ok, 'id': instance.id};
