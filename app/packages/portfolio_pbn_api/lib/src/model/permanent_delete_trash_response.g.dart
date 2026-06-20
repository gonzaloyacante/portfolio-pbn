// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'permanent_delete_trash_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PermanentDeleteTrashResponse _$PermanentDeleteTrashResponseFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('PermanentDeleteTrashResponse', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['ok']);
  final val = PermanentDeleteTrashResponse(
    ok: $checkedConvert('ok', (v) => v as bool),
  );
  return val;
});

Map<String, dynamic> _$PermanentDeleteTrashResponseToJson(
  PermanentDeleteTrashResponse instance,
) => <String, dynamic>{'ok': instance.ok};
