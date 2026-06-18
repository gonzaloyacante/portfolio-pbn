// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'push_unregister_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PushUnregisterRequest _$PushUnregisterRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('PushUnregisterRequest', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['token']);
  final val = PushUnregisterRequest(
    token: $checkedConvert('token', (v) => v as String),
  );
  return val;
});

Map<String, dynamic> _$PushUnregisterRequestToJson(
  PushUnregisterRequest instance,
) => <String, dynamic>{'token': instance.token};
