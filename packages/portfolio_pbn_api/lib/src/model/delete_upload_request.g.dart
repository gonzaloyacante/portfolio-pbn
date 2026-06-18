// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_upload_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DeleteUploadRequest _$DeleteUploadRequestFromJson(Map<String, dynamic> json) =>
    $checkedCreate('DeleteUploadRequest', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['publicId']);
      final val = DeleteUploadRequest(
        publicId: $checkedConvert('publicId', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$DeleteUploadRequestToJson(
  DeleteUploadRequest instance,
) => <String, dynamic>{'publicId': instance.publicId};
