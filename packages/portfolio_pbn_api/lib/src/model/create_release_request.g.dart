// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_release_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateReleaseRequest _$CreateReleaseRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('CreateReleaseRequest', json, ($checkedConvert) {
  $checkKeys(
    json,
    requiredKeys: const [
      'version',
      'versionCode',
      'releaseNotes',
      'downloadUrl',
    ],
  );
  final val = CreateReleaseRequest(
    version: $checkedConvert('version', (v) => v as String),
    versionCode: $checkedConvert('versionCode', (v) => (v as num).toInt()),
    releaseNotes: $checkedConvert('releaseNotes', (v) => v as String),
    downloadUrl: $checkedConvert('downloadUrl', (v) => v as String),
    checksumSha256: $checkedConvert('checksumSha256', (v) => v as String?),
    mandatory: $checkedConvert('mandatory', (v) => v as bool?),
    minVersion: $checkedConvert('minVersion', (v) => v as String?),
    fileSizeBytes: $checkedConvert(
      'fileSizeBytes',
      (v) => (v as num?)?.toInt(),
    ),
  );
  return val;
});

Map<String, dynamic> _$CreateReleaseRequestToJson(
  CreateReleaseRequest instance,
) => <String, dynamic>{
  'version': instance.version,
  'versionCode': instance.versionCode,
  'releaseNotes': instance.releaseNotes,
  'downloadUrl': instance.downloadUrl,
  'checksumSha256': ?instance.checksumSha256,
  'mandatory': ?instance.mandatory,
  'minVersion': ?instance.minVersion,
  'fileSizeBytes': ?instance.fileSizeBytes,
};
