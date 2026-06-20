// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_profile.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AdminProfile _$AdminProfileFromJson(Map<String, dynamic> json) =>
    $checkedCreate('AdminProfile', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['id', 'email', 'name', 'role']);
      final val = AdminProfile(
        id: $checkedConvert('id', (v) => v as String),
        email: $checkedConvert('email', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String?),
        role: $checkedConvert('role', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$AdminProfileToJson(AdminProfile instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'name': instance.name,
      'role': instance.role,
    };
