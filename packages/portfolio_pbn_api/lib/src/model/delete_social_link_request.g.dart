// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_social_link_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DeleteSocialLinkRequest _$DeleteSocialLinkRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('DeleteSocialLinkRequest', json, ($checkedConvert) {
  final val = DeleteSocialLinkRequest(
    id: $checkedConvert('id', (v) => v as String?),
    platform: $checkedConvert('platform', (v) => v as String?),
  );
  return val;
});

Map<String, dynamic> _$DeleteSocialLinkRequestToJson(
  DeleteSocialLinkRequest instance,
) => <String, dynamic>{'id': ?instance.id, 'platform': ?instance.platform};
