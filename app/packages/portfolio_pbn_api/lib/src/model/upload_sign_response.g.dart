// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'upload_sign_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UploadSignResponse _$UploadSignResponseFromJson(Map<String, dynamic> json) =>
    $checkedCreate('UploadSignResponse', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const [
          'apiKey',
          'cloudName',
          'timestamp',
          'signature',
          'folder',
        ],
      );
      final val = UploadSignResponse(
        apiKey: $checkedConvert('apiKey', (v) => v as String),
        cloudName: $checkedConvert('cloudName', (v) => v as String),
        timestamp: $checkedConvert('timestamp', (v) => v as num),
        signature: $checkedConvert('signature', (v) => v as String),
        folder: $checkedConvert('folder', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$UploadSignResponseToJson(UploadSignResponse instance) =>
    <String, dynamic>{
      'apiKey': instance.apiKey,
      'cloudName': instance.cloudName,
      'timestamp': instance.timestamp,
      'signature': instance.signature,
      'folder': instance.folder,
    };
