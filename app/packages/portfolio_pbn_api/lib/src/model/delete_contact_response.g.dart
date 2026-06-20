// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_contact_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DeleteContactResponse _$DeleteContactResponseFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('DeleteContactResponse', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['ok']);
  final val = DeleteContactResponse(
    ok: $checkedConvert('ok', (v) => v as bool),
  );
  return val;
});

Map<String, dynamic> _$DeleteContactResponseToJson(
  DeleteContactResponse instance,
) => <String, dynamic>{'ok': instance.ok};
