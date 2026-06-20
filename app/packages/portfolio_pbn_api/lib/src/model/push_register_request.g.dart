// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'push_register_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PushRegisterRequest _$PushRegisterRequestFromJson(Map<String, dynamic> json) =>
    $checkedCreate('PushRegisterRequest', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['token', 'platform']);
      final val = PushRegisterRequest(
        token: $checkedConvert('token', (v) => v as String),
        platform: $checkedConvert(
          'platform',
          (v) => $enumDecode(_$PushRegisterRequestPlatformEnumEnumMap, v),
        ),
      );
      return val;
    });

Map<String, dynamic> _$PushRegisterRequestToJson(
  PushRegisterRequest instance,
) => <String, dynamic>{
  'token': instance.token,
  'platform': _$PushRegisterRequestPlatformEnumEnumMap[instance.platform]!,
};

const _$PushRegisterRequestPlatformEnumEnumMap = {
  PushRegisterRequestPlatformEnum.android: 'android',
  PushRegisterRequestPlatformEnum.ios: 'ios',
};
