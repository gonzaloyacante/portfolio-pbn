// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'push_unregister_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PushUnregisterResponse _$PushUnregisterResponseFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('PushUnregisterResponse', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['ok']);
  final val = PushUnregisterResponse(
    ok: $checkedConvert('ok', (v) => v as bool),
  );
  return val;
});

Map<String, dynamic> _$PushUnregisterResponseToJson(
  PushUnregisterResponse instance,
) => <String, dynamic>{'ok': instance.ok};
