// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_release_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DeleteReleaseResponse _$DeleteReleaseResponseFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('DeleteReleaseResponse', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['ok']);
  final val = DeleteReleaseResponse(
    ok: $checkedConvert('ok', (v) => v as bool),
  );
  return val;
});

Map<String, dynamic> _$DeleteReleaseResponseToJson(
  DeleteReleaseResponse instance,
) => <String, dynamic>{'ok': instance.ok};
