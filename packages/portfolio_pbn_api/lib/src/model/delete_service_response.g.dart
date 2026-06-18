// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_service_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DeleteServiceResponse _$DeleteServiceResponseFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('DeleteServiceResponse', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['ok']);
  final val = DeleteServiceResponse(
    ok: $checkedConvert('ok', (v) => v as bool),
  );
  return val;
});

Map<String, dynamic> _$DeleteServiceResponseToJson(
  DeleteServiceResponse instance,
) => <String, dynamic>{'ok': instance.ok};
