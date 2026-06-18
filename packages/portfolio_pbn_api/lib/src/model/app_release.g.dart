// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_release.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AppRelease _$AppReleaseFromJson(Map<String, dynamic> json) =>
    $checkedCreate('AppRelease', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const [
          'id',
          'version',
          'versionCode',
          'releaseNotes',
          'downloadUrl',
          'checksumSha256',
          'mandatory',
          'minVersion',
          'fileSizeBytes',
          'publishedAt',
        ],
      );
      final val = AppRelease(
        id: $checkedConvert('id', (v) => v as String),
        version: $checkedConvert('version', (v) => v as String),
        versionCode: $checkedConvert('versionCode', (v) => v as num),
        releaseNotes: $checkedConvert('releaseNotes', (v) => v as String),
        downloadUrl: $checkedConvert('downloadUrl', (v) => v as String),
        checksumSha256: $checkedConvert('checksumSha256', (v) => v as String?),
        mandatory: $checkedConvert('mandatory', (v) => v as bool),
        minVersion: $checkedConvert('minVersion', (v) => v as String?),
        fileSizeBytes: $checkedConvert('fileSizeBytes', (v) => v as num?),
        publishedAt: $checkedConvert('publishedAt', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$AppReleaseToJson(AppRelease instance) =>
    <String, dynamic>{
      'id': instance.id,
      'version': instance.version,
      'versionCode': instance.versionCode,
      'releaseNotes': instance.releaseNotes,
      'downloadUrl': instance.downloadUrl,
      'checksumSha256': instance.checksumSha256,
      'mandatory': instance.mandatory,
      'minVersion': instance.minVersion,
      'fileSizeBytes': instance.fileSizeBytes,
      'publishedAt': instance.publishedAt,
    };
