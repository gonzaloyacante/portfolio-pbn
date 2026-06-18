// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'refresh_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

RefreshResponse _$RefreshResponseFromJson(Map<String, dynamic> json) =>
    $checkedCreate('RefreshResponse', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['accessToken']);
      final val = RefreshResponse(
        accessToken: $checkedConvert('accessToken', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$RefreshResponseToJson(RefreshResponse instance) =>
    <String, dynamic>{'accessToken': instance.accessToken};
