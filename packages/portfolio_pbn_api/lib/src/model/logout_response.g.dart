// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'logout_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LogoutResponse _$LogoutResponseFromJson(Map<String, dynamic> json) =>
    $checkedCreate('LogoutResponse', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['ok']);
      final val = LogoutResponse(ok: $checkedConvert('ok', (v) => v as bool));
      return val;
    });

Map<String, dynamic> _$LogoutResponseToJson(LogoutResponse instance) =>
    <String, dynamic>{'ok': instance.ok};
