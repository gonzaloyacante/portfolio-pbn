// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_upload_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DeleteUploadResponse _$DeleteUploadResponseFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('DeleteUploadResponse', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['ok']);
  final val = DeleteUploadResponse(ok: $checkedConvert('ok', (v) => v as bool));
  return val;
});

Map<String, dynamic> _$DeleteUploadResponseToJson(
  DeleteUploadResponse instance,
) => <String, dynamic>{'ok': instance.ok};
