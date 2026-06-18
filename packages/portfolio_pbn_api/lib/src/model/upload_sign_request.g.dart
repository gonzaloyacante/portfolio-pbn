// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'upload_sign_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UploadSignRequest _$UploadSignRequestFromJson(Map<String, dynamic> json) =>
    $checkedCreate('UploadSignRequest', json, ($checkedConvert) {
      final val = UploadSignRequest(
        folder: $checkedConvert('folder', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$UploadSignRequestToJson(UploadSignRequest instance) =>
    <String, dynamic>{'folder': ?instance.folder};
