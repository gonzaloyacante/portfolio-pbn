// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'login_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LoginResponse _$LoginResponseFromJson(Map<String, dynamic> json) =>
    $checkedCreate('LoginResponse', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['accessToken', 'user']);
      final val = LoginResponse(
        accessToken: $checkedConvert('accessToken', (v) => v as String),
        user: $checkedConvert(
          'user',
          (v) => LoginResponseUser.fromJson(v as Map<String, dynamic>),
        ),
      );
      return val;
    });

Map<String, dynamic> _$LoginResponseToJson(LoginResponse instance) =>
    <String, dynamic>{
      'accessToken': instance.accessToken,
      'user': instance.user.toJson(),
    };
