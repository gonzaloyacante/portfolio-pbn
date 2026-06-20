// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'upsert_social_link_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UpsertSocialLinkRequest _$UpsertSocialLinkRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('UpsertSocialLinkRequest', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['platform', 'url']);
  final val = UpsertSocialLinkRequest(
    platform: $checkedConvert('platform', (v) => v as String),
    url: $checkedConvert('url', (v) => v as String),
    username: $checkedConvert('username', (v) => v as String?),
    icon: $checkedConvert('icon', (v) => v as String?),
    isActive: $checkedConvert('isActive', (v) => v as bool?),
    sortOrder: $checkedConvert('sortOrder', (v) => (v as num?)?.toInt()),
  );
  return val;
});

Map<String, dynamic> _$UpsertSocialLinkRequestToJson(
  UpsertSocialLinkRequest instance,
) => <String, dynamic>{
  'platform': instance.platform,
  'url': instance.url,
  'username': ?instance.username,
  'icon': ?instance.icon,
  'isActive': ?instance.isActive,
  'sortOrder': ?instance.sortOrder,
};
