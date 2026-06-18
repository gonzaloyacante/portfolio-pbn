// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'login_response_user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LoginResponseUser _$LoginResponseUserFromJson(Map<String, dynamic> json) =>
    $checkedCreate('LoginResponseUser', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['id', 'email', 'name']);
      final val = LoginResponseUser(
        id: $checkedConvert('id', (v) => v as String),
        email: $checkedConvert('email', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$LoginResponseUserToJson(LoginResponseUser instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'name': instance.name,
    };
