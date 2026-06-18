// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_social_link_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DeleteSocialLinkResponse _$DeleteSocialLinkResponseFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('DeleteSocialLinkResponse', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['ok']);
  final val = DeleteSocialLinkResponse(
    ok: $checkedConvert('ok', (v) => v as bool),
  );
  return val;
});

Map<String, dynamic> _$DeleteSocialLinkResponseToJson(
  DeleteSocialLinkResponse instance,
) => <String, dynamic>{'ok': instance.ok};
