// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'push_register_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PushRegisterResponse _$PushRegisterResponseFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('PushRegisterResponse', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['ok']);
  final val = PushRegisterResponse(ok: $checkedConvert('ok', (v) => v as bool));
  return val;
});

Map<String, dynamic> _$PushRegisterResponseToJson(
  PushRegisterResponse instance,
) => <String, dynamic>{'ok': instance.ok};
