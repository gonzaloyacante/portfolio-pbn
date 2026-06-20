// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'social_link.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SocialLink _$SocialLinkFromJson(Map<String, dynamic> json) =>
    $checkedCreate('SocialLink', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const [
          'id',
          'platform',
          'url',
          'username',
          'icon',
          'isActive',
          'sortOrder',
        ],
      );
      final val = SocialLink(
        id: $checkedConvert('id', (v) => v as String),
        platform: $checkedConvert('platform', (v) => v as String),
        url: $checkedConvert('url', (v) => v as String),
        username: $checkedConvert('username', (v) => v as String?),
        icon: $checkedConvert('icon', (v) => v as String?),
        isActive: $checkedConvert('isActive', (v) => v as bool),
        sortOrder: $checkedConvert('sortOrder', (v) => v as num),
      );
      return val;
    });

Map<String, dynamic> _$SocialLinkToJson(SocialLink instance) =>
    <String, dynamic>{
      'id': instance.id,
      'platform': instance.platform,
      'url': instance.url,
      'username': instance.username,
      'icon': instance.icon,
      'isActive': instance.isActive,
      'sortOrder': instance.sortOrder,
    };
