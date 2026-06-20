// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_me_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UpdateMeResponse _$UpdateMeResponseFromJson(Map<String, dynamic> json) =>
    $checkedCreate('UpdateMeResponse', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['ok']);
      final val = UpdateMeResponse(ok: $checkedConvert('ok', (v) => v as bool));
      return val;
    });

Map<String, dynamic> _$UpdateMeResponseToJson(UpdateMeResponse instance) =>
    <String, dynamic>{'ok': instance.ok};
